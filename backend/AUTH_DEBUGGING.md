# Authentication Debugging Guide

## 🔴 Error: 400 Bad Request on /api/auth/register or /api/auth/login

### ✅ Quick Fixes Applied:

1. **Backend Improvements:**
   - Added request body logging (see terminal output)
   - Added detailed validation error messages
   - Added JSON parsing with higher limits
   - Better error responses

2. **Frontend Improvements:**
   - Show all validation errors to user
   - Log errors to browser console
   - Better error messages

---

## 🚀 How to Debug Auth Issues

### Step 1: Verify Backend is Running and Connected to DB

```bash
cd backend
node diagnostic.js
```

Expected output:
```
✓ MONGO_URI = mongodb://localhost:27017/invu_expense_tracker
✓ Connected to localhost:27017
✓ Database: invu_expense_tracker
```

### Step 2: Start Backend with Logging

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
✓ Health check: http://localhost:5000/api/health
```

### Step 3: Test Health Endpoint

Open browser and go to: `http://localhost:5000/api/health`

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-04-30T10:30:45.123Z"
}
```

### Step 4: Test Register Endpoint with Postman/Thunder Client

**Request:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**Backend Terminal Should Show:**
```
📨 POST /api/auth
Body: {"name":"Test User","email":"test@example.com","password":"password123"}
```

**Expected Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

---

## 🔍 Troubleshooting 400 Errors

### ❌ Error: "Valid email is required"

**Problem:** Email is not in valid format

**Solution:**
```javascript
✗ Wrong: "email": "testexample.com"  // Missing @
✗ Wrong: "email": "test@"            // Missing domain
✓ Correct: "email": "test@example.com"
```

### ❌ Error: "Password must be at least 6 characters"

**Problem:** Password is too short

**Solution:**
```javascript
✗ Wrong: "password": "1234"   // Only 4 characters
✓ Correct: "password": "password123"  // 11 characters
```

### ❌ Error: "Name is required"

**Problem:** Name field is empty or whitespace only

**Solution:**
```javascript
✗ Wrong: "name": ""          // Empty
✗ Wrong: "name": "   "       // Only spaces
✓ Correct: "name": "John Doe"
```

### ❌ "Cannot POST /api/auth/register" (404)

**Problem:** Backend is not running or routes not loaded

**Solution:**
```bash
# Check if backend is running
netstat -ano | findstr :5000  # Windows

# Restart backend
npm run dev
```

### ❌ "Failed to fetch" (Network Error)

**Problem:** Frontend can't reach backend

**Solution:**
1. Check `frontend/.env` has correct `VITE_API_URL`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

2. Verify backend is accessible:
   ```bash
   # In another terminal
   curl http://localhost:5000/api/health
   ```

3. Hard refresh frontend (`Ctrl+Shift+R`)

---

## 🧪 Test Scenarios

### Scenario 1: Register New User

**Terminal Output When Registering:**
```
📨 POST /api/auth
Body: {"name":"John Doe","email":"john@example.com","password":"password123"}
✓ Response: 201 Created with token
```

**Frontend Should Show:**
- Success message or redirect to dashboard
- Token stored in localStorage

**Check in Browser DevTools:**
```javascript
// Open Console and run:
localStorage.getItem('token')    // Should show JWT token
localStorage.getItem('user')     // Should show user object
```

### Scenario 2: Login with Seeded Data

**Seeded user credentials:**
```
Email: john@example.com
Password: password123
```

**Test Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

Expected response: JWT token

### Scenario 3: Test with Invalid Email

**Request:**
```json
{
  "name": "Test",
  "email": "invalid-email",
  "password": "password123"
}
```

**Expected Response (400):**
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Valid email is required",
      "path": "email",
      "location": "body"
    }
  ]
}
```

---

## 📊 API Response Codes

| Code | Meaning | Example |
|------|---------|---------|
| **201** | Account created successfully | Register success |
| **200** | Login successful | Login with correct credentials |
| **400** | Validation failed | Email already exists, invalid password |
| **401** | Unauthorized | Missing/invalid token |
| **404** | Route not found | Wrong endpoint |
| **500** | Server error | Database connection failed |

---

## 🔧 Environment Variables Check

**Verify `.env` files exist:**

```bash
# Backend
cat backend/.env
# Should show:
# MONGO_URI=mongodb://localhost:27017/invu_expense_tracker
# PORT=5000
# JWT_SECRET=your_secret_key_here
# NODE_ENV=development

# Frontend
cat frontend/.env
# Should show:
# VITE_API_URL=http://localhost:5000
```

---

## 🐛 Debug Steps if Still Getting 400

1. **Check backend terminal for error logs:**
   ```
   Look for lines starting with 📨 POST /api/auth
   Check Body: output to see what's being sent
   ```

2. **Check frontend console (F12):**
   ```
   Look for red errors
   Check Network tab → auth/register → Response
   This shows exact error from backend
   ```

3. **Test with curl:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

4. **Restart everything:**
   ```bash
   # Stop backend (Ctrl+C)
   # Stop frontend (Ctrl+C)
   # Restart backend: npm run dev
   # Restart frontend: npm run dev
   # Hard refresh browser (Ctrl+Shift+R)
   ```

---

## ✨ What Should Work After Fixes

✅ Register new user  
✅ Login with credentials  
✅ See data on dashboard  
✅ Add new expenses  
✅ Manage categories  
✅ See analytics  

**If you see these working, auth is fixed! 🎉**
