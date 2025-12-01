# 🚀 Deployment Guide - Dashboard PODES Batu 2024

Panduan lengkap untuk deploy aplikasi ke production.

---

## Table of Contents

1. [Pre-requisites](#pre-requisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Full Stack Deployment](#full-stack-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Monitoring](#monitoring)

---

## Pre-requisites

### System Requirements

| Requirement | Minimum | Recommended |
|------------|---------|-------------|
| Node.js | 18.x | 20.x LTS |
| RAM | 512 MB | 1 GB |
| Storage | 100 MB | 500 MB |
| CPU | 1 core | 2 cores |

### Environment Check

```bash
# Check Node.js version
node --version  # Should be >= 18.0.0

# Check npm version  
npm --version   # Should be >= 8.0.0
```

---

## Backend Deployment

### Option 1: VPS/Server Tradisional

#### 1. Setup Server

```bash
# SSH ke server
ssh user@your-server-ip

# Install Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 untuk process management
npm install -g pm2
```

#### 2. Clone & Setup Project

```bash
# Clone repository (atau upload files)
git clone your-repo-url
cd Backend-PODES

# Install dependencies
npm install --production

# Create environment file
cp .env.example .env
nano .env
```

#### 3. Konfigurasi Environment

```env
# .env
NODE_ENV=production
PORT=5001
```

#### 4. Jalankan dengan PM2

```bash
# Start dengan PM2
pm2 start server.js --name "podes-api"

# Pastikan auto-start saat reboot
pm2 startup
pm2 save

# Monitor
pm2 status
pm2 logs podes-api
```

#### 5. Setup Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/podes-api
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/podes-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Option 2: Deploy ke Railway

1. Buat account di [railway.app](https://railway.app)
2. Connect GitHub repository
3. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=5001`
4. Railway akan auto-deploy

### Option 3: Deploy ke Render

1. Buat account di [render.com](https://render.com)
2. New → Web Service
3. Connect repository
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Auto-deploy enabled

### Option 4: Deploy ke Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create podes-api-batu

# Deploy
git push heroku main

# Set env
heroku config:set NODE_ENV=production

# View logs
heroku logs --tail
```

---

## Frontend Deployment

### Step 1: Build Production

```bash
cd Frontend-PODES

# Install dependencies
npm install

# Set API URL di .env
echo "VITE_API_URL=https://api.yourdomain.com/api" > .env.production

# Build untuk production
npm run build
```

Output akan ada di folder `dist/`.

### Option 1: Static File Hosting (Nginx)

```bash
# Copy dist folder ke server
scp -r dist/* user@server:/var/www/podes-dashboard/

# Nginx config
sudo nano /etc/nginx/sites-available/podes-dashboard
```

```nginx
server {
    listen 80;
    server_name dashboard.yourdomain.com;
    root /var/www/podes-dashboard;
    index index.html;

    # Handle React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

### Option 2: Deploy ke Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd Frontend-PODES
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? Select your account
# - Link to existing project? N
# - What's your project name? podes-dashboard
# - In which directory is your code? ./
# - Override settings? N
```

3. Set environment variable:
```bash
vercel env add VITE_API_URL production
# Enter value: https://api.yourdomain.com/api
```

4. Redeploy:
```bash
vercel --prod
```

### Option 3: Deploy ke Netlify

1. Build project:
```bash
npm run build
```

2. Di Netlify Dashboard:
   - New site from Git
   - Connect repository
   - Build command: `npm run build`
   - Publish directory: `dist`

3. Set environment variable:
   - Site settings → Build & deploy → Environment
   - Add: `VITE_API_URL` = `https://api.yourdomain.com/api`

4. Create `_redirects` file untuk SPA:
```
/*    /index.html   200
```

Letakkan di folder `public/`.

### Option 4: Deploy ke GitHub Pages

1. Install gh-pages:
```bash
npm install -D gh-pages
```

2. Update `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/podes-dashboard",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/podes-dashboard/',  // Nama repo
  // ...
});
```

4. Deploy:
```bash
npm run deploy
```

---

## Full Stack Deployment

### Single Server Setup

```
┌─────────────────────────────────────────────┐
│                   NGINX                      │
│  (Reverse Proxy + Static File Server)        │
├─────────────────────────────────────────────┤
│                                             │
│  dashboard.yourdomain.com  →  /var/www/dist │
│                                             │
│  api.yourdomain.com  →  localhost:5001      │
│                                             │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│              Node.js (PM2)                  │
│         Backend API - Port 5001             │
└─────────────────────────────────────────────┘
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/podes-full

# Frontend
server {
    listen 80;
    server_name dashboard.yourdomain.com;
    root /var/www/podes-dashboard;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## Docker Deployment

### Backend Dockerfile

```dockerfile
# Backend-PODES/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy source code
COPY . .

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5001/api/health || exit 1

# Start
CMD ["npm", "start"]
```

### Frontend Dockerfile

```dockerfile
# Frontend-PODES/Dockerfile
FROM node:20-alpine as build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production image
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Frontend nginx.conf

```nginx
# Frontend-PODES/nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

### Docker Compose

```yaml
# docker-compose.yml (letakkan di parent folder)
version: '3.8'

services:
  backend:
    build: ./Backend-PODES
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - PORT=5001
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:5001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./Frontend-PODES
      args:
        - VITE_API_URL=http://localhost:5001/api
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

networks:
  default:
    name: podes-network
```

### Deploy dengan Docker

```bash
# Build dan run
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Monitoring

### PM2 Monitoring (Backend)

```bash
# Status
pm2 status

# Logs
pm2 logs podes-api

# Monitor dashboard
pm2 monit

# Restart
pm2 restart podes-api

# Reload tanpa downtime
pm2 reload podes-api
```

### Health Check Endpoint

Backend menyediakan endpoint untuk health check:

```bash
# Check manually
curl https://api.yourdomain.com/api/health

# Expected response:
{
  "status": "OK",
  "timestamp": "2024-12-02T10:30:00.000Z",
  "dataCount": 24
}
```

### Setup Uptime Monitoring

Gunakan layanan gratis:
- [UptimeRobot](https://uptimerobot.com) - Gratis 50 monitors
- [Better Uptime](https://betteruptime.com) - Gratis untuk 5 monitors
- [Pingdom](https://pingdom.com) - Free tier available

Setup monitoring untuk:
1. Frontend URL: `https://dashboard.yourdomain.com`
2. Backend API: `https://api.yourdomain.com/api/health`

---

## SSL/HTTPS Setup

### Dengan Certbot (Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d dashboard.yourdomain.com -d api.yourdomain.com

# Auto-renewal sudah di-setup oleh certbot
# Test renewal
sudo certbot renew --dry-run
```

---

## Post-Deployment Checklist

- [ ] Backend running dan accessible
- [ ] Frontend accessible
- [ ] API endpoint bekerja
- [ ] CORS configured properly
- [ ] SSL/HTTPS enabled
- [ ] Environment variables set
- [ ] Health monitoring setup
- [ ] Backup strategy in place
- [ ] Error logging configured
- [ ] Performance optimized (gzip, caching)

---

## Troubleshooting

### Backend tidak bisa diakses

1. Cek PM2 status: `pm2 status`
2. Cek logs: `pm2 logs`
3. Cek firewall: `sudo ufw status`
4. Pastikan port 5001 terbuka

### Frontend blank page

1. Cek browser console untuk error
2. Pastikan `VITE_API_URL` benar
3. Cek file di `/var/www/` sudah ada
4. Cek Nginx error log: `/var/log/nginx/error.log`

### CORS Error di Production

Pastikan backend mengizinkan origin frontend:

```javascript
// server.js
app.use(cors({
  origin: ['https://dashboard.yourdomain.com'],
  credentials: true
}));
```

### 502 Bad Gateway

1. Backend tidak running - restart PM2
2. Nginx proxy_pass salah - cek config
3. Port mismatch - pastikan sama

---

*Deployment Guide terakhir diperbarui: Desember 2024*
