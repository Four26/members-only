const router = require('express').Router();
const signup = require('../controller/signup');
const login = require('../controller/login');
const createPost = require('../controller/post');
const getAllPosts = require('../controller/getAllPosts');
const updateMembershipStatus = require('../controller/updateMembershipStatus');
const updateAdminStatus = require('../controller/updateAdminStatus');
const deletePost = require('../controller/deletePost');

router.post('/signup', signup);
router.post('/login', login);
router.get('/user', (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    res.status(200).json(req.user);
});
router.post('/post', createPost);
router.get('/getallposts', getAllPosts);
router.patch('/updateMembershipStatus', updateMembershipStatus);
router.patch('/updateAdminStatus', updateAdminStatus);
router.delete('/deletePost/:postID', deletePost);


module.exports = router;