# 🚀 EduConnect Deployment Checklist

Follow these steps to deploy the EduConnect platform to your VPS (Ubuntu/Nginx/PM2).

## 1. Prerequisites on VPS
- [x] Node.js (v18 or higher) installed
- [x] Nginx installed
- [x] PM2 installed (`npm install -g pm2`)
- [ ] MongoDB (Local or Atlas URI) ready
- [ ] Firewall (UFW) allowing ports 80, 443, and 5000 (if direct)

## 2. Server setup
- [ ] Create folder: `mkdir -p /var/www/educonnect`
- [ ] Clone repository: `git clone https://github.com/Javeria-Javaid/EduConnect-platform.git /var/www/educonnect`
- [ ] Enter directory: `cd /var/www/educonnect`

## 3. Environment Config
- [ ] Create `.env` manually: `nano .env`
- [ ] Copy contents from `.env.example` and fill in production values:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `SESSION_SECRET`
  - `CORS_ORIGIN` (Your production domain)
  - `BACKEND_URL` (Your production API URL)
  - `VITE_API_URL` (Same as BACKEND_URL)

## 4. Frontend Build
- [ ] Install dependencies: `npm install`
- [ ] Build React frontend: `npm run build`
  - *This creates the `/dist` folder that Nginx will serve.*

## 5. Nginx Configuration
- [ ] Create Nginx config: `sudo nano /etc/nginx/sites-available/educonnect`
- [ ] Standard config pattern:
  ```nginx
  server {
      listen 80;
      server_name yourdomain.com;

      root /var/www/educonnect/dist;
      index index.html;

      location / {
          try_files $uri $uri/ /index.html;
      }

      location /api {
          proxy_pass http://localhost:5000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
      }

      location /socket.io {
          proxy_pass http://localhost:5000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection "Upgrade";
          proxy_set_header Host $host;
      }
  }
  ```
- [ ] Enable site: `sudo ln -s /etc/nginx/sites-available/educonnect /etc/nginx/sites-enabled/`
- [ ] Test config: `sudo nginx -t`
- [ ] Restart Nginx: `sudo systemctl restart nginx`

## 6. PM2 Backend Process
- [ ] Start backend server: `pm2 start server/index.js --name "educonnect-api"`
- [ ] Save PM2 list: `pm2 save`
- [ ] Setup startup script: `pm2 startup` (Follow terminal instructions)

## 7. Verification
- [ ] Visit domain in browser: Check if frontend loads.
- [ ] Test Login/API: Confirm backend requests are working via `/api`.
- [ ] Check Logs: `pm2 logs educonnect-api`
