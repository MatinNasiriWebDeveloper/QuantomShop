'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function GoldPage() {
  const [activeTab, setActiveTab] = useState('buy');
  const [price, setPrice] = useState('3500000');
  const [amount, setAmount] = useState('');

  const total = () => {
    const p = parseFloat(price) || 0;
    const a = parseFloat(amount) || 0;
    return (p * a).toLocaleString('fa-IR', { maximumFractionDigits: 0 });
  };

  return (
    <div>
      <Header />

      <div
        className="container py-5 text-center position-relative"
        style={{ minHeight: '70vh', color: '#2d004d' }}
      >
        <h1 className="mb-4 fw-bold" style={{ color: '#6e00b6', marginTop: '1rem' }}>
          خرید و فروش طلا
        </h1>
        <p className="text-muted mb-4">قیمت لحظه‌ای طلا را ببینید و خرید یا فروش خود را ثبت کنید</p>

        <div className="d-flex justify-content-center mb-4">
          <button
            className={`tab-btn ${activeTab === 'buy' ? 'active' : ''}`}
            onClick={() => setActiveTab('buy')}
          >
            خرید
          </button>
          <button
            className={`tab-btn ${activeTab === 'sell' ? 'active' : ''}`}
            onClick={() => setActiveTab('sell')}
          >
            فروش
          </button>
        </div>

        <div className="content mx-auto">
          <div className="mb-3 text-end">
            <label className="form-label fw-bold">قیمت هر گرم (تومان)</label>
            <input
              type="number"
              className="form-control text-center fs-5"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="مثلا: 3500000"
            />
          </div>
          <div className="mb-3 text-end">
            <label className="form-label fw-bold">مقدار (گرم)</label>
            <input
              type="number"
              className="form-control text-center fs-5"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="مثلا: 1.5"
            />
          </div>
          <div className="mt-4 p-4 rounded fw-bold fs-5 content-total">
            مبلغ کل: {total()} تومان
          </div>
          <button className="btn w-100 mt-4 fw-bold fs-5 content-submit">
            {activeTab === 'buy' ? 'ثبت خرید' : 'ثبت فروش'}
          </button>
        </div>

        <style jsx>{`
          .content {
            background: #fff;
            border-radius: 12px;
            padding: 3rem;
            max-width: 600px;
            box-shadow: 0 0 20px rgba(110, 0, 182, 0.15);
          }

          .content-total {
            background-color: #f8e9ff;
            color: #4a007d;
          }

          .content-submit {
            background-color: #6e00b6;
            color: white;
            padding: 0.8rem;
          }

          .tab-btn {
            background: none;
            border: none;
            font-size: 1.4rem;
            margin: 0 1.5rem;
            padding: 0.5rem 1rem;
            position: relative;
            color: #6e00b6;
            cursor: pointer;
            transition: all 0.3s;
          }
          .tab-btn::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background-color: #6e00b6;
            transition: width 0.3s;
          }
          .tab-btn.active::after {
            width: 100%;
          }
          .tab-btn:hover {
            color: #4a007d;
          }

          @media (max-width: 576px) {
            .content {
              padding: 1.5rem;
              max-width: 95%;
            }
            .tab-btn {
              font-size: 1.1rem;
              margin: 0 0.5rem;
            }
            h1 {
              font-size: 1.5rem;
            }
          }
        `}</style>
      </div>

      <Footer />
    </div>
  );
}
