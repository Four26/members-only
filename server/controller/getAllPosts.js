const pool = require('../db/db');
const expressAsyncHandler = require('express-async-handler');

const getAllPosts = expressAsyncHandler(async (req, res) => {
    try {
        const getPosts = await pool.query('SELECT messages.*, users.username FROM messages JOIN users ON messages.user_id = users.id ORDER BY messages.created_at DESC');
        const result = getPosts.rows;
        return res.status(200).json(result);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Could not get posts', error: error.message });
    }
});

module.exports = getAllPosts;