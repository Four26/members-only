const pool = require('../db/db');
const expressAsyncHandler = require('express-async-handler');

const createPost = expressAsyncHandler(async (req, res) => {
    const { text, id } = req.body;

    if (!text) return res.status(400).json({ message: 'Text is required' });

    try {
        const newPost = await pool.query('INSERT INTO messages (text, user_id) VALUES ($1, $2) RETURNING *', [text, id]);
        return res.status(201).json(newPost.rows[0]);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Could not create post' });
    }
});

module.exports = createPost;