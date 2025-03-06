const bcryptjs = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const pool = require('../db/db');

const signup = asyncHandler(async (req, res) => {
    const { firstname, lastname, username, password, confirmPassword } = req.body;


    if (password !== confirmPassword) {
        console.log('Password does not match');
        return res.status(400).json({ message: 'Password does not match' });
    }

    try {

        const checkedDuplicateUsername = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (checkedDuplicateUsername.rows.length > 0) {
            return res.status(400).json({ message: 'Username is already registered' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const signupQuery = `INSERT INTO users (firstname, lastname, username, password, membership_status, is_admin ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const values = [firstname, lastname, username, hashedPassword, false, false];
        const result = await pool.query(signupQuery, values);
        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = signup;