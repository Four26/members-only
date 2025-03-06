const pool = require('../db/db');
const expressAsyncHandler = require('express-async-handler');

const updateAdminStatus = expressAsyncHandler(async (req, res) => {
    const { userID, is_admin } = req.body;

    if (!userID) return res.status(400).json({ message: 'User ID is required' });

    try {
        const updateAdminStatus = await pool.query('UPDATE users SET is_admin = $1 WHERE id = $2 RETURNING *', [is_admin, userID]);

        if (updateAdminStatus.rowCount === 0) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json({ message: 'Admin status is updated', user: updateAdminStatus.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Could not update admin status' });
    }
});

module.exports = updateAdminStatus;