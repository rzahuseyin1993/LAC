import { useState, useEffect, useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import { AddLocationAlt as AddLocationAltIcon } from '@mui/icons-material';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import GroupLayer from '@arcgis/core/layers/GroupLayer';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import Expand from '@arcgis/core/widgets/Expand';
import Zoom from '@arcgis/core/widgets/Zoom';
import Home from '@arcgis/core/widgets/Home';
import Search from '@arcgis/core/widgets/Search';
import Legend from '@arcgis/core/widgets/Legend';
import ScaleBar from '@arcgis/core/widgets/ScaleBar';
import LayerList from '@arcgis/core/widgets/LayerList';
import Compass from '@arcgis/core/widgets/Compass';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import Query from '@arcgis/core/rest/support/Query';
import { Feature } from 'geojson';

import GlobalLoader from 'components/GlobalLoader';
import { fetchAssetTypes, fetchAssets } from 'store/asset';
import { assetSelector } from 'selectors';
import { ApiState } from 'types/ApiState';
import {
  assetTypeRenderer,
  assetConditionRenderer,
  // assetPopupTemplate,
} from 'consts';
import { MainContext } from '../Main';

let tempCreateAssetToggle: boolean = false;

const MapViewer = () => {
  const dispatch = useDispatch<any>();
  const { assets, assetTypes, service, status } = useSelector(assetSelector);
  const { globalLoading, setGlobalLoading } = useContext(MainContext);
  const mapRef = useRef(null);
  const [mapView, setMapView] = useState<MapView | undefined>(undefined);
  const [isCreateAssetToggle, setCreateAssetToggle] = useState<boolean>(false);

  useEffect(() => {
    tempCreateAssetToggle = isCreateAssetToggle;
    if (mapView) {
      if (isCreateAssetToggle) {
        mapView.container.style.cursor = 'crosshair';
      } else {
        mapView.container.style.cursor = 'auto';
      }
    }
  }, [isCreateAssetToggle]);

  const handleCreateAssetButtonClick = () => {
    setCreateAssetToggle(!isCreateAssetToggle);
  };

  const handleAssetDeleted = (event: any) => {
    if (mapView) {
      const assetAllLayer = mapView.map.findLayerById(
        'asset-all-layer',
      ) as GeoJSONLayer;
      const query = new Query();
      query.where = `id = '${event.detail.id}'`;
      assetAllLayer.queryFeatures(query).then(results => {
        if (results.features.length > 0) {
          const deleteFeature = results.features[0];
          assetAllLayer.applyEdits({
            deleteFeatures: [deleteFeature],
          });
        }
      });
      assetTypes.forEach(assetTypeItem => {
        const assetTypeLayer = mapView.map.findLayerById(
          `asset-${assetTypeItem.name}-layer`,
        ) as GeoJSONLayer;
        if (assetTypeLayer) {
          assetTypeLayer.queryFeatures(query).then(results => {
            if (results.features.length > 0) {
              const deleteFeature = results.features[0];
              assetTypeLayer.applyEdits({
                deleteFeatures: [deleteFeature],
              });
            }
          });
        }
      });
    }
  };

  const handleAssetUpdated = (event: any) => {
    if (mapView) {
      const assetAllLayer = mapView.map.findLayerById(
        'asset-all-layer',
      ) as GeoJSONLayer;
      const query = new Query();
      query.where = `id = '${event.detail.id}'`;
      assetAllLayer.queryFeatures(query).then(results => {
        if (results.features.length > 0) {
          const updateFeature = results.features[0];
          const oldAssetType = updateFeature.attributes.assetType;
          updateFeature.attributes = event.detail;
          assetAllLayer.applyEdits({
            updateFeatures: [updateFeature],
          });
          if (oldAssetType === event.detail.assetType) {
            const selectLayer = mapView.map.findLayerById(
              `asset-${oldAssetType}-layer`,
            ) as GeoJSONLayer;
            if (selectLayer) {
              selectLayer.queryFeatures(query).then(results => {
                if (results.features.length > 0) {
                  const updateFeature = results.features[0];
                  updateFeature.attributes = event.detail;
                  selectLayer.applyEdits({
                    updateFeatures: [updateFeature],
                  });
                }
              });
            }
          } else {
            const oldLayer = mapView.map.findLayerById(
              `asset-${oldAssetType}-layer`,
            ) as GeoJSONLayer;
            if (oldLayer) {
              oldLayer.queryFeatures(query).then(results => {
                if (results.features.length > 0) {
                  const deleteFeature = results.features[0];
                  oldLayer.applyEdits({
                    deleteFeatures: [deleteFeature],
                  });
                }
              });
            }
            const newLayer = mapView.map.findLayerById(
              `asset-${event.detail.assetType}-layer`,
            ) as GeoJSONLayer;
            const addFeature = new Graphic({
              geometry: new Point({
                longitude: event.detail.longitude,
                latitude: event.detail.latitude,
              }),
              attributes: event.detail,
            });
            newLayer.applyEdits({
              addFeatures: [addFeature],
            });
          }
        }
      });
    }
  };

  const handleAssetCreated = (event: any) => {
    const addFeature = new Graphic({
      geometry: new Point({
        longitude: event.detail.longitude,
        latitude: event.detail.latitude,
      }),
      attributes: event.detail,
    });
    if (mapView) {
      const assetAllLayer = mapView.map.findLayerById(
        'asset-all-layer',
      ) as GeoJSONLayer;
      if (assetAllLayer) {
        assetAllLayer.applyEdits({
          addFeatures: [addFeature],
        });
      }
      assetTypes.forEach(assetTypeItem => {
        if (assetTypeItem.name === event.detail.assetType) {
          const assetTypeLayer = mapView.map.findLayerById(
            `asset-${assetTypeItem.name}-layer`,
          ) as GeoJSONLayer;
          if (assetTypeLayer) {
            assetTypeLayer.applyEdits({
              addFeatures: [addFeature],
            });
          }
        }
      });
    }
  };

  const handleMapViewHover = (event: __esri.ViewPointerMoveEvent) => {
    if (!tempCreateAssetToggle) {
      const screenPoint = {
        x: event.x,
        y: event.y,
      };
      if (mapView) {
        mapView.hitTest(screenPoint).then(response => {
          if (response.results.length > 0) {
            mapView.container.style.cursor = 'pointer';
          } else {
            mapView.container.style.cursor = 'default';
          }
        });
      }
    }
  };

  const handleMapViewClick = (event: __esri.ViewClickEvent) => {
    if (tempCreateAssetToggle) {
      // dispatch(
      //   setNewLoaction({
      //     longitude: event.mapPoint.longitude,
      //     latitude: event.mapPoint.latitude,
      //   }),
      // );
      // setModalView('createAsset');
      setCreateAssetToggle(false);
      const customEvent = new CustomEvent('createAssetModal', {
        detail: {
          lat: event.mapPoint.latitude,
          lng: event.mapPoint.longitude,
        },
      });
      window.dispatchEvent(customEvent);
    } else {
      const screenPoint = {
        x: event.x,
        y: event.y,
      };
      if (mapView) {
        mapView.hitTest(screenPoint).then(response => {
          if (response.results.length > 0) {
            //@ts-ignore
            const graphic = response.results[0].graphic;
            const attributes = graphic.attributes;
            const customEvent = new CustomEvent('detailAssetModal', {
              detail: {
                id: attributes.id,
              },
            });
            window.dispatchEvent(customEvent);
          }
        });
      }
    }
  };

  const loadMap = () => {
    if (mapRef.current) {
      const webmap = new Map({
        basemap: 'satellite',
      });
      const view = new MapView({
        container: mapRef.current, // The id or node representing the DOM element containing the view.
        map: webmap, // An instance of a Map object to display in the view.
        center: [-118.2469873, 34.0479217],
        // scale: 10000000, // Represents the map scale at the center of the view.
        zoom: 6,
        spatialReference: {
          wkid: 3857,
        },
        ui: {
          components: [],
        },
      });
      const zoom = new Zoom({
        view: view,
      });
      const home = new Home({
        view: view,
        goToOverride: view => {
          const assetAllLayer = view.map.findLayerById('asset-all-layer');
          if (assetAllLayer) {
            view.goTo(assetAllLayer.fullExtent);
          }
        },
      });
      const compass = new Compass({
        view: view,
      });
      const basemapGallery = new BasemapGallery({
        view: view,
        container: document.createElement('div'),
      });
      const bgExpand = new Expand({
        view: view,
        content: basemapGallery,
        icon: 'basemap',
        expandTooltip: 'Base Map',
      });
      const search = new Search({ view: view, icon: 'search' });
      const legend = new Legend({ view: view });
      const scaleBar = new ScaleBar({ view: view });
      const layerList = new LayerList({
        view: view,
      });
      const layerListExpand = new Expand({
        view: view,
        content: layerList,
        icon: 'layers',
        expandTooltip: 'Layers',
      });
      view.ui.add([search, zoom, home, compass], { position: 'top-right' });
      view.ui.add(legend, { position: 'bottom-left' });
      view.ui.add(scaleBar, { position: 'bottom-right' });
      view.ui.add([bgExpand, layerListExpand], { position: 'top-left' });

      view.when(() => {
        setMapView(view);
        dispatch(fetchAssets());
      });
    }
  };

  const loadAssetGroupLayer = () => {
    const allFeatures: Feature[] = [];
    assets.forEach(assetItem => {
      const newFeature: Feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [assetItem.longitude, assetItem.latitude],
        },
        properties: { ...assetItem },
      };
      allFeatures.push(newFeature);
    });

    const assetGroupLayer = new GroupLayer({
      id: 'asset-group-layer',
      title: 'Assets',
      visible: true,
      visibilityMode: 'exclusive',
      layers: [],
      opacity: 1,
    });

    const assetAllLayer = new GeoJSONLayer({
      id: 'asset-all-layer',
      url: URL.createObjectURL(
        new Blob(
          [
            JSON.stringify({
              type: 'FeatureCollection',
              features: allFeatures,
            }),
          ],
          {
            type: 'application/json',
          },
        ),
      ),
      title: `All Assets (${allFeatures.length})`,
      renderer: assetTypeRenderer(assetTypes),
      outFields: ['*'],
      // popupTemplate: assetPopupTemplate,
      editingEnabled: true,
    });

    assetTypes.forEach(assetTypeItem => {
      const filterFeatures = allFeatures.filter(
        feature => feature.properties?.assetType === assetTypeItem.name,
      );
      const assetTypeLayer = new GeoJSONLayer({
        id: `asset-${assetTypeItem.name}-layer`,
        url: URL.createObjectURL(
          new Blob(
            [
              JSON.stringify({
                type: 'FeatureCollection',
                features: filterFeatures,
              }),
            ],
            {
              type: 'application/json',
            },
          ),
        ),
        title: `${assetTypeItem.name} (${filterFeatures.length})`,
        renderer: assetConditionRenderer,
        outFields: ['*'],
        editingEnabled: true,
      });
      assetGroupLayer.layers.add(assetTypeLayer);
    });
    assetGroupLayer.layers.add(assetAllLayer);
    mapView?.map.add(assetGroupLayer);

    assetAllLayer.load().then(() => {
      setGlobalLoading(false);
      if (mapView) {
        // view.extent = extent;
        mapView?.goTo(assetAllLayer.fullExtent, { duration: 2400 });
        mapView.on('click', handleMapViewClick);
        mapView.on('pointer-move', handleMapViewHover);
      }
    });
  };

  useEffect(() => {
    if (mapView && service === 'fetchAssets') {
      if (status === ApiState.fulfilled) {
        loadAssetGroupLayer();
      }
    }
  }, [mapView, service, status]);

  useEffect(() => {
    setGlobalLoading(true);
    dispatch(fetchAssetTypes());
    loadMap();

    window.addEventListener('assetCreated', handleAssetCreated);
    window.addEventListener('assetUpdated', handleAssetUpdated);
    window.addEventListener('assetDeleted', handleAssetDeleted);
    return () => {
      window.removeEventListener('assetCreated', handleAssetCreated);
      window.removeEventListener('assetUpdated', handleAssetUpdated);
      window.removeEventListener('assetDeleted', handleAssetDeleted);
      if (mapView) {
        mapView.destroy();
      }
    };
  }, []);

  return (
    <>
      {globalLoading && <GlobalLoader />}
      <div
        id="mapContainer"
        ref={mapRef}
        style={{ height: '100%', width: '100%' }}
      />
      <div style={{ position: 'absolute', top: 120, left: 15, zIndex: 9 }}>
        <IconButton
          title="Create a new asset"
          sx={{ backgroundColor: 'white', padding: '5px' }}
          onClick={handleCreateAssetButtonClick}
        >
          <AddLocationAltIcon
            sx={{ color: isCreateAssetToggle ? 'orange' : '#777' }}
          />
        </IconButton>
      </div>
    </>
  );
};

export default MapViewer;
