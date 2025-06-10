const express = require('express');
const path = require('path');
const connectDB = require('./db/dbconnection.js');
const BlogSchema = require('./models/blog.js');
const { caps } = require('./utils/textHelpers.js');
const session = require('express-session');
const flash = require('connect-flash');
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

app.use(session({
    secret: process.env.SESSION_SECRET || 'averysecretkey', // Use an environment variable for the secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Set to true if using HTTPS in production
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


//Routes
const postsPerPage = 6; // Define posts per page

app.get('/',async (req, res) => {  
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const totalPosts = await BlogSchema.countDocuments();
        const totalPages = Math.ceil(totalPosts / postsPerPage);

        const blogs = await BlogSchema.find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip((currentPage - 1) * postsPerPage)
            .limit(postsPerPage);

        res.render('home', {
            blogs,
            currentPage,
            totalPages
        });
    } catch (error) {
        console.error("Error loading blogs:\n", error);
        req.flash('error_msg', 'Could not load blogs. Please try again later.');
        res.status(500).render('error', { message: req.flash('error_msg') });
    }
});

app.get('/create',(req, res) => {
    res.render('create');
});

app.post('/create', async(req, res) => {   //
    const { title, description, imageUrl } = req.body;
    try {
        await BlogSchema.create({
            title: caps(title),
            description,
            imageUrl
        });
        req.flash('success_msg', 'Blog created successfully!');
        res.redirect('/');
    } catch (error) {
        console.error("Error creating blog:\n", error);
        req.flash('error_msg', 'Error creating blog. Please try again.');
        res.redirect('/create'); // Redirect back to create form
    }
});

app.get('/edit/:id', async(req, res) => {
    try {
        const blog = await BlogSchema.findById(req.params.id);
        if (!blog) {
            req.flash('error_msg', 'Blog not found.');
            return res.status(404).render('error', { message: req.flash('error_msg') });
        }
        res.render('edit', { blog });
    } catch (error) {
        console.error("Error loading blog for edit:\n", error);
        req.flash('error_msg', 'An unexpected error occurred while loading the blog for editing.');
        res.status(500).render('error', { message: req.flash('error_msg') });
    }
});

app.post('/edit/:id', async(req, res) => {
    const { title, description, imageUrl } = req.body;
    try {
        await BlogSchema.findByIdAndUpdate(req.params.id, {
            title: caps(title),
            description,
            imageUrl
        }, { new: true });
        req.flash('success_msg', 'Blog updated successfully!');
        res.redirect('/');
    } catch (error) {
        console.error("Error updating blog:\n", error);
        req.flash('error_msg', 'Error updating blog. Please try again.');
        res.redirect('/edit/' + req.params.id); // Redirect back to edit form
    }
});


app.get('/blog/:id', async(req, res) => {
    try {
        const blog = await BlogSchema.findById(req.params.id);
        if (!blog) {
            req.flash('error_msg', 'Blog not found.');
            return res.status(404).render('error', { message: req.flash('error_msg') });
        }
        const postUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(blog.title)}`;
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        const linkedinShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(blog.title)}`;

        res.render('blog', {
            blog,
            twitterShareUrl,
            facebookShareUrl,
            linkedinShareUrl
        });
    } catch (error) {
        console.error("Error loading blog:\n", error);
        req.flash('error_msg', 'An unexpected error occurred.');
        res.status(500).render('error', { message: req.flash('error_msg') });
    }
});

app.get('/delete/:id',async(req, res) => {
    try {
        await BlogSchema.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Blog deleted successfully!');
        res.redirect('/');
    } catch (error) {
        console.error("Error deleting blog:\n", error);
        req.flash('error_msg', 'Error deleting blog. Please try again.');
        res.redirect('/');
    }
});

app.get('/search', async (req, res) => {
    try {
        const searchQuery = req.query.query || '';

        if (!searchQuery.trim()) {
            return res.redirect('/');
        }

        const searchResults = await BlogSchema.find({
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        res.render('search_results', {
            blogs: searchResults,
            searchQuery,
            pageTitle: `Search results for "${searchQuery}"`
        });
    } catch (error) {
        console.error("Error during search:\n", error);
        req.flash('error_msg', 'An error occurred during the search. Please try again.');
        res.status(500).render('error', { message: 'Search Error' }); // Or a more user-friendly message
    }
});