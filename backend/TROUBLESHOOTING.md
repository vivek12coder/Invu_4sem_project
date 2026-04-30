# Backend Database Connection Troubleshooting Guide

## 🔴 Critical Fixes Applied

### 1. **Server Startup Issue (MAIN BUG)**
**Problem**: Server was starting before MongoDB connected
```javascript
// ❌ BEFORE
connectDB();  // Not awaited!
app.listen(PORT, ...)  // Runs immediately

// ✅ AFTER
const startServer = async () => {
  await connectDB();  // Wait for DB connection first
  app.listen(PORT, ...)
}
startServer();
```

### 2. **Missing Auth Endpoint**
Added: `GET /api/auth/profile` - Retrieve user profile info

### 3. **Missing Category Endpoints**
Added:
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### 4. **Improved Error Logging**
Enhanced MongoDB connection errors with troubleshooting tips

---

## ✅ How to Verify It's Working

### Step 1: Run Diagnostic
```bash
cd backend
node diagnostic.js
```

Expected output:
```
✓ MONGO_URI = mongodb://localhost:27017/invu_expense_tracker
✓ JWT_SECRET = ****xxxx
✓ Connected to localhost:27017
✓ Database: invu_expense_tracker
```

### Step 2: Start Backend
```bash
npm run dev
```

Expected output:
```
🔄 Connecting to MongoDB...
✓ MongoDB Connected: localhost:27017
✓ Database: invu_expense_tracker
✓ Server running on port 5000
✓ API available at http://localhost:5000/api
```

### Step 3: Test Endpoints (Use Postman/Thunder Client)

#### Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

#### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### Get Profile (Use token from login)
```
GET http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Get Expenses
```
GET http://localhost:5000/api/expenses
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🔧 Common Issues & Solutions

### ❌ MongoDB connection error: "ECONNREFUSED"
**Solution 1: Start MongoDB locally**
```bash
# Windows
mongod

# Mac/Linux
brew services start mongodb-community
# or
mongod
```

**Solution 2: Use MongoDB Atlas (Cloud)**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/invu_expense_tracker?retryWrites=true&w=majority
```

### ❌ "MONGO_URI is not defined"
**Check .env file exists:**
```bash
# In backend/ folder, should have .env
cat .env
```

If missing, create it:
```env
MONGO_URI=mongodb://localhost:27017/invu_expense_tracker
PORT=5000
JWT_SECRET=your_secret_key_here_change_this
NODE_ENV=development
```

### ❌ "ENOTFOUND cluster.mongodb.net"
**Causes:**
- Internet not connected
- Firewall blocking MongoDB
- IP not whitelisted (MongoDB Atlas)

**Solutions:**
- Check internet connection
- Check firewall/antivirus
- Add IP to MongoDB Atlas: Network Access → IP Whitelist → Add Current IP

### ❌ Routes return 401 Unauthorized
**Problem:** Token not being sent properly

**Fix:**
```javascript
// Frontend axios should have:
config.headers.Authorization = `Bearer ${token}`;
```

### ❌ "Cannot find module 'mongoose'"
```bash
cd backend
npm install
```

---

## 🧪 Test Data

### Seed Database
```bash
cd backend
node seeds/seedData.js
```

**Sample Users:**
- Email: john@example.com | Password: password123
- Email: jane@example.com | Password: password123
- Email: bob@example.com | Password: password123

---

## 📊 API Endpoints Summary

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| POST | /api/auth/register | No | Create user account |
| POST | /api/auth/login | No | Login and get token |
| GET | /api/auth/profile | Yes | Get user profile |
| GET | /api/categories | Yes | List all categories |
| POST | /api/categories | Yes | Create category |
| PUT | /api/categories/:id | Yes | Update category |
| DELETE | /api/categories/:id | Yes | Delete category |
| GET | /api/expenses | Yes | List expenses |
| POST | /api/expenses | Yes | Create expense |
| PUT | /api/expenses/:id | Yes | Update expense |
| DELETE | /api/expenses/:id | Yes | Delete expense |
| GET | /api/health | No | Health check |

---

## 🔍 Debug Commands

### Check if MongoDB is running
```bash
# On Windows
netstat -ano | findstr :27017

# On Mac/Linux
lsof -i :27017
```

### View MongoDB Logs
```bash
# Check .env MONGO_URI
echo MONGO_URI in backend/.env

# Test connection string
mongosh "YOUR_MONGO_URI"
```

### View Backend Logs
```bash
# Keep terminal open when running:
npm run dev

# Check for errors starting with ✗
```

---

## 📝 Files Modified

1. ✅ `backend/server.js` - Added async startup with proper DB connection
2. ✅ `backend/config/db.js` - Enhanced error messages
3. ✅ `backend/routes/auth.js` - Added profile endpoint
4. ✅ `backend/routes/categories.js` - Added PUT and DELETE endpoints
5. ✅ `backend/diagnostic.js` - NEW: Diagnostic tool

---

## ✨ Next Steps

1. ✓ Verify MongoDB is running
2. ✓ Check `backend/.env` exists and has MONGO_URI
3. ✓ Run `node diagnostic.js` to verify setup
4. ✓ Start backend: `npm run dev`
5. ✓ Test endpoints with Postman
6. ✓ Start frontend: `npm run dev`

**Everything should now work! 🎉**
