// backend/seed/seed.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') }); // ✅ load backend/.env
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

(async () => {
  try {
    await connectDB();
    console.log('Connected. Clearing old data...');
    await Promise.all([
      Restaurant.deleteMany({}),
      MenuItem.deleteMany({}),
      User.deleteMany({}),
    ]);

    // Users
    const password = await bcrypt.hash('password123', 10);
    const [admin, user] = await User.insertMany([
      { name: 'Admin One', email: 'admin@example.com', password, role: 'admin' },
      { name: 'Regular User', email: 'user@example.com',  password, role: 'user'  },
    ]);

    // Restaurants
    const restaurants = await Restaurant.insertMany([
      {
        name: 'Pizza Haven',
        description: 'Wood-fired pizzas and garlic bread.',
        cuisine: 'Italian',
        address: '12 Cheese St',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&h=800&q=80',
        isActive: true,
      },
      {
        name: 'Sushi World',
        description: 'Rolls, nigiri and ramen.',
        cuisine: 'Japanese',
        address: '8 Ocean Ave',
        imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754',
        isActive: true,
      },
      {
        name: 'Burger Barn',
        description: 'Smash burgers and fries.',
        cuisine: 'American',
        address: '101 Grill Rd',
        imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349',
        isActive: true,
      },
    ]);

    const [pizza, sushi, burger] = restaurants;

    // Menu items
   await MenuItem.insertMany([
  { restaurantId: pizza._id, name: 'Margherita', description: 'Tomato, mozzarella, basil', price: 14, isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&h=800&q=80' },
  { restaurantId: pizza._id, name: 'Pepperoni',  description: 'Pepperoni & mozzarella',   price: 16, isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&h=800&q=80' },

  { restaurantId: sushi._id, name: 'Salmon Nigiri (6pc)', description: 'Fresh salmon', price: 18, isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754' },
  { restaurantId: sushi._id, name: 'California Roll',     description: 'Crab & avocado', price: 12, isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754' },

  { restaurantId: burger._id, name: 'Classic Smash', description: 'Beef, cheddar, pickles', price: 13, isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349' },
  { restaurantId: burger._id, name: 'BBQ Bacon',     description: 'Beef, bacon, BBQ sauce', price: 15, isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349' },
]);


    console.log('✅ Seed complete.');
    console.log('Login accounts:');
    console.log('  admin@example.com / password123 (admin)');
    console.log('  user@example.com  / password123 (user)');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
})();
