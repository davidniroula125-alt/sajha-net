const router = require('express').Router();
const { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', adminAuth, createBlog);
router.put('/:id', adminAuth, updateBlog);
router.delete('/:id', adminAuth, deleteBlog);

module.exports = router;
