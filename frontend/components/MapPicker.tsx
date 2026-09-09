'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Form, Spinner, Alert } from 'react-bootstrap';
import { GeoAlt, Search, Crosshair } from 'react-bootstrap-icons';
import { showToast } from './ToastProvider';

// تعریف تایپ برای شیء نقشه
declare global {
  interface Window {
    map: any;
    L: any;
  }
}

interface MapPickerProps {
  onAddressSelect: (address: string, details: any) => void;
  onClose: () => void;
}

export default function MapPicker({ onAddressSelect, onClose }: MapPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [step, setStep] = useState(1); // 1: انتخاب روی نقشه, 2: تکمیل آدرس
  const [addressDetails, setAddressDetails] = useState({
    plaque: '',
    unit: '',
    floor: '',
    postalCode: '',
    recipientName: '',
    recipientPhone: ''
  });
  const [searching, setSearching] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY;

  // لود کردن اسکریپت نقشه
  useEffect(() => {
    if (!apiKey) {
      setMapError('کلید API نقشه یافت نشد. لطفاً NEXT_PUBLIC_MAP_API_KEY را در فایل .env.local تنظیم کنید.');
      return;
    }

    // لود کردن CSS نقشه
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://static.map.ir/leaflet/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // لود کردن اسکریپت Leaflet
    const script = document.createElement('script');
    script.src = 'https://static.map.ir/leaflet/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      // پاک کردن منابع
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, [apiKey]);

  const initMap = () => {
    try {
      const L = window.L;
      
      // ایجاد نقشه
      const map = L.map(mapContainer.current!).setView([35.7219, 51.3347], 12); // تهران مرکزی

      // اضافه کردن لایه نقشه از map.ir
      L.tileLayer('https://map.ir/vector/tiles/{z}/{x}/{y}.pbf', {
        attribution: 'نقشه‌ی تو از مپ‌‌آی‌آر',
        maxZoom: 19,
        minZoom: 2,
        apiKey: apiKey
      }).addTo(map);

      // نشانگر قابل کلیک
      let marker: any = null;

      // رویداد کلیک روی نقشه
      map.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;

        // حذف نشانگر قبلی
        if (marker) {
          map.removeLayer(marker);
        }

        // اضافه کردن نشانگر جدید
        marker = L.marker([lat, lng], {
          draggable: true,
          icon: L.icon({
            iconUrl: 'https://static.map.ir/marker/blue.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          })
        }).addTo(map);

        // دریافت آدرس از مختصات
        try {
          const response = await fetch(`https://map.ir/reverse?lat=${lat}&lon=${lng}`, {
            headers: {
              'x-api-key': apiKey!
            }
          });
          const data = await response.json();
          
          const address = data.address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          
          setSelectedLocation({
            lat,
            lng,
            address,
            fullAddress: data.full_address || address,
            province: data.province,
            city: data.city,
            district: data.district,
            street: data.street,
            neighbourhood: data.neighbourhood
          });

          setStep(2);
        } catch (error) {
          console.error('Error getting address:', error);
          setSelectedLocation({
            lat,
            lng,
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          });
          setStep(2);
        }
      });

      // ذخیره در window برای دسترسی بعدی
      window.map = map;
      setMapLoaded(true);
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('خطا در بارگذاری نقشه');
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      showToast.warning('لطفاً عبارت جستجو را وارد کنید');
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(`https://map.ir/search/v2?text=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'x-api-key': apiKey!
        }
      });
      const data = await response.json();
      
      if (data.count > 0) {
        setSearchResults(data.items || []);
      } else {
        showToast.info('نتیجه‌ای یافت نشد');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      showToast.error('خطا در جستجو');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectSearchResult = (item: any) => {
    const { geometry, title, address } = item;
    const lat = geometry.coordinates[1];
    const lng = geometry.coordinates[0];

    // حرکت نقشه به موقعیت
    if (window.map) {
      window.map.setView([lat, lng], 16);
      
      // اضافه کردن نشانگر
      window.L.marker([lat, lng], {
        icon: window.L.icon({
          iconUrl: 'https://static.map.ir/marker/blue.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        })
      }).addTo(window.map);
    }

    setSelectedLocation({
      lat,
      lng,
      address: title,
      fullAddress: address,
      ...item
    });
    setStep(2);
    setSearchResults([]);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast.error('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        if (window.map) {
          window.map.setView([latitude, longitude], 16);
          
          window.L.marker([latitude, longitude], {
            icon: window.L.icon({
              iconUrl: 'https://static.map.ir/marker/red.png',
              iconSize: [32, 32],
              iconAnchor: [16, 32]
            })
          }).addTo(window.map);
        }

        try {
          const response = await fetch(`https://map.ir/reverse?lat=${latitude}&lon=${longitude}`, {
            headers: { 'x-api-key': apiKey! }
          });
          const data = await response.json();
          
          setSelectedLocation({
            lat: latitude,
            lng: longitude,
            address: data.address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            fullAddress: data.full_address
          });
          setStep(2);
        } catch (error) {
          setSelectedLocation({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          });
          setStep(2);
        }
      },
      (error) => {
        showToast.error('خطا در دریافت موقعیت فعلی');
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressDetails({
      ...addressDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirmAddress = () => {
    if (!addressDetails.recipientName) {
      showToast.error('لطفاً نام گیرنده را وارد کنید');
      return;
    }
    if (!addressDetails.recipientPhone) {
      showToast.error('لطفاً شماره تماس گیرنده را وارد کنید');
      return;
    }
    if (!addressDetails.postalCode) {
      showToast.error('لطفاً کد پستی را وارد کنید');
      return;
    }

    const fullAddress = selectedLocation.fullAddress || selectedLocation.address;
    const addressWithDetails = `${fullAddress} - پلاک ${addressDetails.plaque} - واحد ${addressDetails.unit} - طبقه ${addressDetails.floor}`;
    
    onAddressSelect(addressWithDetails, {
      ...selectedLocation,
      ...addressDetails
    });
    onClose();
  };

  if (mapError) {
    return (
      <div className="fullscreen-map">
        <div className="map-header">
          <button onClick={onClose} className="back-button">
            <Crosshair size={24} />
          </button>
          <h3 className="map-title">خطا در بارگذاری نقشه</h3>
          <div style={{ width: '40px' }}></div>
        </div>
        <div className="map-content d-flex align-items-center justify-content-center">
          <Alert variant="danger" className="text-center">
            <Alert.Heading>{mapError}</Alert.Heading>
            <p>لطفاً از تنظیم بودن کلید API در فایل .env.local اطمینان حاصل کنید.</p>
          </Alert>
        </div>
        <div className="map-footer">
          <button onClick={onClose} className="footer-button primary">بستن</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fullscreen-map">
      {/* هدر نقشه */}
      <div className="map-header">
        <button onClick={step === 2 ? () => setStep(1) : onClose} className="back-button">
          <Crosshair size={24} />
        </button>
        <h3 className="map-title">
          {step === 1 ? 'انتخاب آدرس روی نقشه' : 'تکمیل اطلاعات آدرس'}
        </h3>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* محتوای نقشه */}
      <div className="map-content">
        {step === 1 ? (
          <>
            {/* نوار جستجو */}
            <div className="search-container">
              <div className="search-box">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="جستجوی آدرس، محله، شهر..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="search-input"
                />
                <button 
                  onClick={handleSearch} 
                  className="search-button"
                  disabled={searching}
                >
                  {searching ? <Spinner size="sm" /> : 'جستجو'}
                </button>
              </div>
              
              <button onClick={handleUseCurrentLocation} className="location-button">
                <GeoAlt size={18} />
                موقعیت فعلی من
              </button>
            </div>

            {/* نتایج جستجو */}
            {searchResults.length > 0 && (
              <div className="suggestions-container">
                {searchResults.map((item, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSelectSearchResult(item)}
                  >
                    <GeoAlt className="suggestion-icon" size={18} />
                    <div>
                      <div className="suggestion-title">{item.title}</div>
                      <div className="suggestion-address">{item.address}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* کانتینر نقشه */}
            <div ref={mapContainer} className="map-area" />
            
            {!mapLoaded && (
              <div className="map-loading">
                <Spinner animation="border" variant="primary" />
                <p>در حال بارگذاری نقشه...</p>
              </div>
            )}
          </>
        ) : (
          /* مرحله ۲: تکمیل اطلاعات آدرس */
          <div className="address-form-container">
            <div className="selected-location">
              <GeoAlt size={20} className="location-icon" />
              <div>
                <div className="location-label">آدرس انتخاب شده:</div>
                <div className="location-text">{selectedLocation?.fullAddress || selectedLocation?.address}</div>
                {selectedLocation?.province && (
                  <div className="location-meta">
                    {selectedLocation.province} - {selectedLocation.city} - {selectedLocation.district}
                  </div>
                )}
              </div>
            </div>

            <div className="address-form">
              <div className="form-row">
                <div className="form-group">
                  <label>پلاک</label>
                  <input
                    type="text"
                    name="plaque"
                    value={addressDetails.plaque}
                    onChange={handleInputChange}
                    placeholder="مثال: ۱۲۳"
                  />
                </div>
                <div className="form-group">
                  <label>واحد</label>
                  <input
                    type="text"
                    name="unit"
                    value={addressDetails.unit}
                    onChange={handleInputChange}
                    placeholder="مثال: ۵"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>طبقه</label>
                  <input
                    type="text"
                    name="floor"
                    value={addressDetails.floor}
                    onChange={handleInputChange}
                    placeholder="مثال: ۳"
                  />
                </div>
                <div className="form-group">
                  <label>کد پستی</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={addressDetails.postalCode}
                    onChange={handleInputChange}
                    placeholder="۱۲۳۴۵۶۷۸۹۰"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>نام گیرنده</label>
                <input
                  type="text"
                  name="recipientName"
                  value={addressDetails.recipientName}
                  onChange={handleInputChange}
                  placeholder="علی محمدی"
                />
              </div>

              <div className="form-group full-width">
                <label>شماره تماس گیرنده</label>
                <input
                  type="tel"
                  name="recipientPhone"
                  value={addressDetails.recipientPhone}
                  onChange={handleInputChange}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* فوتر نقشه */}
      <div className="map-footer">
        {step === 1 ? (
          <button onClick={onClose} className="footer-button secondary">
            بستن
          </button>
        ) : (
          <div className="d-flex gap-2 w-100">
            <button onClick={() => setStep(1)} className="footer-button secondary">
              بازگشت
            </button>
            <button onClick={handleConfirmAddress} className="footer-button primary flex-grow-1">
              تأیید و انتخاب آدرس
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .fullscreen-map {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 99999;
          display: flex;
          flex-direction: column;
        }

        .map-header {
          height: 60px;
          background: white;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          flex-shrink: 0;
        }

        .back-button {
          width: 40px;
          height: 40px;
          border: none;
          background: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #333;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background-color: #f0f0f0;
        }

        .map-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .map-content {
          flex: 1;
          overflow-y: auto;
          position: relative;
        }

        .search-container {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: white;
          border-radius: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          padding: 4px 4px 4px 16px;
        }

        .search-icon {
          color: #6a1b9a;
          margin-right: 8px;
        }

        .search-input {
          flex: 1;
          height: 44px;
          border: none;
          font-size: 14px;
          padding: 0 8px;
          direction: rtl;
        }

        .search-input:focus {
          outline: none;
        }

        .search-button {
          height: 40px;
          padding: 0 20px;
          border: none;
          background: #6a1b9a;
          color: white;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .search-button:hover {
          background: #5a1482;
        }

        .search-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .location-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 44px;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 30px;
          padding: 0 20px;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .location-button:hover {
          background: #f8f9fa;
          border-color: #6a1b9a;
          color: #6a1b9a;
        }

        .map-area {
          height: 100%;
          width: 100%;
        }

        .map-loading {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255,255,255,0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 500;
        }

        .suggestions-container {
          position: absolute;
          top: 120px;
          left: 16px;
          right: 16px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000;
        }

        .suggestion-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .suggestion-item:hover {
          background: #f8f9fa;
        }

        .suggestion-icon {
          color: #6a1b9a;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .suggestion-title {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 2px;
        }

        .suggestion-address {
          font-size: 12px;
          color: #666;
        }

        .address-form-container {
          padding: 24px 16px;
        }

        .selected-location {
          background: #e8f5e9;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .location-icon {
          color: #2e7d32;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .location-label {
          font-size: 12px;
          color: #2e7d32;
          margin-bottom: 4px;
        }

        .location-text {
          font-size: 14px;
          font-weight: 600;
          color: #1b5e20;
          margin-bottom: 4px;
        }

        .location-meta {
          font-size: 12px;
          color: #388e3c;
        }

        .address-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row {
          display: flex;
          gap: 12px;
        }

        .form-group {
          flex: 1;
        }

        .form-group.full-width {
          width: 100%;
        }

        .form-group label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #666;
          margin-bottom: 4px;
        }

        .form-group input {
          width: 100%;
          height: 44px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          padding: 0 12px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #6a1b9a;
          box-shadow: 0 0 0 2px rgba(106, 27, 154, 0.1);
        }

        .map-footer {
          height: 80px;
          background: white;
          border-top: 1px solid #e0e0e0;
          padding: 16px;
          flex-shrink: 0;
        }

        .footer-button {
          height: 48px;
          border-radius: 24px;
          border: none;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0 24px;
        }

        .footer-button.primary {
          background: #6a1b9a;
          color: white;
        }

        .footer-button.primary:hover {
          background: #5a1482;
        }

        .footer-button.secondary {
          background: white;
          color: #666;
          border: 1px solid #e0e0e0;
        }

        .footer-button.secondary:hover {
          background: #f5f5f5;
        }

        @media (max-width: 768px) {
          .search-box {
            flex-wrap: wrap;
            padding: 8px;
          }
          
          .search-input {
            width: 100%;
            margin-bottom: 8px;
          }
          
          .search-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}