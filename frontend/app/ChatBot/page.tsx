'useclient'
import useState from 'react'

export default function main(){
    return (
     <div
      className="container py-5 text-center position-relative"
      style={{ minHeight: "100vh", color: "#2d004d" }}
    >
      
      <h1 className="mb-4 fw-bold" style={{ color: "#6e00b6", marginTop: "3rem" }}>
        ربات پشتیبانی
      </h1>

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
        <div
          className="mt-4 p-4 rounded fw-bold fs-5"
          style={{
            backgroundColor: "#f8e9ff",
            color: "#4a007d",
          }}
        >
        </div> 
        <input type='text' className='border-radious-15 fw-bold' placeholder='سوالی دارید؟'>
        </input>
        
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