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




const app = express();
app.use(cors());
app.use(express.json());
app.use(user);
app.use(book);
app.use(favourites);
app.use(cart);
app.use(order);


const PORT = process.env.PORT || 1000; // Default to 1000 when testing locally
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
