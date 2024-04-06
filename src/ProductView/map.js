import React, { useState } from 'react';
import { GoogleMap, StandaloneSearchBox, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const MapWithSearchBox = () => {
  const [searchBox, setSearchBox] = useState(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });

  const onLoad = (ref) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();
    if (places && places.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();

      places.forEach((place) => {
        if (place.geometry && place.geometry.location) {
          bounds.extend(place.geometry.location);
        }
      });

      const nextCenter = {
        lat: bounds.getCenter().lat(),
        lng: bounds.getCenter().lng(),
      };

      setCenter(nextCenter);
      setMarkerPosition(nextCenter);
    }
  };

  return (
    <div>
      <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
        <input
          type="text"
          placeholder="Enter location"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `32px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
            position: 'absolute',
            left: '50%',
            marginLeft: '-120px',
          }}
        />
      </StandaloneSearchBox>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        onClick={(e) => setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
      >
        <Marker position={markerPosition} />
      </GoogleMap>
    </div>
  );
};

export default MapWithSearchBox;
