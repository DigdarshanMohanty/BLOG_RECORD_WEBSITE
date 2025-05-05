const express = require('express');
const path = require('path');
const connectDB = require('./db/dbconnection.js');
const BlogSchema = require('./models/blog.js');
const { caps } = require('./public/javascripts/script.js');
const app = express();
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

// Connection to MongoDB
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 6000, () => {
      console.log('MONGODB connected successfully!');
      console.log(`Server is running on port: ${process.env.PORT || 6000}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));


// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


//Routes
app.get('/',async (req, res) => {  
    try {
        const blogs = await BlogSchema.find();
        res.render('home', { blogs });
    } catch (error) {
        console.error("Error loading blogs:\n", error);
        res.send('Error loading blogs.');
    }
});

app.get('/create',(req, res) => {
    res.render('create');
});

app.post('/create', async(req, res) => {   //
    const { title, description } = req.body;
    try {
        await BlogSchema.create({
            title: caps(title),
            description
        });
        res.redirect('/');
    } catch (error) {
        console.error("Error creating blog:\n", error);
    }
});

app.get('/edit/:id', async(req, res) => {
    try {
        const blog = await BlogSchema.findById(req.params.id);
        if (!blog) return res.status(404).send("Blog not found");
        res.render('edit', { blog });
    } catch (error) {
        console.error("Error loading blog:\n", error);
    }
});

app.post('/edit/:id', async(req, res) => {
    const { title, description } = req.body;
    try {
        await BlogSchema.findByIdAndUpdate(req.params.id, {
            title: caps(title),
            description
        }, { new: true });
        res.redirect('/');
    } catch (error) {
        console.error("Error updating blog:\n", error);
    }
});


app.get('/blog/:id', async(req, res) => {
    try {
        const blog = await BlogSchema.findById(req.params.id);
        if (!blog) return res.status(404).send("Blog not found");
        res.render('blog', { blog });
    } catch (error) {
        console.error("Error loading blog:\n", error);
    }
});

app.get('/delete/:id',async(req, res) => {
    try {
        await BlogSchema.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error("Error deleting blog:\n", error);
    }
});


