import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
// import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import Extent from '@arcgis/core/geometry/Extent';
import * as turf from '@turf/turf';
import { Feature, FeatureCollection } from 'geojson';

import { stopSelector } from 'selectors';

const MapViewer = () => {
  const { stops } = useSelector(stopSelector);
  const mapRef = useRef(null);
  const [mapView, setMapView] = useState<MapView | undefined>(undefined);

  useEffect(() => {
    if (mapRef.current) {
      /**
       * Initialize application
       */
      const stopGeoJSON: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };
      stops.forEach(stopItem => {
        const newFeature: Feature = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [stopItem.Longitude, stopItem.Latitude],
          },
          properties: { ...stopItem },
        };
        stopGeoJSON.features.push(newFeature);
      });
      const blob = new Blob([JSON.stringify(stopGeoJSON)], {
        type: 'application/json',
      });

      // URL reference to the blob
      const url = URL.createObjectURL(blob);

      const stopRenderer: any = {
        type: 'simple',
        symbol: {
          type: 'simple-marker',
          color: 'orange',
          outline: {
            color: 'white',
          },
        },
        // visualVariables: [],
      };

      const stopLayer = new GeoJSONLayer({
        id: 'stop-layer',
        url,
        renderer: stopRenderer,
        // popupTemplate: stopPopupTemplate,
      });

      const webmap = new Map({
        basemap: 'dark-gray-vector',
        layers: [stopLayer],
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

      view.popup.defaultPopupTemplateEnabled = true;

      const bbox = turf.bbox(stopGeoJSON);

      const extent = new Extent({
        xmin: bbox[0],
        ymin: bbox[1],
        xmax: bbox[2],
        ymax: bbox[3],
        spatialReference: {
          wkid: 4326,
        },
      });
      view.extent = extent;

      setMapView(view);
    }

    return () => mapView && mapView.destroy();
  }, []);

  return (
    <div
      id="mapContainer"
      ref={mapRef}
      style={{ height: '100vh', width: '100%' }}
    />
  );
};

export default MapViewer;
