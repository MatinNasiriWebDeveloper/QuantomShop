'use client';

import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { showToast } from '@/components/ToastProvider';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone) {
      showToast.error('لطفاً شماره موبایل را وارد کنید');
      return;
    }

    const phoneRegex = /^09[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      showToast.error('شماره موبایل معتبر نیست (مثال: 09123456789)');
      return;
    }

    const loadingToast = showToast.loading('در حال ارسال کد تأیید...');
    setForgotLoading(true);

    setTimeout(() => {
      setForgotLoading(false);
      toast.dismiss(loadingToast);
      showToast.success('کد تأیید با موفقیت ارسال شد');
      setStep(2);
      startTimer(120);
    }, 800);
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      showToast.error('لطفاً کد ۶ رقمی را کامل وارد کنید');
      return;
    }

    const loadingToast = showToast.loading('در حال بررسی کد...');
    setVerifyLoading(true);

    setTimeout(() => {
      setVerifyLoading(false);
      toast.dismiss(loadingToast);
      setStep(3);
      showToast.success('کد با موفقیت تأیید شد');
    }, 800);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      showToast.error('لطفاً رمز عبور جدید را وارد کنید');
      return;
    }

    if (newPassword.length < 6) {
      showToast.error('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast.error('رمز عبور و تکرار آن مطابقت ندارند');
      return;
    }

    const loadingToast = showToast.loading('در حال تغییر رمز عبور...');
    setResetLoading(true);

    setTimeout(() => {
      setResetLoading(false);
      toast.dismiss(loadingToast);
      showToast.success('رمز عبور با موفقیت تغییر کرد');

      setTimeout(() => {
        router.push('/');
      }, 2000);
    }, 800);
  };

  const handleResendCode = async () => {
    if (!canResend) {
      showToast.warning('لطفاً صبر کنید');
      return;
    }

    const loadingToast = showToast.loading('در حال ارسال مجدد کد...');

    setTimeout(() => {
      toast.dismiss(loadingToast);
      showToast.success('کد جدید ارسال شد');
      setCode(['', '', '', '', '', '']);
      startTimer(120);
    }, 800);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const startTimer = (seconds: number) => {
    setTimer(seconds);
    setCanResend(false);
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div>
      <Header />
      
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
              <div 
                className="text-white text-center py-4"
                style={{ 
                  background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)'
                }}
              >
                <h2 className="fw-bold mb-1">بازیابی رمز عبور</h2>
                <p className="mb-0 opacity-75">
                  {step === 1 && 'شماره موبایل خود را وارد کنید'}
                  {step === 2 && 'کد تأیید را وارد کنید'}
                  {step === 3 && 'رمز عبور جدید انتخاب کنید'}
                </p>
              </div>
              
              <Card.Body className="p-4">
                {/* مرحله ۱: شماره موبایل */}
                {step === 1 && (
                  <Form onSubmit={handlePhoneSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold text-secondary">شماره موبایل</Form.Label>
                      <Form.Control
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="09123456789"
                        className="py-3 text-center"
                        dir="ltr"
                      />
                      <Form.Text className="text-muted">
                        کد تأیید به این شماره ارسال خواهد شد
                      </Form.Text>
                    </Form.Group>

                    <Button
                      type="submit"
                      className="w-100 py-3 fw-bold border-0 rounded-3"
                      style={{ background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)' }}
                      disabled={forgotLoading}
                    >
                      {forgotLoading ? 'در حال ارسال...' : 'ادامه'}
                    </Button>

                    <div className="text-center mt-3">
                      <Link href="/login" className="text-decoration-none" style={{ color: '#6a1b9a' }}>
                        بازگشت به صفحه ورود
                      </Link>
                    </div>
                  </Form>
                )}

                {/* مرحله ۲: کد تأیید */}
                {step === 2 && (
                  <Form onSubmit={handleCodeSubmit}>
                    <p className="text-center mb-4">
                      کد تأیید به شماره <strong className="text-primary">{phone}</strong> ارسال شد
                    </p>

                    <div className="d-flex justify-content-between mb-4" dir="ltr">
                      {code.map((digit, index) => (
                        <Form.Control
                          key={index}
                          id={`code-${index}`}
                          type="text"
                          value={digit}
                          onChange={(e) => handleCodeChange(index, e.target.value)}
                          onKeyDown={(e) => handleCodeKeyDown(index, e)}
                          className="text-center"
                          style={{ width: '50px', height: '60px', fontSize: '24px' }}
                          maxLength={1}
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>

                    <div className="text-center mb-4">
                      {timer > 0 ? (
                        <p className="text-muted">
                          زمان باقی‌مانده: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                        </p>
                      ) : (
                        <Button
                          variant="link"
                          onClick={handleResendCode}
                          disabled={!canResend}
                          style={{ color: '#6a1b9a' }}
                        >
                          ارسال مجدد کد
                        </Button>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-100 py-3 fw-bold border-0 rounded-3"
                      style={{ background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)' }}
                      disabled={verifyLoading}
                    >
                      {verifyLoading ? 'در حال بررسی...' : 'تأیید کد'}
                    </Button>
                  </Form>
                )}

                {/* مرحله ۳: رمز جدید */}
                {step === 3 && (
                  <Form onSubmit={handleResetSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold text-secondary">رمز عبور جدید</Form.Label>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="حداقل ۶ کاراکتر"
                        className="py-3"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold text-secondary">تکرار رمز عبور</Form.Label>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="تکرار رمز عبور"
                        className="py-3"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Check
                        type="checkbox"
                        label="نمایش رمز عبور"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      className="w-100 py-3 fw-bold border-0 rounded-3"
                      style={{ background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)' }}
                      disabled={resetLoading}
                    >
                      {resetLoading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
                    </Button>

                    <div className="text-center mt-3">
                      <Button
                        variant="link"
                        onClick={() => setStep(1)}
                        style={{ color: '#6a1b9a', textDecoration: 'none' }}
                      >
                        بازگشت به مرحله قبل
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}