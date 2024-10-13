// const path = require('path');

const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
require('./connection/connection');
const user = require('./routes/user');
const book = require('./routes/book');
const favourites = require('./routes/favourite');
const cart = require('./routes/cart');
const order = require('./routes/order');

const allowedOrigins = [
    'https://vercel.com/ishii1218s-projects/frontend-book-store/CdjqY2rjjZKAyb3nUZoJ58YnK6a3',
    'https://frontend-bookstore-r5si.onrender.com'
  ];


const app = express();
app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If the origin is not in the allowed list, return an error
        return callback(new Error('Not allowed by CORS'));
      }
      return callback(null, true);
    },
    credentials: true // If you need to allow cookies or authorization headers
  }));
app.use(express.json());
app.use(user);
app.use(book);
app.use(favourites);
app.use(cart);
app.use(order);


const PORT = process.env.PORT || 3000; // Default to 3000 when testing locally
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
