const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./db/dbconnection');
const blogRoutes = require('./routes/blogRoutes');

dotenv.config({ path: './.env' });

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

connectDB()
.then(() => {
   console.log("Vercel Deployment Success: MongoDB Connected");
})
.catch((error) => {
    console.error("MONGO DB Connection Failed:\n", error);
});

app.use('/', blogRoutes);

module.exports = app;