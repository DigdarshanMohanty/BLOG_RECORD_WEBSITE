const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./db/dbconnection.js');
const BlogSchema = require('./models/blog.js');
const { caps } = require('./public/javascripts/script.js');

dotenv.config({
    path: './.env'
})

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000,() =>{
        console.log(`Server is running at port : ${process.env.PORT} `);
    });
})
.catch((error) =>{
    console.log("MONGO DB Connection Failed !! \n",error) ;  
});


app.get('/', async (req, res) => {
    try {
        const blogs = await BlogSchema.find();
        res.render('home', { blogs });
    } catch (error) {
        console.log(error);
        res.send('Error loading blogs.');
    }
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/create', async (req, res) => {
    const { title , description } = req.body;
    const Blog = await BlogSchema.create({
        title: caps(title),
        description: description
    });
    res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
    try {
        const blog = await BlogSchema.findById(req.params.id);
        if (!blog) return res.status(404).send("Blog not found");
        res.render('edit', { blog });
    } catch (error) {
        console.error("Error loading blog:\n", error);
    }
});

app.post('/edit/:id', async (req, res) => {
    const { title, description } = req.body;
    try {
        const blog = await BlogSchema.findByIdAndUpdate(req.params.id, {
            title: caps(title),
            description: description
        }, { new: true });
        res.redirect('/');
    }catch (error) {
        console.error("Error updating blog:\n", error);
    }
});

app.get('/blog/:id', async (req, res) => {
    const blog = await BlogSchema.findById(req.params.id);
    if (!blog) {
        return res.status(404).send("Blog not found");
    }
    res.render('blog', { blog });
});

app.get('/delete/:id', async (req, res) => {
    try {
        const blog = await BlogSchema.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).send("Blog not found");
        res.redirect('/');
    } catch (error) {
        console.error("Error deleting blog:\n", error);
    }
});