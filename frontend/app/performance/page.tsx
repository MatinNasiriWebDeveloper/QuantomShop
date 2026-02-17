'use client';

import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Table, Alert, Spinner, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { showToast } from '@/components/ToastProvider';

export default function PerformancePage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // بررسی احراز هویت
  useEffect(() => {
    const auth = localStorage.getItem('performance_auth');
    if (auth !== 'true') {
      showToast.warning('⛔ لطفاً ابتدا رمز عبور را وارد کنید');
      router.push('/performance/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthorized) {
      fetchMetrics();
      const interval = setInterval(fetchMetrics, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthorized]);

  const fetchMetrics = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:4000/api/performance');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 Metrics received:', data);
      setMetrics(data);
    } catch (error) {
      console.error('❌ Failed to fetch metrics:', error);
      setError('خطا در دریافت اطلاعات مانیتورینگ. مطمئن شوید بک‌اند روی پورت ۴۰۰۰ در حال اجراست.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('performance_auth');
    showToast.info('👋 از داشبورد خارج شدید');
    router.push('/performance/login');
  };

  if (!isAuthorized) {
    return (
      <div>
        <Header />
        <Container className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">در حال بررسی دسترسی...</p>
        </Container>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Header />
        <Container className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">در حال دریافت اطلاعات مانیتورینگ...</p>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <Container className="py-5">
          <Alert variant="danger">{error}</Alert>
          <Button 
            variant="primary" 
            onClick={fetchMetrics}
            style={{ backgroundColor: '#6a1b9a', borderColor: '#6a1b9a' }}
          >
            تلاش مجدد
          </Button>
        </Container>
      </div>
    );
  }

  if (!metrics || !metrics.currentCPU) {
    return (
      <div>
        <Header />
        <Container className="py-5">
          <Alert variant="warning">⚠️ داده‌ای برای نمایش وجود ندارد</Alert>
        </Container>
      </div>
    );
  }

  const cpuValue = parseFloat(metrics.currentCPU) || 0;
  const memoryValue = parseFloat(metrics.currentMemory) || 0;

  return (
    <div>
      <Header />
      
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>
            <span className="me-2">📊</span>
            Performance Dashboard
          </h1>
          <Button 
            variant="outline-danger" 
            onClick={handleLogout}
            size="sm"
          >
            خروج از داشبورد
          </Button>
        </div>

        <Row className="mb-4">
          <Col md={4}>
            <Card className="shadow-sm h-100">
              <Card.Header className="bg-primary text-white fw-bold">⚡ CPU Usage</Card.Header>
              <Card.Body className="text-center">
                <h2 className="display-4 fw-bold text-primary">{cpuValue.toFixed(1)}%</h2>
                <p className="text-muted mb-0">
                  Cores: {metrics.history?.[metrics.history.length - 1]?.cpu?.cores || 'N/A'}
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm h-100">
              <Card.Header className="bg-success text-white fw-bold">💾 Memory Usage</Card.Header>
              <Card.Body className="text-center">
                <h2 className="display-4 fw-bold text-success">{memoryValue.toFixed(1)}%</h2>
                <p className="text-muted mb-0">
                  Used: {metrics.processMemory?.heapUsed || 'N/A'}
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm h-100">
              <Card.Header className="bg-info text-white fw-bold">⏰ Uptime</Card.Header>
              <Card.Body className="text-center">
                <h2 className="display-6 fw-bold text-info">{metrics.uptime || '0 seconds'}</h2>
                <p className="text-muted mb-0">Process Uptime</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Header className="fw-bold">📊 Process Memory Details</Card.Header>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead className="table-light">
                    <tr>
                      <th>Metric</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>RSS</td>
                      <td className="fw-bold">{metrics.processMemory?.rss || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td>Heap Used</td>
                      <td className="fw-bold text-success">{metrics.processMemory?.heapUsed || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td>Heap Total</td>
                      <td className="fw-bold">{metrics.processMemory?.heapTotal || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td>External</td>
                      <td className="fw-bold">{metrics.processMemory?.external || 'N/A'}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Header className="fw-bold">🖥️ System Information</Card.Header>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead className="table-light">
                    <tr>
                      <th>Property</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Hostname</td>
                      <td>{metrics.system?.hostname || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td>Platform</td>
                      <td>{metrics.system?.platform || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td>Architecture</td>
                      <td>{metrics.system?.arch || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td>Load Average</td>
                      <td>{metrics.system?.loadAverage || 'N/A'}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="shadow-sm">
          <Card.Header className="fw-bold">📈 Performance History</Card.Header>
          <Card.Body>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <Table striped bordered hover responsive size="sm">
                <thead className="table-light sticky-top">
                  <tr>
                    <th>#</th>
                    <th>Time</th>
                    <th>CPU</th>
                    <th>Memory</th>
                    <th>Heap Used</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.history?.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>{metrics.history.length - index}</td>
                      <td>{new Date(item.timestamp).toLocaleTimeString('fa-IR')}</td>
                      <td>{item.cpu?.usage?.toFixed(1)}%</td>
                      <td>{item.systemMemory?.usagePercent}</td>
                      <td>{item.processMemory?.heapUsed}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}