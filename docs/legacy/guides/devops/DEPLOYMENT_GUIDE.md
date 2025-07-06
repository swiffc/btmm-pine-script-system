# 🚀 BTMM Trading Platform - Comprehensive Deployment Guide

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Database Configuration](#database-configuration)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Observability](#monitoring--observability)
- [Security Configuration](#security-configuration)
- [Performance Optimization](#performance-optimization)
- [Scaling Strategies](#scaling-strategies)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Local Development
```bash
# 1. Clone repository
git clone <repository-url>
cd btmm-platform

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Set up database
npm run db:push
npm run db:seed

# 5. Start development server
npm run dev
```

### Production Quick Deploy
```bash
# Using Docker Compose (Recommended)
docker-compose -f devops/docker/docker-compose.yml up -d

# Using Kubernetes
kubectl apply -f devops/kubernetes/
```

## 🔧 Environment Setup

### Required Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/btmm_platform
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=password
PGDATABASE=btmm_platform

# Application
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-secure-session-secret

# Redis (Optional - for session storage)
REDIS_URL=redis://localhost:6379

# External APIs (Optional)
TRADINGVIEW_API_KEY=your-tradingview-api-key
NEWS_API_KEY=your-news-api-key
```

### Environment-Specific Configurations

#### Development
```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/btmm_dev
LOG_LEVEL=debug
ENABLE_DEBUG_MODE=true
```

#### Staging
```env
NODE_ENV=staging
DATABASE_URL=your-staging-database-url
LOG_LEVEL=info
ENABLE_PERFORMANCE_MONITORING=true
```

#### Production
```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
LOG_LEVEL=warn
ENABLE_PERFORMANCE_MONITORING=true
ENABLE_SECURITY_HEADERS=true
```

## 🗄️ Database Configuration

### PostgreSQL Setup
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE btmm_platform;
CREATE USER btmm_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE btmm_platform TO btmm_user;
\q

# Run migrations
npm run db:push
npm run db:seed
```

### Database Migrations
```bash
# Push schema changes
npm run db:push

# Generate migration
drizzle-kit generate:pg

# Apply migrations
npm run db:migrate

# Open database studio
npm run db:studio
```

### Backup & Restore
```bash
# Backup database
pg_dump $DATABASE_URL > backups/backup-$(date +%Y%m%d_%H%M%S).sql

# Restore database
psql $DATABASE_URL < backups/backup-20240101_120000.sql

# Automated backup (add to crontab)
0 2 * * * /path/to/backup-script.sh
```

## 🐳 Docker Deployment

### Single Container
```bash
# Build image
docker build -f devops/docker/Dockerfile -t btmm-platform:latest .

# Run container
docker run -d \
  --name btmm-platform \
  -p 5000:5000 \
  --env-file .env \
  btmm-platform:latest
```

### Docker Compose (Recommended)
```bash
# Start all services
docker-compose -f devops/docker/docker-compose.yml up -d

# View logs
docker-compose logs -f btmm-app

# Scale application
docker-compose up -d --scale btmm-app=3

# Update services
docker-compose pull
docker-compose up -d
```

### Multi-Stage Production Build
```dockerfile
# Optimized production build
FROM node:20-alpine AS base
# ... (see devops/docker/Dockerfile for complete configuration)
```

## ☸️ Kubernetes Deployment

### Prerequisites
```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Verify cluster access
kubectl cluster-info
```

### Deploy to Kubernetes
```bash
# Create namespace
kubectl create namespace btmm-platform

# Apply configurations
kubectl apply -f devops/kubernetes/ -n btmm-platform

# Check deployment status
kubectl get pods -n btmm-platform
kubectl get services -n btmm-platform

# View logs
kubectl logs -f deployment/btmm-platform -n btmm-platform
```

### Horizontal Pod Autoscaling
```yaml
# HPA configuration (included in deployment.yml)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: btmm-platform-hpa
spec:
  minReplicas: 3
  maxReplicas: 20
  targetCPUUtilizationPercentage: 70
```

### Rolling Updates
```bash
# Update deployment
kubectl set image deployment/btmm-platform btmm-platform=btmm-platform:v2.0.0 -n btmm-platform

# Check rollout status
kubectl rollout status deployment/btmm-platform -n btmm-platform

# Rollback if needed
kubectl rollout undo deployment/btmm-platform -n btmm-platform
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
The CI/CD pipeline includes:
- **Continuous Integration**: Automated testing, linting, security scans
- **Staging Deployment**: Automatic deployment to staging on `develop` branch
- **Production Deployment**: Manual deployment to production on `main` branch
- **Performance Testing**: Load testing on staging environment
- **Security Scanning**: Vulnerability assessment and code analysis

### Pipeline Stages
1. **Test Suite**: Unit tests, integration tests, type checking
2. **Security Scan**: Dependency audit, code analysis
3. **Build**: Multi-stage Docker build
4. **Deploy Staging**: Automatic staging deployment
5. **E2E Tests**: End-to-end testing on staging
6. **Deploy Production**: Manual production deployment
7. **Health Check**: Post-deployment verification
8. **Monitoring**: Performance and error tracking

### Required Secrets
```
# GitHub Secrets
PRODUCTION_DATABASE_URL
STAGING_DATABASE_URL
PRODUCTION_URL
STAGING_URL
SLACK_WEBHOOK
DOCKER_REGISTRY_TOKEN
```

## 📊 Monitoring & Observability

### Prometheus + Grafana Setup
```bash
# Start monitoring stack
npm run monitoring:start

# Access Grafana (default: admin/admin)
http://localhost:3000

# Access Prometheus
http://localhost:9090
```

### Key Metrics to Monitor
- **Application Metrics**: Response time, error rate, throughput
- **System Metrics**: CPU usage, memory usage, disk I/O
- **Database Metrics**: Connection count, query performance
- **Business Metrics**: Active users, trading signals, alert triggers

### Log Management
```bash
# View application logs
npm run logs:app

# View database logs
npm run logs:db

# Stream logs in real-time
docker logs -f btmm-platform
```

### Health Checks
```bash
# Application health check
curl -f http://localhost:5000/health

# Database health check
curl -f http://localhost:5000/health/db

# Automated health monitoring
npm run health:check
```

## 🔒 Security Configuration

### SSL/TLS Setup
```nginx
# NGINX SSL configuration
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
}
```

### Security Headers
```javascript
// Security middleware (included in server setup)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### Database Security
```sql
-- Create restricted database user
CREATE ROLE btmm_app_user WITH LOGIN PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE btmm_platform TO btmm_app_user;
GRANT USAGE ON SCHEMA public TO btmm_app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO btmm_app_user;
```

## ⚡ Performance Optimization

### Application-Level Optimizations
- **Connection Pooling**: Database connection management
- **Caching**: Redis for session storage and data caching
- **Compression**: Gzip compression for responses
- **Static Assets**: CDN for asset delivery
- **Bundle Optimization**: Code splitting and tree shaking

### Database Optimizations
```sql
-- Index optimization
CREATE INDEX CONCURRENTLY idx_alerts_user_active ON alerts(user_id, is_active);
CREATE INDEX CONCURRENTLY idx_templates_category ON pine_script_templates(category);
CREATE INDEX CONCURRENTLY idx_performance_user_date ON trading_performance(user_id, trade_date);

-- Query optimization
ANALYZE;
VACUUM;
```

### Load Testing
```bash
# Run load tests
npm run performance:test

# Lighthouse audit
npm run performance:lighthouse

# Monitor during load test
npm run monitoring:start
```

## 📈 Scaling Strategies

### Horizontal Scaling
```bash
# Docker Compose scaling
docker-compose up -d --scale btmm-app=5

# Kubernetes scaling
kubectl scale deployment btmm-platform --replicas=10
```

### Vertical Scaling
```yaml
# Kubernetes resource limits
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### Database Scaling
- **Read Replicas**: For read-heavy workloads
- **Connection Pooling**: PgBouncer for connection management
- **Partitioning**: Table partitioning for large datasets
- **Indexing**: Strategic index creation

### CDN Integration
```javascript
// Static asset CDN configuration
const cdnUrl = process.env.CDN_URL || '';
app.use('/assets', express.static('public', {
  setHeaders: (res, path) => {
    if (cdnUrl) {
      res.set('Cache-Control', 'public, max-age=31536000');
    }
  }
}));
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connectivity
pg_isready -h localhost -p 5432

# Check connection pool
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

# Reset connections
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle';
```

#### Memory Issues
```bash
# Check memory usage
free -h
docker stats

# Node.js memory debugging
node --inspect=0.0.0.0:9229 dist/index.js
```

#### Performance Issues
```bash
# Profile application
npm run profile

# Database query analysis
EXPLAIN ANALYZE SELECT * FROM alerts WHERE user_id = 1;

# Check slow queries
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
```

### Debug Mode
```bash
# Enable debug mode
NODE_ENV=development DEBUG=* npm run dev

# Database debugging
DEBUG=drizzle:* npm run dev

# Network debugging
DEBUG=express:* npm run dev
```

### Support & Maintenance
- **Log Rotation**: Automated log management
- **Backup Verification**: Regular backup testing
- **Security Updates**: Automated dependency updates
- **Performance Reviews**: Regular performance audits
- **Capacity Planning**: Resource usage monitoring

## 📚 Additional Resources
- [Database Schema Documentation](../database/SCHEMA.md)
- [API Documentation](../api/README.md)
- [Frontend Development Guide](../frontend/DEVELOPMENT.md)
- [Security Best Practices](../security/SECURITY.md)
- [Performance Tuning Guide](../performance/OPTIMIZATION.md)