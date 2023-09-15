
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3001;

app.use(bodyParser.json());

const pool = new Pool({
    user: '',
    host: '',
    database: '',
    password:'',
    port: 5432,
});

app.post('/api/sih', async (req, res) => {
    try{
        const { username, email } = req.body;
        const query = 'INSERT INTO sih (username, email'), VALUES ($1, $2) RETURNING *';
        const values = [username, email];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.log("Error creating user:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/sh1', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM sh1');
        const products = result.rows;
        client.release();

        res.json(products);
    } 
    

});

function checkUserRole(req, res, next) {
    const user = req.user;

    if (user.role === 'contractor') {
        next();
    } else if (user.role === 'eg govt_off') {
        res.status(403).json({ error: 'Permission denied. Read-only access.'});
    } else {
        res.status(401).json({ error: 'Unathorized' });
    }
    
}

app.use(bodyParser.json());

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    res.json({ message: 'Message received!'});
});

app.post()

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})