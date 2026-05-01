'use client';

import { useState, useRef, useEffect } from 'react';
import { Container, Card, Form, Button, InputGroup, Badge, Spinner } from 'react-bootstrap';
import { Send, Robot, Person, ChatDots, ArrowRight } from 'react-bootstrap-icons';

// نوع پیام‌ها
type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'سلام! من دستیار هوشمند فروشگاه هستم. چطور می‌توانم به شما کمک کنم؟',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // اسکرول خودکار به پایین وقتی پیام جدیدی می‌آید
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // تابع شبیه‌سازی پاسخ هوش مصنوعی
  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // منطق ساده برای پاسخگویی (می‌توانید اینجا به API واقعی وصل شوید)
    if (lowerMessage.includes('سلام') || lowerMessage.includes('درود')) {
      return 'سلام دوست عزیز! خوشحالم که اینجا هستید. 😊';
    }
    if (lowerMessage.includes('سفارش') || lowerMessage.includes('پیگیری')) {
      return 'برای پیگیری سفارش خود، لطفاً وارد بخش "سفارش‌های من" در پروفایل کاربری شوید. کد پیگیری شما آنجا موجود است.';
    }
    if (lowerMessage.includes('مرجوعی') || lowerMessage.includes('برگشت')) {
      return 'سیستم مرجوعی کالا تا ۷ روز پس از دریافت امکان‌پذیر است. می‌توانید از طریق پنل کاربری درخواست خود را ثبت کنید.';
    }
    if (lowerMessage.includes('ارسال') || lowerMessage.includes('پست')) {
      return 'ارسال سفارشات برای تهران معمولاً ۱ تا ۲ روز و برای شهرستان‌ها ۲ تا ۴ روز کاری زمان می‌برد.';
    }
    if (lowerMessage.includes('قیمت') || lowerMessage.includes('تخفیف')) {
      return 'قیمت‌ها به‌روز هستند. برای مشاهده تخفیف‌های ویژه می‌توانید به صفحه "برترین تخفیف‌ها" در منوی اصلی سر بزنید.';
    }
    if (lowerMessage.includes('تماس') || lowerMessage.includes('شماره')) {
      return 'شماره تماس پشتیبانی: ۰۲۱-۱۲۳۴۵۶۷۸ (ساعات کاری ۹ صبح تا ۶ عصر)';
    }

    // پاسخ پیش‌فرض
    return 'متوجه شدم. برای بررسی دقیق‌تر، لطفاً جزئیات بیشتری بفرمایید یا با پشتیبانی تلفنی تماس بگیرید.';
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputText('');
    setIsTyping(true);

    // شبیه‌سازی تاخیر شبکه برای پاسخ ربات
    setTimeout(() => {
      const botResponseText = generateBotResponse(newUserMessage.text);
      const newBotMessage: Message = {
        id: messages.length + 2,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <Container className="py-5" style={{ maxWidth: '900px' }}>
      <div className="text-center mb-4">
        <Badge bg="primary" className="mb-2 p-2">پشتیبانی آنلاین</Badge>
        <h2 className="fw-bold">گفتگو با دستیار هوشمند</h2>
        <p className="text-muted">سوالات خود را بپرسید، ما در اسرع وقت پاسخ می‌دهیم.</p>
      </div>


      <Card className="shadow-sm border-0 overflow-hidden">
        {/* هدر چت */}
        <Card.Header className="bg-white border-bottom py-3 d-flex align-items-center gap-3">
          <div className="position-relative">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center text-white"
              style={{ width: '45px', height: '45px', backgroundColor: '#6a1b9a' }}
            >
              <Robot size={24} />
            </div>
            <span className="position-absolute bottom-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle">
              <span className="visually-hidden">آنلاین</span>
            </span>
          </div>
          <div>
            <h6 className="mb-0 fw-bold">دستیار کوانتوم</h6>
            <small className="text-success" style={{ fontSize: '12px' }}>آنلاین و آماده پاسخگویی</small>
          </div>
        </Card.Header>

        {/* بدنه چت */}
        <Card.Body 
          className="bg-light" 
          style={{ height: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px' }}
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`d-flex align-items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* آواتار */}
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                style={{ 
                  width: '35px', 
                  height: '35px', 
                  backgroundColor: msg.sender === 'user' ? '#6a1b9a' : '#9e9e9e' 
                }}
              >
                {msg.sender === 'user' ? <Person size={18} /> : <Robot size={18} />}
              </div>

              {/* حباب پیام */}
              <div 
                className="p-3 rounded-3 position-relative"
                style={{
                  maxWidth: '70%',
                  backgroundColor: msg.sender === 'user' ? '#6a1b9a' : 'white',
                  color: msg.sender === 'user' ? 'white' : '#333',
                  borderBottomRightRadius: msg.sender === 'bot' ? '0' : '12px',
                  borderBottomLeftRadius: msg.sender === 'user' ? '0' : '12px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                }}
              >
                <p className="mb-0" style={{ lineHeight: '1.6', fontSize: '14px' }}>
                  {msg.text}
                </p>
                <span 
                  className="d-block text-end mt-1" 
                  style={{ fontSize: '10px', opacity: 0.7 }}
                >
                  {msg.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {/* وضعیت در حال تایپ */}
          {isTyping && (
            <div className="d-flex align-items-end gap-2">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{ width: '35px', height: '35px', backgroundColor: '#9e9e9e' }}
              >
                <Robot size={18} />
              </div>
              <div className="bg-white p-3 rounded-3 border d-flex gap-1 align-items-center" style={{ width: '60px' }}>
                <span className="spinner-grow spinner-grow-sm text-secondary" role="status"></span>
                <span className="spinner-grow spinner-grow-sm text-secondary" role="status"></span>
                <span className="spinner-grow spinner-grow-sm text-secondary" role="status"></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </Card.Body>

        {/* فوتر چت - ورودی */}
        <Card.Footer className="bg-white border-top p-3">
          <Form onSubmit={handleSendMessage}>
            <InputGroup>
              <Form.Control
                placeholder="پیام خود را بنویسید..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="border-end-0"
                style={{ borderRadius: '25px 0 0 25px', paddingLeft: '20px' }}
              />
              <Button 
                type="submit" 
                variant="primary"
                disabled={!inputText.trim() || isTyping}
                style={{ 
                  borderRadius: '0 25px 25px 0', 
                  backgroundColor: '#6a1b9a', 
                  borderColor: '#6a1b9a',
                  paddingLeft: '25px',
                  paddingRight: '25px'
                }}
              >
                <Send size={18} />
              </Button>
            </InputGroup>
          </Form>
        </Card.Footer>
      </Card>
      
      <div className="text-center mt-4">
        <p className="text-muted small">
          برای دسترسی سریع‌تر به بخش‌های مختلف فروشگاه، از منوی بالای صفحه استفاده کنید.
        </p>
      </div>
    </Container>
  );
}