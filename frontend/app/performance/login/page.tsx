'use client';

import { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { showToast } from '@/components/ToastProvider';
import toast from 'react-hot-toast';
import Header from '@/components/Header';

export default function PerformanceLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // رمز عبور ساده (میتونی بعداً تغییرش بدی)
  const PERFORMANCE_PASSWORD = 'admin123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // شبیه‌سازی درخواست به سرور
    setTimeout(() => {
      if (password === PERFORMANCE_PASSWORD) {
        // ذخیره توکن در localStorage
        localStorage.setItem('performance_auth', 'true');
        
        showToast.success('✅ رمز عبور صحیح است');
        
        setTimeout(() => {
          router.push('/performance');
        }, 1500);
      } else {
        showToast.error('❌ رمز عبور اشتباه است');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div>
      <Header />
      
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
        <Card style={{ width: '400px' }} className="shadow-lg border-0 rounded-4">
          <Card.Header className="bg-primary text-white text-center py-3 rounded-top-4">
            <h4 className="mb-0">🔒 دسترسی محدود</h4>
          </Card.Header>
          
          <Card.Body className="p-4">
            <p className="text-muted text-center mb-4">
              برای مشاهده داشبورد عملکرد، رمز عبور را وارد کنید
            </p>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>رمز عبور</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="------------------"
                  className="py-2 text-center"
                  autoFocus
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100 py-2"
                disabled={loading}
                style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}
              >
                {loading ? 'در حال بررسی...' : 'ورود به داشبورد'}
              </Button>
            </Form>

         
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}