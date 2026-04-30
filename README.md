# 💰 Invu - Expense Tracker

A full-stack expense tracking application built with the **MERN stack** (MongoDB, Express, React, Node.js). Track your spending, categorize expenses, and visualize your financial data with an intuitive interface.

## 🎯 Features

- ✅ **User Authentication** - Secure login/registration with JWT
- ✅ **Expense Tracking** - Add, edit, delete, and manage expenses
- ✅ **Category Management** - Create custom expense categories
- ✅ **Analytics Dashboard** - Visualize spending patterns
- ✅ **Responsive UI** - Built with React and Tailwind CSS
- ✅ **Vite Build Tool** - Fast development and production builds

## 📋 Project Structure

```
Invu_4sem_project/
├── backend/                 # Node.js + Express API
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── middleware/
│   │   └── auth.js         # JWT authentication middleware
│   ├── models/
│   │   ├── User.js         # User schema
│   │   ├── Category.js     # Category schema
│   │   └── Expense.js      # Expense schema
│   ├── routes/
│   │   ├── auth.js         # Authentication endpoints
│   │   ├── categories.js   # Category endpoints
│   │   └── expenses.js     # Expense endpoints
│   ├── seeds/
│   │   └── seedData.js     # Database seeding script
│   ├── .env                # Environment variables (local)
│   ├── .gitignore          # Git ignore rules
│   ├── package.json        # Backend dependencies
│   └── server.js           # Express server entry point
│
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js    # API client configuration
│   │   ├── components/     # React components
│   │   ├── context/        # React context (Auth)
│   │   ├── pages/          # Page components
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env                # Frontend environment variables
│   ├── .gitignore          # Git ignore rules
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   ├── postcss.config.js   # PostCSS configuration
│   └── index.html          # HTML entry point
│
├── .gitignore              # Root git ignore rules
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file with:**
   ```env
   MONGO_URI=mongodb://localhost:27017/invu_expense_tracker
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. **Seed dummy data (optional):**
   ```bash
   node seeds/seedData.js
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file with:**
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Health Check
- `GET /api/health` - Server health status

## 🗄️ Database Schemas

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  timestamps: true
}
```

### Category
```javascript
{
  user: ObjectId (ref: User),
  name: String,
  isDefault: Boolean,
  timestamps: true
}
```

### Expense
```javascript
{
  user: ObjectId (ref: User),
  title: String,
  amount: Number,
  category: String,
  date: Date,
  timestamps: true
}
```

## 🛠️ Available Scripts

### Backend
```bash
npm run start    # Production server
npm run dev      # Development server with nodemon
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## 📦 Dependencies

### Backend
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **nodemon** - Auto-restart on changes (dev)

### Frontend
- **react** - UI library
- **axios** - HTTP client
- **tailwindcss** - Utility-first CSS
- **vite** - Build tool
- **postcss** - CSS processor

## 🔐 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/invu_expense_tracker
PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 🧪 Dummy Data

The project includes a seed script to populate sample data:

**Includes:**
- 3 sample users (john@example.com, jane@example.com, bob@example.com)
- Multiple categories per user
- 10+ sample expenses with various amounts and dates

**To seed:**
```bash
cd backend
node seeds/seedData.js
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env` file
- Verify MongoDB connection string format

### CORS Errors
- Ensure backend `PORT` and frontend `VITE_API_URL` are correctly configured
- Check CORS middleware in `server.js`

### Environment Variables Undefined
- Create `.env` files in both backend and frontend directories
- Verify `.env` files are not in `.gitignore`
- Restart development servers after changing `.env`

## 📝 Notes

- Password for all dummy users: `password123`
- Frontend is configured to use Tailwind CSS for styling
- JWT tokens are used for secure authentication
- All sensitive data should be stored in `.env` files

## 👨‍💻 Development Tips

1. **Use PostMan/Thunder Client** to test API endpoints
2. **Enable Redux DevTools** for state management debugging
3. **Check console logs** in both browser and terminal for errors
4. **Restart servers** after changing environment variables

## 📄 License

This project is created for educational purposes as part of a 4-semester curriculum project.

---

**Happy Expense Tracking! 💸**