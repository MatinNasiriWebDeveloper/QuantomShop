'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner } from 'react-bootstrap';
import Header from '@/components/Header';
import { showToast } from '@/components/ToastProvider';

interface Metrics {
  memory: any;
  cpu: any;
  system: any;
  recentRequests: any[];
}

export default function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 10000); // هر ۱۰ ثانیه
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchMetrics = async () => {
    try {
      const [metricsRes, dbRes] = await Promise.all([
        fetch('http://localhost:4000/api/monitor/metrics'),
        fetch('http://localhost:4000/api/monitor/database'),
      ]);
      
      const metricsData = await metricsRes.json();
      const dbData = await dbRes.json();
      
      setMetrics(metricsData);
      setDbStatus(dbData);
    } catch (error) {
      console.error('خطا در دریافت متریک‌ها:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value < thresholds.good) return 'success';
    if (value < thresholds.warning) return 'warning';
    return 'danger';
  };

  if (loading) {
    return (
      <div>
        <Header />
        <Container className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">در حال دریافت اطلاعات...</p>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      <Container className="py-4" dir="rtl">
        <h1 className="mb-4">📊 داشبورد مانیتورینگ</h1>
        
        {/* وضعیت کلی */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">وضعیت سرور</h6>
                <Badge bg="success" className="p-2 px-3">
                  ✅ فعال
                </Badge>
                <div className="mt-2 text-muted small">
                  آپتایم: {metrics?.system?.uptime || '۰'}
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">مصرف RAM</h6>
                <h3 className="text-primary mb-0">
                  {metrics?.memory?.heapUsed || '۰'}
                </h3>
                <small className="text-muted">
                  از {metrics?.memory?.heapTotal}
                </small>
                <div className="mt-2">
                  <Badge bg={getHealthColor(
                    parseFloat(metrics?.memory?.heapUsedPercent || '۰'),
                    { good: 50, warning: 80 }
                  )}>
                    {metrics?.memory?.heapUsedPercent || '۰%'}
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">بار CPU</h6>
                <h3 className="text-warning mb-0">
                  {metrics?.cpu?.loadAverage?.['1m'] || '۰'}
                </h3>
                <small className="text-muted">۱ دقیقه اخیر</small>
                <div className="mt-2">
                  <Badge bg={getHealthColor(
                    parseFloat(metrics?.cpu?.loadAverage?.['1m'] || '۰'),
                    { good: 2, warning: 4 }
                  )}>
                    بار CPU
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">اتصالات دیتابیس</h6>
                <h3 className="text-info mb-0">
                  {dbStatus?.metrics?.Threads_connected || '۰'}
                </h3>
                <small className="text-muted">
                  از {dbStatus?.metrics?.max_connections}
                </small>
                <div className="mt-2">
                  <Badge bg={getHealthColor(
                    parseFloat(dbStatus?.metrics?.connection_usage_percent || '۰'),
                    { good: 30, warning: 60 }
                  )}>
                    {dbStatus?.metrics?.connection_usage_percent || '۰%'} استفاده
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* متریک‌های دقیق */}
        <Row>
          <Col md={6}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white border-0 pt-3">
                <h5 className="mb-0">💾 مصرف حافظه</h5>
              </Card.Header>
              <Card.Body>
                <Table bordered size="sm">
                  <tbody>
                    <tr>
                      <td>RSS</td>
                      <td className="text-start fw-bold">{metrics?.memory?.rss}</td>
                    </tr>
                    <tr>
                      <td>Heap Total</td>
                      <td className="text-start">{metrics?.memory?.heapTotal}</td>
                    </tr>
                    <tr>
                      <td>Heap Used</td>
                      <td className="text-start">{metrics?.memory?.heapUsed}</td>
                    </tr>
                    <tr>
                      <td>External</td>
                      <td className="text-start">{metrics?.memory?.external}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white border-0 pt-3">
                <h5 className="mb-0">⚙️ CPU</h5>
              </Card.Header>
              <Card.Body>
                <Table bordered size="sm">
                  <tbody>
                    <tr>
                      <td>User</td>
                      <td className="text-start">{metrics?.cpu?.user}</td>
                    </tr>
                    <tr>
                      <td>System</td>
                      <td className="text-start">{metrics?.cpu?.system}</td>
                    </tr>
                    <tr>
                      <td>Load Average (1m)</td>
                      <td className="text-start">{metrics?.cpu?.loadAverage?.['1m']}</td>
                    </tr>
                    <tr>
                      <td>Load Average (5m)</td>
                      <td className="text-start">{metrics?.cpu?.loadAverage?.['5m']}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* دیتابیس */}
        <Row>
          <Col md={12}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white border-0 pt-3 d-flex justify-content-between">
                <h5 className="mb-0">📁 دیتابیس {process.env.NEXT_PUBLIC_DB_NAME || 'quantom_shop'}</h5>
                <Badge bg="secondary">{dbStatus?.databases?.length || ۰} دیتابیس</Badge>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h6 className="mb-3">متریک‌های اصلی</h6>
                    <Table bordered size="sm">
                      <tbody>
                        <tr>
                          <td>اتصالات هم‌زمان</td>
                          <td className="text-start">
                            {dbStatus?.metrics?.Threads_connected || '۰'}
                          </td>
                        </tr>
                        <tr>
                          <td>اتصالات در حال اجرا</td>
                          <td className="text-start">
                            {dbStatus?.metrics?.Threads_running || '۰'}
                          </td>
                        </tr>
                        <tr>
                          <td>کوئری‌های کند</td>
                          <td className="text-start">
                            {dbStatus?.metrics?.Slow_queries || '۰'}
                          </td>
                        </tr>
                        <tr>
                          <td>آپتایم دیتابیس</td>
                          <td className="text-start">
                            {Math.floor(parseInt(dbStatus?.metrics?.Uptime || '۰') / 3600)} ساعت
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  
                  <Col md={6}>
                    <h6 className="mb-3">تنظیمات</h6>
                    <Table bordered size="sm">
                      <tbody>
                        <tr>
                          <td>max_connections</td>
                          <td className="text-start">{dbStatus?.metrics?.max_connections}</td>
                        </tr>
                        <tr>
                          <td>innodb_buffer_pool_size</td>
                          <td className="text-start">
                            {Math.round(parseInt(dbStatus?.metrics?.innodb_buffer_pool_size) / 1024 / 1024)} MB
                          </td>
                        </tr>
                        <tr>
                          <td>Cache Hit Ratio</td>
                          <td className="text-start">
                            {dbStatus?.metrics?.buffer_pool_hit_ratio || '۰'}%
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* درخواست‌های اخیر */}
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-white border-0 pt-3">
            <h5 className="mb-0">🔄 درخواست‌های اخیر</h5>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>زمان</th>
                  <th>متد</th>
                  <th>مسیر</th>
                  <th>وضعیت</th>
                  <th>مدت زمان</th>
                </tr>
              </thead>
              <tbody>
                {metrics?.recentRequests?.map((req, idx) => (
                  <tr key={idx}>
                    <td>{new Date(req.timestamp).toLocaleTimeString('fa-IR')}</td>
                    <td>
                      <Badge bg={req.method === 'GET' ? 'info' : 'warning'}>
                        {req.method}
                      </Badge>
                    </td>
                    <td>{req.path}</td>
                    <td>
                      <Badge bg={req.status < 400 ? 'success' : 'danger'}>
                        {req.status}
                      </Badge>
                    </td>
                    <td>{req.duration}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        
        <div className="text-center mt-4 text-muted small">
          آخرین به‌روزرسانی: {new Date().toLocaleString('fa-IR')}
        </div>
      </Container>
    </div>
  );
}