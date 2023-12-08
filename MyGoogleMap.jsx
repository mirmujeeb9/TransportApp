import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px'
};
const center = {
    lat: 33.6844,
    lng: 73.0479
  };

const MyGoogleMap = () => {
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyD6lKQrJ35hsi1uG80L_4HA7XNc_9CkyiU" // Replace with your Google Maps API key
    >
        <div><h1>Live tracking for driver 1</h1></div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        {/* Child components, like markers, info windows, etc. */}

      </GoogleMap>
    </LoadScript>
  );
}

export default MyGoogleMap;
