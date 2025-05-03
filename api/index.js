const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../db/dbconnection');
const blogRoutes = require('../routes/blogRoutes');
const blogController = require('../controllers/blogController');

const app = express();

// Mongo DB connection
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/', blogController.getHome);
app.use('/blogs', blogRoutes);

module.exports = serverless(app);
