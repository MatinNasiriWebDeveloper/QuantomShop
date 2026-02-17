'use client';

import { Toaster, toast } from 'react-hot-toast';
import { useEffect } from 'react';

// تابع‌های کمکی برای نمایش نوتیفیکیشن
export const showToast = {
  success: (message: string) => toast.success(message, {
    duration: 3000,
    position: 'top-center',
    style: {
      background: '#10b981',
      color: 'white',
      padding: '16px',
      borderRadius: '10px',
      fontSize: '14px',
      direction: 'rtl',
    },
    icon: '✅',
  }),
  
  error: (message: string) => toast.error(message, {
    duration: 4000,
    position: 'top-center',
    style: {
      background: '#ef4444',
      color: 'white',
      padding: '16px',
      borderRadius: '10px',
      fontSize: '14px',
      direction: 'rtl',
    },
    icon: '❌',
  }),
  
  info: (message: string) => toast(message, {
    duration: 3000,
    position: 'top-center',
    style: {
      background: '#3b82f6',
      color: 'white',
      padding: '16px',
      borderRadius: '10px',
      fontSize: '14px',
      direction: 'rtl',
    },
    icon: 'ℹ️',
  }),
  
  warning: (message: string) => toast(message, {
    duration: 3500,
    position: 'top-center',
    style: {
      background: '#f59e0b',
      color: 'white',
      padding: '16px',
      borderRadius: '10px',
      fontSize: '14px',
      direction: 'rtl',
    },
    icon: '⚠️',
  }),
  
  loading: (message: string) => toast.loading(message, {
    position: 'top-center',
    style: {
      background: '#6b7280',
      color: 'white',
      padding: '16px',
      borderRadius: '10px',
      fontSize: '14px',
      direction: 'rtl',
    },
  }),
  
  custom: (message: string, backgroundColor: string, icon: string) => toast(message, {
    duration: 3000,
    position: 'top-center',
    style: {
      background: backgroundColor,
      color: 'white',
      padding: '16px',
      borderRadius: '10px',
      fontSize: '14px',
      direction: 'rtl',
    },
    icon: icon,
  }),
};

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{
        top: 80,
        zIndex: 99999,
      }}
      toastOptions={{
        className: '',
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
          direction: 'rtl',
        },
        success: {
          duration: 3000,
          icon: '✅',
          style: {
            background: '#10b981',
          },
        },
        error: {
          duration: 4000,
          icon: '❌',
          style: {
            background: '#ef4444',
          },
        },
      }}
    />
  );
}