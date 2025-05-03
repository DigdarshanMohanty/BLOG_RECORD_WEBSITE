const BlogSchema = require('../models/blog');
const { caps } = require('../public/javascripts/script');

exports.getHome = async (req, res) => {
    try {
        const blogs = await BlogSchema.find();
        res.render('home', { blogs });
    } catch (error) {
        console.error("Error loading blogs:\n", error);
        res.send('Error loading blogs.');
    }
};

exports.getCreate = (req, res) => {
    res.render('create');
};

exports.postCreate = async (req, res) => {
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
};

exports.getEdit = async (req, res) => {
    try {
        const blog = await BlogSchema.findById(req.params.id);
        if (!blog) return res.status(404).send("Blog not found");
        res.render('edit', { blog });
    } catch (error) {
        console.error("Error loading blog:\n", error);
    }
};

exports.postEdit = async (req, res) => {
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
};

exports.getSingleBlog = async (req, res) => {
    try {
        const blog = await BlogSchema.findById(req.params.id);
        if (!blog) return res.status(404).send("Blog not found");
        res.render('blog', { blog });
    } catch (error) {
        console.error("Error loading blog:\n", error);
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        await BlogSchema.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        console.error("Error deleting blog:\n", error);
    }
};
