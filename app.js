const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./db/dbconnection');
const blogRoutes = require('./routes/blogRoutes');

dotenv.config({ path: './.env' });

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.error("MONGO DB Connection Failed:\n", error);
});

app.use('/', blogRoutes);
