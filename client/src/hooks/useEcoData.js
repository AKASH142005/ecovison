import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';

export function useEcoData(userLocation, selectedDistrict, selectedWasteType, searchTerm, showToast) {
  const [collectors, setCollectors] = useState([]);
  const [factories, setFactories] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Keep a stable ref to showToast to avoid triggering effect cascades
  const showToastRef = useRef(showToast);
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  const userLat = userLocation?.lat;
  const userLng = userLocation?.lng;

  // Fetch initial stats, districts, and bookings once on mount
  useEffect(() => {
    let isMounted = true;

    async function loadMeta() {
      try {
        const [distRes, statsRes, bookRes] = await Promise.allSettled([
          api.getDistricts(),
          api.getStats(),
          api.getBookings()
        ]);

        if (!isMounted) return;

        if (distRes.status === 'fulfilled' && distRes.value.districts) {
          setDistricts(distRes.value.districts);
        }
        if (statsRes.status === 'fulfilled' && statsRes.value.stats) {
          setStats(statsRes.value.stats);
        }
        if (bookRes.status === 'fulfilled' && bookRes.value.bookings) {
          setBookings(bookRes.value.bookings);
        }
      } catch (e) {
        console.error('Error loading metadata:', e);
      }
    }

    loadMeta();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch factories located in Chennai industrial corridors
  const loadFactories = useCallback(async () => {
    try {
      const res = await api.getFactories({
        lat: userLat,
        lng: userLng
      });
      if (res && res.success) {
        setFactories(res.factories || []);
      }
    } catch (err) {
      console.warn('Could not load Chennai factories:', err);
    }
  }, [userLat, userLng]);

  // Fetch collectors whenever user location, waste type, district or search changes
  const loadCollectors = useCallback(async (onLoadedCallback) => {
    setIsLoading(true);
    try {
      const params = {
        wasteType: selectedWasteType,
        district: selectedDistrict,
        lat: userLat,
        lng: userLng,
        search: searchTerm
      };

      const res = await api.getCollectors(params);
      if (res && res.success) {
        const loaded = res.collectors || [];
        setCollectors(loaded);
        if (onLoadedCallback) {
          onLoadedCallback(loaded);
        }
      }
    } catch (err) {
      console.error('Failed to load collectors:', err);
      showToastRef.current?.('Could not refresh collectors. Ensure Fastify backend is running.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [selectedWasteType, selectedDistrict, userLat, userLng, searchTerm]);

  // Controlled effects tied strictly to primitive filter/location values
  useEffect(() => {
    console.log('[DEBUG useEffect loadCollectors triggered]');
    loadCollectors();
  }, [loadCollectors]);

  useEffect(() => {
    console.log('[DEBUG useEffect loadFactories triggered]');
    loadFactories();
  }, [loadFactories]);

  const addBooking = (newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  return {
    collectors,
    setCollectors,
    factories,
    setFactories,
    selectedFactory,
    setSelectedFactory,
    districts,
    stats,
    bookings,
    setBookings,
    addBooking,
    isLoading,
    loadCollectors,
    loadFactories
  };
}
