import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

import { Feature } from 'geojson';

import GlobalLoader from 'components/GlobalLoader';
import { fetchAssets } from 'store/asset';
import { assetSelector } from 'selectors';
import { ApiState } from 'types/ApiState';
import {
  assetSimpleRenderer,
  assetConditionRenderer,
  assetPopupTemplate,
} from 'consts';

const MapViewer = () => {
  const dispatch = useDispatch<any>();
  const { assets, service, status } = useSelector(assetSelector);
  const [globalLoading, setGlobalLoading] = useState<boolean>(false);
  const mapRef = useRef(null);
  const [mapView, setMapView] = useState<MapView | undefined>(undefined);

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
      title: 'Assets All',
      renderer: assetSimpleRenderer,
      popupTemplate: assetPopupTemplate,
    });

    const stopLayer = new GeoJSONLayer({
      id: 'asset-stop-layer',
      url: URL.createObjectURL(
        new Blob(
          [
            JSON.stringify({
              type: 'FeatureCollection',
              features: allFeatures.filter(
                feature => feature.properties?.assetType === 'Stop Sign',
              ),
            }),
          ],
          {
            type: 'application/json',
          },
        ),
      ),
      title: 'Stop Sign',
      renderer: assetConditionRenderer,
      popupTemplate: assetPopupTemplate,
    });

    const schoolLayer = new GeoJSONLayer({
      id: 'asset-school-layer',
      url: URL.createObjectURL(
        new Blob(
          [
            JSON.stringify({
              type: 'FeatureCollection',
              features: allFeatures.filter(
                feature => feature.properties?.assetType === 'School Sign',
              ),
            }),
          ],
          {
            type: 'application/json',
          },
        ),
      ),
      title: 'School Sign',
      renderer: assetConditionRenderer,
      popupTemplate: assetPopupTemplate,
    });

    const assetGroupLayer = new GroupLayer({
      id: 'asset-group-layer',
      title: 'Assets',
      visible: true,
      visibilityMode: 'exclusive',
      layers: [schoolLayer, stopLayer, assetAllLayer],
      opacity: 1,
    });

    mapView?.map.add(assetGroupLayer);
    assetAllLayer.load().then(() => {
      // view.extent = extent;
      mapView?.goTo(assetAllLayer.fullExtent, { duration: 2400 });
      setGlobalLoading(false);
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
    loadMap();

    return () => mapView && mapView.destroy();
  }, []);

  return (
    <>
      {globalLoading && <GlobalLoader />}
      <div
        id="mapContainer"
        ref={mapRef}
        style={{ height: '100%', width: '100%' }}
      />
    </>
  );
};

export default MapViewer;
