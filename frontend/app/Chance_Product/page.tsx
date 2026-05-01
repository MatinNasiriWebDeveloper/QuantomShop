'use client';

import { useState, useRef, useEffect } from 'react';
import { Container, Button, Modal, Badge, Alert } from 'react-bootstrap';
import { Gift, Star, ArrowRepeat, Trophy, CheckCircle } from 'react-bootstrap-icons';
import Image from 'next/image';
import confetti from 'canvas-confetti'; // نیاز به نصب پکیج: npm install canvas-confetti

// تعریف جوایز
const prizes = [
  { id: 1, text: 'آیفون ۱۷ پرومکس', color: '#ff5252', icon: '📱', type: 'jackpot' },
  { id: 2, text: '۱۰۰ میلیون تومان اعتبار', color: '#448aff', icon: '💰', type: 'jackpot' },
  { id: 3, text: 'پوچ', color: '#e0e0e0', icon: '😔', type: 'lose' },
  { id: 4, text: 'دسته PS4', color: '#ffab40', icon: '🎮', type: 'win' },
  { id: 5, text: 'دسته PS5', color: '#69f0ae', icon: '🎮', type: 'win' },
  { id: 6, text: 'تخفیف ۹۰٪', color: '#e040fb', icon: '🎟️', type: 'win' },
  { id: 7, text: 'پوچ', color: '#e0e0e0', icon: '😔', type: 'lose' },
  { id: 8, text: 'کد تخفیف ۵۰ هزارتومانی', color: '#536dfe', icon: '🎫', type: 'win' },
];

export default function LotteryPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  // محاسبه زاویه هر بخش
  const segmentAngle = 360 / prizes.length;

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowModal(false);

    // انتخاب برنده به صورت تصادفی (اینجا برای تست همیشه برنده است، می‌توانید تغییر دهید)
    // برای واقعی‌تر شدن، می‌توانید احتمال پوچ را بیشتر کنید
    const winningIndex = Math.floor(Math.random() * prizes.length);
    const selectedPrize = prizes[winningIndex];

    // محاسبه زاویه چرخش
    // ما می‌خواهیم فلش روی جایزه بنشیند. فلش معمولا در بالا (۰ درجه یا ۲۷۰ درجه) است.
    // فرض می‌کنیم فلش در بالای گردونه (۲۷۰ درجه در سیستم مختصات دایره‌ای استاندارد، اما اینجا ۰ درجه بالا است)
    // برای اینکه جایزه انتخاب شده در بالا بیفتد، باید به اندازه (۳۶۰ - ایندکس * زاویه بخش) بچرخیم.
    
    const extraSpins = 5; // تعداد دورهای کامل
    const targetAngle = 360 - (winningIndex * segmentAngle); 
    const totalRotation = rotation + (360 * extraSpins) + targetAngle - (rotation % 360);

    setRotation(totalRotation);

    // پایان چرخش
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(selectedPrize);
      setShowModal(true);

      // افکت کاغذ رنگی (Confetti) فقط برای برنده شدن
      if (selectedPrize.type !== 'lose') {
        fireConfetti();
      }
    }, 5000); // 5 ثانیه زمان چرخش
  };

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
    //   confetti({
    //     particleCount: 5,
    //     angle: 60,
    //     spread: 55,
    //     origin: { x: 0 },
    //     colors: ['#6a1b9a', '#ffeb3b', '#ff5722']
    //   });
    //   confetti({
    //     particleCount: 5,
    //     angle: 120,
    //     spread: 55,
    //     origin: { x: 1 },
    //     colors: ['#6a1b9a', '#ffeb3b', '#ff5722']
    //   });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  return (
    <Container className="py-5 d-flex flex-column align-items-center justify-content-center min-vh-100">
      <style>{`
        .wheel-container {
          position: relative;
          width: 350px;
          height: 350px;
          margin: 0 auto;
          border-radius: 50%;
          border: 10px solid #333;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          overflow: hidden;
          transition: transform 5s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .wheel-segment {
          position: absolute;
          width: 50%;
          height: 50%;
          transform-origin: 100% 100%;
          left: 0;
          top: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          clip-path: polygon(0 0, 100% 0, 100% 100%);
        }

        .wheel-content {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(45deg); /* چرخش متن برای خوانایی */
          text-align: center;
          width: 140px;
          font-size: 12px;
          font-weight: bold;
          color: white;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .wheel-arrow {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 50px;
          background-color: #ffeb3b;
          clip-path: polygon(100% 0, 0 0, 50% 100%);
          z-index: 10;
          filter: drop-shadow(0 4px 4px rgba(0,0,0,0.3));
        }

        .wheel-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 50%;
          border: 4px solid #333;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }

        @media (max-width: 500px) {
          .wheel-container {
            width: 300px;
            height: 300px;
          }
          .wheel-content {
            font-size: 10px;
            width: 110px;
          }
        }
      `}</style>
{/* 
      <div className='fw-bold'>
        اگر 5 بار محصولی به شما افتاد آن محصول برای خود شماست
      </div> */}

      <div className="text-center mb-5">
        <Badge bg="warning" text="dark" className="mb-2 px-3 py-2 fs-6">
          <Star className="ms-1" />
          گردونه شانس روزانه
        </Badge>
        <h1 className="fw-bold display-5 mb-2">شانس خود را امتحان کنید!</h1>
        <p className="text-muted lead">هر روز یک چرخش رایگان برای برنده شدن جوایز ویژه</p>
      </div>

      <div className="position-relative mb-5">
        {/* فلش نشانگر */}
        <div className="wheel-arrow"></div>

        {/* گردونه */}
        <div 
          ref={wheelRef}
          className="wheel-container"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {prizes.map((prize, index) => {
            const rotateAngle = index * segmentAngle;
            return (
              <div 
                key={prize.id} 
                className="wheel-segment"
                style={{ 
                  backgroundColor: prize.color,
                  transform: `rotate(${rotateAngle}deg) skewY(-90deg)` // تکنیک ساخت پیتزا
                }}
              >
                <div className="wheel-content">
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>{prize.icon}</div>
                  {prize.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* دکمه وسط */}
        <div className="wheel-center">
          <Gift size={30} color="#6a1b9a" />
        </div>
      </div>

      <Button 
        size="lg" 
        className="px-5 py-3 fw-bold rounded-pill shadow"
        style={{ backgroundColor: '#6a1b9a', border: 'none', fontSize: '1.2rem' }}
        onClick={spinWheel}
        disabled={isSpinning}
      >
        {isSpinning ? (
          <>
            <span className="spinner-border spinner-border-sm ms-2"></span>
            در حال چرخش...
          </>
        ) : (
          <>
            <ArrowRepeat className="ms-2" />
            شروع گردونه
          </>
        )}
      </Button>

      {/* مودال نتیجه */}
      <Modal 
        show={showModal} 
        centered 
        onHide={() => setShowModal(false)}
        backdrop="static"
        size="lg"
      >
        <Modal.Body className="text-center p-5">
          {winner?.type === 'lose' ? (
            <>
              <div className="mb-3 text-muted">
                <Trophy size={60} />
              </div>
              <h3 className="fw-bold mb-3">ای وای! پوچ بود</h3>
              <p className="text-muted">متاسفانه این بار شانس با شما یار نبود. نگران نباشید، فردا دوباره تلاش کنید!</p>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                بستن
              </Button>
            </>
          ) : (
            <>
              <div className="mb-3 text-warning">
                <CheckCircle size={60} />
              </div>
              <h3 className="fw-bold mb-3 text-success">تبریک! شما برنده شدید</h3>
              <div className="display-4 mb-3">{winner?.icon}</div>
              <h2 className="fw-bold mb-4" style={{ color: '#6a1b9a' }}>{winner?.text}</h2>
              <Alert variant="success" className="d-inline-block">
                کد جایزه شما به کیف پول اضافه شد.
              </Alert>
              <div className="mt-4">
                <Button variant="primary" className="px-4" onClick={() => setShowModal(false)} style={{ backgroundColor: '#6a1b9a' }}>
                  دریافت جایزه
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

    </Container>
  );
}