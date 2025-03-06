const pool = require('../db/db');
const expressAsyncHandler = require('express-async-handler');

const deletePost = expressAsyncHandler(async (req, res) => {
    const { postID } = req.params;
    console.log(postID);

    try {
        const result = await pool.query('DELETE FROM messages WHERE id = $1 RETURNING *', [postID]);

        if (result.rowCount === 0) return res.status(400).json({ message: 'Post not found' });

        return res.status(200).json({ message: 'Post deleted successfully', deletedPost: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Could not delete post' });
    }

});

module.exports = deletePost;