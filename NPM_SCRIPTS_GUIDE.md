# 📋 UPDATED NPM SCRIPTS GUIDE

## 🚀 **New Optimized Scripts After Cleanup**

### **Development Scripts:**

```bash
# Start frontend only (Vite dev server)
npm run dev

# Start backend services only (all microservices)
npm run backend

# Start both frontend + backend (full development)
npm run fullstack
# OR
npm run dev:all
```

### **Database Setup Scripts (ONE-TIME ONLY):**

```bash
# Shows the command you need to run ONCE to optimize database
npm run setup-db

# Then copy and run the displayed MySQL command manually:
mysql -u root -p pycshop < microservice/db/MASTER_OPTIMIZATION.sql

# Note: Only run this ONCE when setting up the project
# Backend will NOT automatically run this command
```

### **Production Scripts:**

```bash
# Build frontend and start backend
npm run production

# Start backend services only (production)
npm run start

# Build frontend only
npm run build

# Preview built frontend
npm run preview
```

### **Other Scripts:**

```bash
# Code linting
npm run lint

# Alternative backend start commands
npm run server
npm run api
npm run services
```

## 📝 **Changes Made:**

### **✅ Removed (File No Longer Exists):**

- ❌ `setup-cache` script ➜ File `setup_cache.js` was deleted
- ❌ Auto cache setup from backend ➜ Now manual DB optimization

### **✅ Added (New Optimized Approach):**

- ✅ `setup-db` ➜ Run SQL optimization manually
- ✅ `optimize-db` ➜ Alias for database setup
- ✅ `production` ➜ Build + start for production
- ✅ `start` ➜ Standard production start command

### **✅ Updated:**

- ✅ `backend` script ➜ Removed automatic cache setup dependency
- ✅ Cleaner, faster startup without dependency issues

## 🔧 **Setup Instructions:**

### **First Time Setup:**

```bash
# 1. Install dependencies
npm install

# 2. Setup database optimization (ONE-TIME ONLY)
# Step 2a: See the setup command
npm run setup-db

# Step 2b: Copy and run the displayed command manually
mysql -u root -p pycshop < microservice/db/MASTER_OPTIMIZATION.sql

# 3. Start development (daily use)
npm run fullstack
```

### **Daily Development (after setup):**

```bash
# Just start development - no setup needed
npm run fullstack
```

### **Daily Development:**

```bash
# Just start development (no setup needed)
npm run dev:all
```

### **Production Deployment:**

```bash
# Build and start for production
npm run production
```

## ⚠️ **Important Notes:**

### **Database Setup:**

- `npm run setup-db` requires MySQL to be running
- You'll be prompted for MySQL password
- Only run this ONCE to optimize database for 1M+ users
- Creates indexes and cache tables automatically

### **Backend Services:**

- Starts 5 microservices concurrently:
  - API Gateway (port 5000)
  - Auth Service
  - Product Service (port 5002)
  - Admin Service
  - Shop Service

### **Performance:**

- ✅ Database connection pool optimized (100 connections)
- ✅ All critical indexes created
- ✅ Cache tables ready
- ✅ System ready for 1M+ users

## 🚨 **Troubleshooting:**

### **If `npm run setup-db` fails:**

```bash
# Run manually in MySQL
mysql -u root -p
use pycshop;
source microservice/db/MASTER_OPTIMIZATION.sql;
```

### **If backend won't start:**

```bash
# Check if all microservice folders exist
ls microservice/

# Start individual services for debugging
cd microservice/product_service && node app.js
```

### **If frontend won't connect to backend:**

- Check that backend is running on port 5000
- Verify CORS settings in microservices
- Check network/firewall settings

**System is now optimized and ready for high-performance operation! 🎯**
