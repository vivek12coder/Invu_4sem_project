require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Expense = require('../models/Expense');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Expense.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create dummy users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'password123',
      },
    ]);
    console.log(`✓ Created ${users.length} users`);

    // Create categories for each user
    const categories = await Category.create([
      // John's categories
      { user: users[0]._id, name: 'Food & Dining', isDefault: true },
      { user: users[0]._id, name: 'Transportation', isDefault: true },
      { user: users[0]._id, name: 'Entertainment', isDefault: false },
      { user: users[0]._id, name: 'Utilities', isDefault: false },

      // Jane's categories
      { user: users[1]._id, name: 'Groceries', isDefault: true },
      { user: users[1]._id, name: 'Shopping', isDefault: false },
      { user: users[1]._id, name: 'Health', isDefault: true },

      // Bob's categories
      { user: users[2]._id, name: 'Food & Dining', isDefault: true },
      { user: users[2]._id, name: 'Gaming', isDefault: false },
    ]);
    console.log(`✓ Created ${categories.length} categories`);

    // Create expenses
    const expenses = await Expense.create([
      // John's expenses
      {
        user: users[0]._id,
        title: 'Lunch at Pizza Place',
        amount: 15.99,
        category: 'Food & Dining',
        date: new Date('2024-04-25'),
      },
      {
        user: users[0]._id,
        title: 'Gas for car',
        amount: 50,
        category: 'Transportation',
        date: new Date('2024-04-24'),
      },
      {
        user: users[0]._id,
        title: 'Movie tickets',
        amount: 30,
        category: 'Entertainment',
        date: new Date('2024-04-23'),
      },
      {
        user: users[0]._id,
        title: 'Monthly electricity bill',
        amount: 120,
        category: 'Utilities',
        date: new Date('2024-04-20'),
      },
      {
        user: users[0]._id,
        title: 'Dinner with friends',
        amount: 45.5,
        category: 'Food & Dining',
        date: new Date('2024-04-22'),
      },

      // Jane's expenses
      {
        user: users[1]._id,
        title: 'Weekly groceries',
        amount: 85.75,
        category: 'Groceries',
        date: new Date('2024-04-24'),
      },
      {
        user: users[1]._id,
        title: 'New shoes',
        amount: 120,
        category: 'Shopping',
        date: new Date('2024-04-25'),
      },
      {
        user: users[1]._id,
        title: 'Gym membership',
        amount: 50,
        category: 'Health',
        date: new Date('2024-04-21'),
      },

      // Bob's expenses
      {
        user: users[2]._id,
        title: 'Breakfast',
        amount: 12.5,
        category: 'Food & Dining',
        date: new Date('2024-04-25'),
      },
      {
        user: users[2]._id,
        title: 'New game',
        amount: 59.99,
        category: 'Gaming',
        date: new Date('2024-04-20'),
      },
    ]);
    console.log(`✓ Created ${expenses.length} expenses`);

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
