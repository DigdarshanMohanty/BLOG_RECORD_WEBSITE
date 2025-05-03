const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get('/', blogController.getHome);
router.get('/create', blogController.getCreate);
router.post('/create', blogController.postCreate);
router.get('/edit/:id', blogController.getEdit);
router.post('/edit/:id', blogController.postEdit);
router.get('/blog/:id', blogController.getSingleBlog);
router.get('/delete/:id', blogController.deleteBlog);

module.exports = router;
