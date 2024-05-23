import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import { Feature, FeatureCollection } from 'geojson';

import GlobalLoader from 'components/GlobalLoader';
import { fetchAssets } from 'store/asset';
import { assetSelector } from 'selectors';
import { ApiState } from 'types/ApiState';

const MapViewer = () => {
  const dispatch = useDispatch<any>();
  const { assets, service, status } = useSelector(assetSelector);
  const [globalLoading, setGlobalLoading] = useState<boolean>(false);
  const mapRef = useRef(null);
  const [mapView, setMapView] = useState<MapView | undefined>(undefined);

  const loadMap = () => {
    if (mapRef.current) {
      const webmap = new Map({
        basemap: 'hybrid',
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
      });

      //   view.popup.defaultPopupTemplateEnabled = true;

      view.when(() => {
        const assetGeoJSON: FeatureCollection = {
          type: 'FeatureCollection',
          features: [],
        };
        assets.forEach(assetItem => {
          const newFeature: Feature = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [assetItem.longitude, assetItem.latitude],
            },
            properties: { ...assetItem },
          };
          assetGeoJSON.features.push(newFeature);
        });
        const blob = new Blob([JSON.stringify(assetGeoJSON)], {
          type: 'application/json',
        });

        // URL reference to the blob
        const url = URL.createObjectURL(blob);

        const assetRenderer: any = {
          type: 'simple',
          symbol: {
            type: 'simple-marker',
            size: 8,
            color: 'orange',
            outline: {
              color: 'white',
            },
          },
          // visualVariables: [],
        };

        const assetPopupTemplate = {
          title: 'Asset ({assetId})',
          content: [
            {
              type: 'fields',
              fieldInfos: [
                {
                  fieldName: 'assetId',
                  label: 'Asset Id',
                },
                {
                  fieldName: 'description',
                  label: 'Description',
                },
                {
                  fieldName: 'assetClass',
                  label: 'Asset Class',
                },
                {
                  fieldName: 'assetType',
                  label: 'Asset Type',
                },
                {
                  fieldName: 'condition',
                  label: 'Condition',
                },
                {
                  fieldName: 'poleId',
                  label: 'Pole Id',
                },
                {
                  fieldName: 'activeStatus',
                  label: 'Active Status',
                },
                {
                  fieldName: 'formattedStatus',
                  label: 'Formatted Status',
                },
              ],
            },
          ],
        };

        const assetLayer = new GeoJSONLayer({
          id: 'asset-layer',
          url,
          renderer: assetRenderer,
          popupTemplate: assetPopupTemplate,
        });
        view.map.add(assetLayer);
        assetLayer.load().then(() => {
          // view.extent = extent;
          view.goTo(assetLayer.fullExtent, { duration: 2400 });
          setTimeout(() => {
            setGlobalLoading(false);
            setMapView(view);
          }, 5000);
        });
      });
    }
  };

  useEffect(() => {
    if (service === 'fetchAssets') {
      if (status === ApiState.fulfilled) {
        loadMap();
      }
    }
  }, [service, status]);

  useEffect(() => {
    setGlobalLoading(true);
    dispatch(fetchAssets());
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
