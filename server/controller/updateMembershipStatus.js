const pool = require('../db/db');
const expressAsyncHandler = require('express-async-handler');

const updateMembershipStatus = expressAsyncHandler(async (req, res) => {
    const { userID, membership_status } = req.body;

    if (!userID) return res.status(400).json({ message: 'User ID is required' });

    try {
        const updatedUser = await pool.query('UPDATE users SET membership_status = $1 WHERE id = $2 RETURNING *', [membership_status, userID]);

        if (updatedUser.rowCount === 0) return res.status(404).json({ message: 'User not found' });

        return res.status(200).json({ message: 'Membership status is updated', user: updatedUser.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Could not update membership status' });
    }
});

module.exports = updateMembershipStatus;