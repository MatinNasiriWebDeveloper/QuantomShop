'use client';

import { Toaster, toast } from 'react-hot-toast';

export const showToast = {
  success: (message: string) => toast.success(message, {
    duration: 3000,
    position: 'top-center',
    style: {
      background: '#10b981',
      color: 'white',
      padding: '16px 20px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      direction: 'rtl',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      border: '1px solid rgba(255,255,255,0.2)',
    },
    icon: '✅',
    iconTheme: {
      primary: 'white',
      secondary: '#10b981',
    },
  }),
  
  error: (message: string) => toast.error(message, {
    duration: 4000,
    position: 'top-center',
    style: {
      background: '#ef4444',
      color: 'white',
      padding: '16px 20px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      direction: 'rtl',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      border: '1px solid rgba(255,255,255,0.2)',
    },
    icon: '❌',
    iconTheme: {
      primary: 'white',
      secondary: '#ef4444',
    },
  }),
  
  info: (message: string) => toast(message, {
    duration: 3000,
    position: 'top-center',
    style: {
      background: '#3b82f6',
      color: 'white',
      padding: '16px 20px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      direction: 'rtl',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      border: '1px solid rgba(255,255,255,0.2)',
    },
    icon: 'ℹ️',
  }),
  
  warning: (message: string) => toast(message, {
    duration: 3500,
    position: 'top-center',
    style: {
      background: '#f59e0b',
      color: 'white',
      padding: '16px 20px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      direction: 'rtl',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      border: '1px solid rgba(255,255,255,0.2)',
    },
    icon: '⚠️',
  }),
  
  loading: (message: string) => toast.loading(message, {
    position: 'top-center',
    style: {
      background: '#6b7280',
      color: 'white',
      padding: '16px 20px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      direction: 'rtl',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      border: '1px solid rgba(255,255,255,0.2)',
    },
  }),
  
  custom: (message: string, backgroundColor: string, icon: string) => toast(message, {
    duration: 3000,
    position: 'top-center',
    style: {
      background: backgroundColor,
      color: 'white',
      padding: '16px 20px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      direction: 'rtl',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      border: '1px solid rgba(255,255,255,0.2)',
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
      containerStyle={{
        top: 80,
        zIndex: 99999,
      }}
      toastOptions={{
        duration: 3000,
        style: {
          direction: 'rtl',
          fontFamily: 'IRANSans, Vazir, sans-serif',
        },
        success: {
          duration: 3000,
          icon: '✅',
        },
        error: {
          duration: 4000,
          icon: '❌',
        },
      }}
    />
  );
}