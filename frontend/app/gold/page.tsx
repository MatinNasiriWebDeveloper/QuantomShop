"use client";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const [activeTab, setActiveTab] = useState("buy");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");

  const total = () => {
    const p = parseFloat(price) || 0;
    const a = parseFloat(amount) || 0;
    return (p * a).toLocaleString("fa-IR", { maximumFractionDigits: 0 });
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div
      className="container py-5 text-center position-relative"
      style={{ minHeight: "100vh", color: "#2d004d" }}
    >
      {/* دکمه بازگشت به صفحه اصلی */}
      <button
        onClick={handleGoHome}
        className="btn top-0 start-0 m-4"
        style={{
          color: "#6e00b6",
          backgroundColor: "transparent",
          border: "1px solid #6e00b6",
          borderRadius: "8px",
          padding: "0.5rem 1rem",
          fontSize: "0.9rem",
          transition: "all 0.3s",
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#6e00b6";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "#6e00b6";
        }}
      >
        بازگشت به صفحه اصلی
      </button>

      <h1 className="mb-4 fw-bold" style={{ color: "#6e00b6", marginTop: "3rem" }}>
        خرید و فروش طلا
      </h1>

      <div className="d-flex justify-content-center mb-4">
        <button
          className={`tab-btn ${activeTab === "buy" ? "active" : ""}`}
          onClick={() => setActiveTab("buy")}
        >
          خرید
        </button>
        <button
          className={`tab-btn ${activeTab === "sell" ? "active" : ""}`}
          onClick={() => setActiveTab("sell")}
        >
          فروش
        </button>
      </div>

      <div
        className="content mx-auto"
        style={{
          background: "#fff",
          borderRadius: "12px",
          // پدینگ ریسپانسیو: در موبایل کمتر، در دسکتاپ بیشتر
          padding: window.innerWidth < 576 ? "1.5rem" : "3rem",
          // عرض ریسپانسیو: در موبایل 95 درصد، در دسکتاپ 600 پیکسل
          maxWidth: window.innerWidth < 576 ? "95%" : "600px",
          boxShadow: "0 0 20px rgba(110,0,182,0.15)",
        }}
      >
        <div className="mb-3 text-end">
          <label className="form-label fw-bold">قیمت مورد نظر</label>
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
        <div
          className="mt-4 p-4 rounded fw-bold fs-5"
          style={{
            backgroundColor: "#f8e9ff",
            color: "#4a007d",
          }}
        >
          مبلغ کل: {total()} تومان
        </div>
        <button
          className="btn w-100 mt-4 fw-bold fs-5"
          style={{
            backgroundColor: "#6e00b6",
            color: "white",
            padding: "0.8rem",
          }}
        >
          {activeTab === "buy" ? "ثبت خرید" : "ثبت فروش"}
        </button>
      </div>

      <style jsx>{`
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
          content: "";
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
        
        /* تنظیمات ریسپانسیو برای موبایل */
        @media (max-width: 576px) {
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
  );
}