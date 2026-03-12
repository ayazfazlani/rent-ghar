
cd /etc/nginx/sites-enabled/
nano propertydealer.pk.conf
sudo nginx -t
sudo systemctl reload nginx

  # # ============================================
  # # ADD THESE NEW BLOCKS FOR API
  # # ============================================

  # # API Reverse Proxy - Route /api/* to Node.js API on port 5000
  # location /api {
  #   proxy_pass http://localhost:5000;
  #   proxy_http_version 1.1;
  #   proxy_set_header Upgrade $http_upgrade;
  #   proxy_set_header Connection 'upgrade';
  #   proxy_set_header Host $host;
  #   proxy_set_header X-Real-IP $remote_addr;
  #   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  #   proxy_set_header X-Forwarded-Proto $scheme;
  #   proxy_cache_bypass $http_upgrade;

  #   # Increase timeouts for long-running requests
  #   proxy_connect_timeout 60s;
  #   proxy_send_timeout 60s;
  #   proxy_read_timeout 60s;
  # }
  # # Uploads/Static Files - Route /uploads/* to API service
  # location /uploads {
  #   proxy_pass http://localhost:5000;
  #   proxy_http_version 1.1;
  #   proxy_set_header Host $host;
  #   proxy_set_header X-Real-IP $remote_addr;
  #   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  #   proxy_set_header X-Forwarded-Proto $scheme;
  # }

```markdown
### Update Environment Variables

Ensure the following environment files are updated with your production domain and port settings:

**1. Root Directory (`/.env`)**
```env
PORT=5000
DOMAIN=propertydealer.pk
```

**2. Web Application (`apps/web/.env`)**
```env
NEXT_PUBLIC_API_URL=https://propertydealer.pk/api
```

**3. API Service (`apps/api/.env`)**
```

on apps/web/.env


PORT=your port

# NEXT_PUBLIC_API_URL=http://localhost:3005 for local


# INTERNAL_API_URL=your internal api url

APP_URL=https://propertydealer.pk

PORT=your port 

on the apps/api/.env

MONGODB_URI=mongodb://your_mongodb_user:your_mongodb_password@your_mongodb_host:your_mongodb_port

PORT=your port

# Application
NODE_ENV=production

FRONTEND_URL=https://propertydealer.pk


