'use client';

import { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Tab, Nav, InputGroup, Spinner, Badge } from 'react-bootstrap';
import { Eye, EyeSlash, PersonCircle, CloudUpload } from 'react-bootstrap-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { uploadAvatar } from '@/lib/uploadAvatar';
import Header from '@/components/Header';
import Image from 'next/image';
import { showToast } from '@/components/ToastProvider';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login');
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  
  // بررسی وجود آدرس بازگشت در localStorage
  useEffect(() => {
    const savedRedirect = localStorage.getItem('redirectAfterLogin');
    if (savedRedirect) {
      setRedirectUrl(savedRedirect);
    }
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    avatar: null as File | null
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast.error('حجم عکس باید کمتر از ۵ مگابایت باشد');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        showToast.error('فرمت عکس باید jpeg، jpg، png یا webp باشد');
        return;
      }
      
      setRegisterData({
        ...registerData,
        avatar: file
      });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^09[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      showToast.error('لطفاً ایمیل و رمز عبور را وارد کنید');
      return;
    }

    const loadingToast = showToast.loading('در حال ورود به حساب کاربری...');
    setLoginLoading(true);

    setTimeout(() => {
      setLoginLoading(false);
      localStorage.setItem('token', `local-${Date.now()}`);
      localStorage.setItem('user', JSON.stringify({
        name: loginData.email.split('@')[0],
        email: loginData.email
      }));

      toast.dismiss(loadingToast);
      showToast.success('با موفقیت وارد شدید');

      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        setTimeout(() => {
          router.push(redirectUrl);
        }, 1500);
      } else {
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    }, 800);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.name.trim()) {
      showToast.error('لطفاً نام و نام خانوادگی را وارد کنید');
      return;
    }
    
    if (!registerData.email) {
      showToast.error('لطفاً ایمیل را وارد کنید');
      return;
    }
    
    if (!validateEmail(registerData.email)) {
      showToast.error('ایمیل معتبر نیست');
      return;
    }
    
    if (!registerData.phone) {
      showToast.error('لطفاً شماره موبایل را وارد کنید');
      return;
    }
    
    if (!validatePhone(registerData.phone)) {
      showToast.error('شماره موبایل معتبر نیست (مثال: 09123456789)');
      return;
    }
    
    if (!registerData.password) {
      showToast.error('لطفاً رمز عبور را وارد کنید');
      return;
    }

    if (registerData.password.length < 6) {
      showToast.error('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      showToast.error('رمز عبور و تکرار آن مطابقت ندارند');
      return;
    }

    const loadingToast = showToast.loading('در حال ثبت‌نام...');
    setRegisterLoading(true);

    let avatarUrl = '';
    if (registerData.avatar) {
      try {
        avatarUrl = await uploadAvatar(registerData.avatar);
      } catch (uploadError) {
        setRegisterLoading(false);
        toast.dismiss(loadingToast);
        showToast.error('خطا در آپلود عکس');
        return;
      }
    }

    setTimeout(() => {
      setRegisterLoading(false);
      toast.dismiss(loadingToast);
      showToast.success('ثبت‌نام با موفقیت انجام شد');

      setTimeout(() => {
        setActiveTab('login');
        setRegisterData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          avatar: null
        });
        setAvatarPreview(null);
        showToast.info('اکنون می‌توانید وارد شوید');
      }, 2000);
    }, 800);
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
                  background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <h2 className="fw-bold mb-1">به کوانتوم شاپ خوش آمدید</h2>
                <p className="mb-0 opacity-75">برای ادامه وارد شوید یا ثبت‌نام کنید</p>
                {redirectUrl && (
                  <Badge bg="light" text="dark" className="mt-2 px-3 py-2">
                    پس از ورود به صفحه قبلی باز می‌گردید
                  </Badge>
                )}
              </div>
              
              <Card.Body className="p-4">
                <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'login')}>
                  <Nav variant="pills" className="justify-content-center mb-4">
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="login" 
                        className="rounded-pill px-5 py-2 fw-bold"
                        style={{ 
                          backgroundColor: activeTab === 'login' ? '#6a1b9a' : 'transparent',
                          color: activeTab === 'login' ? 'white' : '#6a1b9a',
                          border: '2px solid #6a1b9a',
                          margin: '0 5px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        ورود
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="register" 
                        className="rounded-pill px-5 py-2 fw-bold"
                        style={{ 
                          backgroundColor: activeTab === 'register' ? '#6a1b9a' : 'transparent',
                          color: activeTab === 'register' ? 'white' : '#6a1b9a',
                          border: '2px solid #6a1b9a',
                          margin: '0 5px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        ثبت‌نام
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content>
                    {/* فرم ورود */}
                    <Tab.Pane eventKey="login">
                      <Form onSubmit={handleLoginSubmit}>
                        <Form.Group className="mb-3" controlId="loginEmail">
                          <Form.Label className="fw-bold text-secondary">ایمیل</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            placeholder="example@email.com"
                            required
                            className="py-2 border-2 rounded-3"
                            style={{ borderColor: '#e0e0e0' }}
                          />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="loginPassword">
                          <Form.Label className="fw-bold text-secondary">رمز عبور</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={loginData.password}
                              onChange={handleLoginChange}
                              placeholder="********"
                              required
                              className="py-2 border-2 rounded-start-3"
                              style={{ borderColor: '#e0e0e0' }}
                            />
                            <Button
                              variant="outline-secondary"
                              onClick={() => setShowPassword(!showPassword)}
                              className="border-2 rounded-end-3"
                              style={{ borderColor: '#e0e0e0' }}
                            >
                              {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                            </Button>
                          </InputGroup>
                        </Form.Group>

                        <Button 
                          type="submit" 
                          className="w-100 py-2 mb-3 fw-bold border-0 rounded-3"
                          style={{ 
                            background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)',
                            transition: 'all 0.3s ease'
                          }}
                          disabled={loginLoading}
                        >
                          {loginLoading ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              در حال ورود...
                            </>
                          ) : 'ورود به حساب کاربری'}
                        </Button>

                        <div className="text-center mt-3">
                          <Link href="/forgot-password" className="text-decoration-none" style={{ color: '#6a1b9a' }}>
                            رمز عبور را فراموش کرده‌اید؟
                          </Link>
                        </div>
                      </Form>
                    </Tab.Pane>

                    {/* فرم ثبت‌نام */}
                    <Tab.Pane eventKey="register">
                      <Form onSubmit={handleRegisterSubmit}>
                        {/* بخش آپلود عکس */}
                        <div className="text-center mb-4">
                          <div
                            className="position-relative d-inline-block"
                            style={{ cursor: 'pointer', width: '100px', height: '100px' }}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <div
                              className="rounded-circle overflow-hidden border border-3"
                              style={{
                                position: 'relative',
                                width: '100px',
                                height: '100px',
                                aspectRatio: '1 / 1',
                                flexShrink: 0,
                                borderColor: '#6a1b9a !important'
                              }}
                            >
                              {avatarPreview ? (
                                <Image
                                  src={avatarPreview}
                                  alt="آواتار"
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              ) : (
                                <div 
                                  className="d-flex align-items-center justify-content-center w-100 h-100"
                                  style={{ backgroundColor: '#f0f0f0' }}
                                >
                                  <PersonCircle size={60} color="#b0b0b0" />
                                </div>
                              )}
                            </div>
                            {/* <div 
                              className="position-absolute bottom-0 end-0 rounded-circle p-2"
                              style={{ 
                                backgroundColor: '#6a1b9a',
                                transform: 'translate(25%, 25%)'
                              }}
                            >
                              <CloudUpload size={16} color="white" />
                            </div> */}
                          </div>
                          <Form.Control
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            accept="image/*"
                            className="d-none"
                          />
                          <p className="text-muted small mt-2 mb-0">عکس پروفایل (اختیاری)</p>
                        </div>

                        <Form.Group className="mb-3" controlId="registerName">
                          <Form.Label className="fw-bold text-secondary">نام و نام خانوادگی</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={registerData.name}
                            onChange={handleRegisterChange}
                            placeholder="علی محمدی"
                            required
                            className="py-2 border-2 rounded-3"
                            style={{ borderColor: '#e0e0e0' }}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="registerEmail">
                          <Form.Label className="fw-bold text-secondary">ایمیل</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={registerData.email}
                            onChange={handleRegisterChange}
                            placeholder="example@email.com"
                            required
                            className="py-2 border-2 rounded-3"
                            style={{ borderColor: '#e0e0e0' }}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="registerPhone">
                          <Form.Label className="fw-bold text-secondary">شماره موبایل</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={registerData.phone}
                            onChange={handleRegisterChange}
                            placeholder="09123456789"
                            required
                            className="py-2 border-2 rounded-3"
                            style={{ borderColor: '#e0e0e0' }}
                          />
                          <Form.Text className="text-muted">
                            شماره موبایل باید با 09 شروع شود
                          </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="registerPassword">
                          <Form.Label className="fw-bold text-secondary">رمز عبور</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={registerData.password}
                              onChange={handleRegisterChange}
                              placeholder="حداقل ۶ کاراکتر"
                              required
                              minLength={6}
                              className="py-2 border-2 rounded-start-3"
                              style={{ borderColor: '#e0e0e0' }}
                            />
                            <Button
                              variant="outline-secondary"
                              onClick={() => setShowPassword(!showPassword)}
                              className="border-2 rounded-end-3"
                              style={{ borderColor: '#e0e0e0' }}
                            >
                              {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                            </Button>
                          </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="registerConfirmPassword">
                          <Form.Label className="fw-bold text-secondary">تکرار رمز عبور</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={registerData.confirmPassword}
                              onChange={handleRegisterChange}
                              placeholder="تکرار رمز عبور"
                              required
                              minLength={6}
                              className="py-2 border-2 rounded-start-3"
                              style={{ borderColor: '#e0e0e0' }}
                            />
                            <Button
                              variant="outline-secondary"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="border-2 rounded-end-3"
                              style={{ borderColor: '#e0e0e0' }}
                            >
                              {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                            </Button>
                          </InputGroup>
                        </Form.Group>

                        <Button 
                          type="submit" 
                          className="w-100 py-2 mb-3 fw-bold border-0 rounded-3"
                          style={{ 
                            background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)',
                            transition: 'all 0.3s ease'
                          }}
                          disabled={registerLoading}
                        >
                          {registerLoading ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              در حال ثبت‌نام...
                            </>
                          ) : 'ثبت‌نام در کوانتوم شاپ'}
                        </Button>
                      </Form>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </Card.Body>

              <Card.Footer className="bg-white border-0 pb-4 text-center text-muted">
                <small>
                  با ورود یا ثبت‌نام، <Link href="/terms" style={{ color: '#6a1b9a' }}>قوانین و مقررات</Link> را می‌پذیرید.
                </small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}