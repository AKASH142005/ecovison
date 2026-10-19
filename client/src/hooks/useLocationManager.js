import { useState } from 'react';
import { DEFAULT_CHENNAI_CENTER } from '../constants/chennaiZones';
import { reverseGeocode } from '../services/geocoding';

export function useLocationManager(showToast) {
  const [userLocation, setUserLocation] = useState(DEFAULT_CHENNAI_CENTER);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  // Handle GPS detection with high accuracy & reverse geocoding
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      showToast?.('Geolocation is not supported by your browser', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy || 0);

        // Check if coordinate is approximately within or near Chennai
        const isChennai = lat >= 12.8 && lat <= 13.4 && lng >= 80.0 && lng <= 80.4;

        let locationName = isChennai ? 'Your Chennai Ward GPS' : 'Detected GPS Location';
        let fullAddress = '';
        try {
          const geo = await reverseGeocode(lat, lng);
          if (geo && geo.shortName) {
            locationName = geo.shortName;
            fullAddress = geo.fullName;
          }
        } catch (e) {
          console.warn('Reverse geocoding error:', e);
        }

        setUserLocation({
          lat,
          lng,
          zoom: 14,
          accuracy,
          name: locationName,
          address: fullAddress,
          isManual: false
        });
        setIsLocating(false);

        if (accuracy > 1000) {
          showToast?.(`Estimated location (±${(accuracy / 1000).toFixed(1)} km). Drag the green pin to refine your exact house or ward!`, 'warning');
        } else if (accuracy > 80) {
          showToast?.(`Location detected: ${locationName} (±${accuracy}m). Drag pin on map for doorstep precision.`, 'info');
        } else {
          showToast?.(`Accurate GPS location locked in Chennai: ${locationName}!`, 'success');
        }
      },
      (err) => {
        setIsLocating(false);
        showToast?.('Location permission denied or unavailable. Click any Chennai zone below to position map.', 'warning');
      },
      { timeout: 15000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  // Handle user manual click, search, or pin drag on map
  const handleMapClickUpdate = async (coords) => {
    let locationName = coords.name || `Pin (${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)})`;
    let fullAddress = coords.address || '';

    // If reverse-geocoded name is missing (clicked/dragged directly on map), fetch it
    if (!coords.name || coords.name.startsWith('Pin (')) {
      try {
        const geo = await reverseGeocode(coords.lat, coords.lng);
        if (geo && geo.shortName) {
          locationName = geo.shortName;
          fullAddress = geo.fullName;
        }
      } catch (e) {
        console.warn('Reverse geocode error:', e);
      }
    }

    setUserLocation({
      lat: coords.lat,
      lng: coords.lng,
      zoom: coords.zoom || userLocation.zoom || 14,
      accuracy: coords.accuracy || null,
      name: locationName,
      address: fullAddress,
      isManual: true
    });
    showToast?.(`Origin set to ${locationName}! Distances updated.`, 'info');
  };

  // Handle Quick Zone Click
  const handleSelectDistrict = (zoneKey, zoneInfo) => {
    setSelectedDistrict(zoneKey);
    setUserLocation({
      lat: zoneInfo.lat,
      lng: zoneInfo.lng,
      zoom: zoneInfo.zoom || 13.5,
      name: zoneInfo.label
    });
  };

  return {
    userLocation,
    setUserLocation,
    isLocating,
    selectedDistrict,
    setSelectedDistrict,
    handleLocateUser,
    handleMapClickUpdate,
    handleSelectDistrict
  };
}
