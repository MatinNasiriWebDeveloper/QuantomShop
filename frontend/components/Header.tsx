'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Container, Navbar, Nav, Form, Button, Badge } from 'react-bootstrap';
import { 
  Search, 
  Person, 
  BoxArrowRight, 
  Bag, 
  Heart, 
  PersonCircle, 
  Cart,
  XLg, 
  Dash, 
  Plus 
} from 'react-bootstrap-icons';
import { useCart } from '../app/context/CartContext';
import { showToast } from './ToastProvider';
import toast from 'react-hot-toast';

export default function Header() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cartPopupRef = useRef<HTMLDivElement>(null);
  
  const { items, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setIsLoggedIn(true);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      
      if (
        cartPopupRef.current && 
        !cartPopupRef.current.contains(event.target as Node)
      ) {
        setShowCartPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      showToast.custom(`جستجو برای "${searchTerm}"`, '#6a1b9a', '🔍');
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      showToast.warning('لطفاً کلمه مورد نظر برای جستجو را وارد کنید');
    }
  };

  const handleLogout = () => {
    setShowDropdown(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    showToast.info('با موفقیت از حساب خود خارج شدید');
    router.push('/');
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleCheckout = () => {
    setShowCartPopup(false);
    if (!isLoggedIn) {
      localStorage.setItem('redirectAfterLogin', '/cart');
      showToast.warning('برای ثبت سفارش باید وارد حساب کاربری خود شوید');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    setShowCartPopup(false);
    router.push('/products');
  };

  const getInitials = () => {
    if (user?.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      }
      return nameParts[0][0].toUpperCase();
    }
    return '';
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  return (
    <>
      <style>{`
        .navbar-nav .nav-link {
          padding: 0.5rem 1rem !important;
          transition: all 0.3s ease;
        }
        .navbar-nav .nav-link:hover {
          background-color: rgba(255,255,255,0.1);
          border-radius: 20px;
        }
        
        .search-form {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          position: relative;
        }
        
        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: #dc3545;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }
        
        .search-input-container {
          position: relative;
          width: 100%;
        }
        
        .search-input {
          width: 100%;
          height: 45px;
          border-radius: 30px !important;
          border: none !important;
          padding-right: 45px !important;
          padding-left: 20px !important;
          font-size: 0.95rem;
          background-color: white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .search-input:focus {
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
          outline: none;
        }
        
        .search-icon {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #6a1b9a;
          font-size: 1.2rem;
          cursor: pointer;
          z-index: 10;
          background: none;
          border: none;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;
        }
        
        .search-icon:hover {
          color: #9c27b0;
        }
        
        .user-menu {
          position: relative;
        }
        
        .user-menu-button {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          transition: all 0.3s ease;
        }
        
        .user-menu-button:hover {
          opacity: 0.9;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .user-initials {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff9800, #f44336);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
        }
        
        .user-name {
          font-weight: 500;
          font-size: 14px;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .dropdown-menu-custom {
          position: absolute;
          top: 50px;
          left: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.15);
          min-width: 220px;
          z-index: 9999;
          padding: 8px 0;
          display: none;
        }
        
        .dropdown-menu-custom.show {
          display: block;
        }
        
        .dropdown-item-custom {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          color: #333;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: right;
          font-size: 14px;
        }
        
        .dropdown-item-custom:hover {
          background-color: #f5f5f5;
        }
        
        .dropdown-item-custom.logout {
          color: #dc3545;
        }
        
        .dropdown-item-custom.logout:hover {
          background-color: #ffebee;
        }
        
        .dropdown-divider {
          height: 1px;
          background-color: #e0e0e0;
          margin: 8px 0;
        }
        
        .cart-popup {
          position: absolute;
          top: 60px;
          left: 0;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          min-width: 380px;
          max-width: 400px;
          z-index: 10000;
          padding: 20px;
          border: 1px solid rgba(0,0,0,0.05);
        }
        
        .cart-popup.show {
          display: block;
        }
        
        .cart-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .cart-item-image {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }
        
        .cart-item-details {
          flex: 1;
        }
        
        .cart-item-name {
          font-weight: 600;
          margin-bottom: 4px;
          font-size: 14px;
          color: #333;
        }
        
        .cart-item-price {
          color: #6a1b9a;
          font-weight: 700;
          font-size: 14px;
        }
        
        .cart-item-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .quantity-btn {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #333;
        }
        
        .quantity-btn:hover {
          background-color: #f5f5f5;
          border-color: #6a1b9a;
          color: #6a1b9a;
        }
        
        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .remove-btn {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #dc3545;
        }
        
        .remove-btn:hover {
          background-color: #dc3545;
          border-color: #dc3545;
          color: white;
        }
        
        .cart-summary {
          padding-top: 16px;
          margin-top: 8px;
          border-top: 2px solid #f0f0f0;
        }
        
        @media (max-width: 992px) {
          .user-name {
            display: none;
          }
          .dropdown-menu-custom {
            left: auto;
            right: 0;
          }
          .cart-popup {
            position: fixed;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 350px;
          }
        }
      `}</style>

      <Navbar expand="lg" className="py-2" sticky="top" style={{ backgroundColor: '#6a1b9a', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <Container>
          <div className="d-flex align-items-center justify-content-between w-100 flex-wrap flex-lg-nowrap">
            
            <Link href="/" className="text-decoration-none">
              <div className="position-relative" style={{ width: '130px', height: '65px' }}>
                <Image
                  src="/images/logos/99.png"
                  alt="لوگو"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </Link>

            <Navbar.Toggle aria-controls="navbar-nav" className="border-0 text-white">
              <span className="navbar-toggler-icon"></span>
            </Navbar.Toggle>

            <Navbar.Collapse id="navbar-nav">
              <div className="d-flex flex-column flex-lg-row align-items-lg-center w-100 gap-3 gap-lg-4 mt-3 mt-lg-0">
                
                <div className="flex-grow-1" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <Form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-container">
                      <Form.Control
                        type="text"
                        placeholder="جستجو در محصولات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                      <button 
                        type="submit" 
                        className="search-icon"
                        aria-label="جستجو"
                      >
                        <Search size={20} />
                      </button>
                    </div>
                  </Form>
                </div>

                <div className="d-flex align-items-center gap-3 justify-content-center justify-content-lg-end">
                  
                  <Nav className="d-flex flex-row gap-2">
                    <Nav.Link href="/" className="text-white px-2">خانه</Nav.Link>
                    <Nav.Link href="/products" className="text-white px-2">محصولات</Nav.Link>
                    <Nav.Link href="/about" className="text-white px-2">درباره ما</Nav.Link>
                  </Nav>

                  <div className="vr text-white opacity-50 d-none d-lg-block" style={{ height: '30px', width: '1px' }}></div>

                  {/* سبد خرید با پاپ‌آپ */}
                  <div className="position-relative" ref={cartPopupRef}>
                    <div 
                      className="position-relative"
                      onMouseEnter={() => setShowCartPopup(true)}
                    >
                      <button
                        onClick={handleCartClick}
                        className="bg-transparent border-0 p-0"
                      >
                        <div className="d-flex align-items-center justify-content-center p-1 rounded-circle" style={{ backgroundColor: 'rgba(255,255,255,0.1)', width: '40px', height: '40px' }}>
                          <Cart size={20} color="white" />
                        </div>
                        {getTotalItems() > 0 && (
                          <span className="cart-badge">{getTotalItems()}</span>
                        )}
                      </button>
                    </div>

                    {/* پاپ‌آپ سبد خرید */}
                    {showCartPopup && (
                      <div className="cart-popup">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="fw-bold mb-0">سبد خرید شما</h6>
                          <Badge bg="primary" style={{ backgroundColor: '#6a1b9a' }}>
                            {getTotalItems()} کالا
                          </Badge>
                        </div>

                        {items.length === 0 ? (
                          <div className="text-center py-4">
                            <Cart size={48} className="text-muted mb-3" />
                            <p className="text-muted mb-2">
                              {isLoggedIn && user?.name 
                                ? `${user.name} عزیز، شما هیچ کالایی به سبد خرید اضافه نکرده‌اید`
                                : 'شما هیچ کالایی به سبد خرید اضافه نکرده‌اید'
                              }
                            </p>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={handleContinueShopping}
                              style={{ color: '#6a1b9a', borderColor: '#6a1b9a' }}
                            >
                              مشاهده محصولات
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                              {items.map((item) => (
                                <div key={item.id} className="cart-item">
                                  <div className="cart-item-image">
                                    <Image
                                      src={item.imageUrl}
                                      alt={item.name}
                                      width={60}
                                      height={60}
                                      style={{ objectFit: 'cover' }}
                                    />
                                  </div>
                                  <div className="cart-item-details">
                                    <div className="cart-item-name">{item.name}</div>
                                    <div className="cart-item-price">
                                      {formatPrice(item.finalPrice * item.quantity)}
                                    </div>
                                  </div>
                                  <div className="cart-item-actions">
                                    <button
                                      className="quantity-btn"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      disabled={item.quantity <= 1}
                                    >
                                      <Dash size={14} />
                                    </button>
                                    <span className="fw-bold">{item.quantity}</span>
                                    <button
                                      className="quantity-btn"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      disabled={item.quantity >= item.stock}
                                    >
                                      <Plus size={14} />
                                    </button>
                                    <button
                                      className="remove-btn"
                                      onClick={() => removeFromCart(item.id)}
                                    >
                                      <XLg size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="cart-summary">
                              <div className="d-flex justify-content-between mb-2">
                                <span>جمع کل:</span>
                                <span className="fw-bold text-primary">
                                  {formatPrice(getTotalPrice())}
                                </span>
                              </div>
                              <div className="d-flex gap-2">
                                <Button 
                                  variant="primary" 
                                  className="flex-grow-1"
                                  style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}
                                  onClick={handleCheckout}
                                >
                                  ثبت سفارش
                                </Button>
                                <Button 
                                  variant="outline-primary" 
                                  onClick={handleContinueShopping}
                                  style={{ color: '#6a1b9a', borderColor: '#6a1b9a' }}
                                >
                                  ادامه خرید
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* منوی کاربر */}
                  <div className="user-menu" ref={dropdownRef}>
                    {isLoggedIn && user ? (
                      <>
                        <button 
                          ref={buttonRef}
                          className="user-menu-button"
                          onClick={() => setShowDropdown(!showDropdown)}
                        >
                          <div className="user-avatar">
                            {user.avatar ? (
                              <Image
                                src={user.avatar}
                                alt={user.name}
                                width={40}
                                height={40}
                                className="rounded-circle"
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <div className="user-initials">
                                {getInitials()}
                              </div>
                            )}
                          </div>
                          <span className="user-name text-white">
                            {user.name || 'کاربر'}
                          </span>
                        </button>

                        <div className={`dropdown-menu-custom ${showDropdown ? 'show' : ''}`}>
                          <div className="px-3 py-2 border-bottom">
                            <div className="fw-bold" style={{ color: '#6a1b9a' }}>
                              {user.name || 'کاربر'}
                            </div>
                            <small className="text-muted d-block text-truncate">
                              {user.email || ''}
                            </small>
                          </div>

                          <Link href="/profile" className="dropdown-item-custom" onClick={() => setShowDropdown(false)}>
                            <PersonCircle size={18} color="#6a1b9a" />
                            <span>پروفایل من</span>
                          </Link>

                          <Link href="/orders" className="dropdown-item-custom" onClick={() => setShowDropdown(false)}>
                            <Bag size={18} color="#6a1b9a" />
                            <span>سفارش‌های من</span>
                          </Link>

                          <Link href="/wishlist" className="dropdown-item-custom" onClick={() => setShowDropdown(false)}>
                            <Heart size={18} color="#6a1b9a" />
                            <span>علاقه‌مندی‌ها</span>
                          </Link>

                          <div className="dropdown-divider"></div>

                          <button onClick={handleLogout} className="dropdown-item-custom logout">
                            <BoxArrowRight size={18} />
                            <span>خروج از حساب</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <Link href="/login">
                        <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ backgroundColor: 'rgba(255,255,255,0.1)', width: '40px', height: '40px' }}>
                          <Person size={20} color="white" />
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    </>
  );
}