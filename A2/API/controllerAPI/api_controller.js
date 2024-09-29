const express = require('express');
const router = express.Router();
var dbcon = require("../crowdfunding_db");

var connection = dbcon.getConnection();
    connection.connect();
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database: ' + err.stack);
            return;
        }
        console.log('Connected to database as id ' + connection.threadId);
    });

router.get('/', (req, res) => {
    const query = 'SELECT fundraiser.*, category.NAME AS category_name FROM fundraiser INNER JOIN category ON fundraiser.CATEGORY_ID = category.CATEGORY_ID WHERE fundraiser.ACTIVE = 1';
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving active fundraisers: ' + err.message);
            return;
        }
        res.send(results);
    });
});

router.get('/category', (req, res) => {
    const query = 'SELECT * FROM category';
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving categories: ' + err.message);
            return;
        }
        res.send(results);
    });
});

router.get('/search', (req, res) => {
    const organizer = req.query.organizer;
    const city = req.query.city;
    const categoryId = req.query.categoryId;

    let query = 'SELECT fundraiser.*, category.NAME as category_name FROM fundraiser INNER JOIN category ON fundraiser.CATEGORY_ID = category.CATEGORY_ID WHERE fundraiser.ACTIVE = 1';
    let conditions = [];
    if (organizer) {
        conditions.push(`fundraiser.ORGANIZER LIKE '%${organizer}%'`);
    }
    if (city) {
        conditions.push(`fundraiser.CITY LIKE '%${city}%'`);
    }
    if (categoryId) {
        conditions.push(`fundraiser.CATEGORY_ID = ${categoryId}`);
    }
    if (conditions.length > 0) {
        query += ' AND ' + conditions.join(' AND ');
    }

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving fundraisers: ' + err.message);
            res.status(500).send('Error retrieving fundraisers.');
            return;
        }
        res.send(results);
    });
});

app.get('/fundraiser/:id', (req, res) => {
    const fundraiserId = req.params.id;
    const query = 'SELECT fundraiser.*, category.NAME AS category_name FROM fundraiser INNER JOIN category ON fundraiser.CATEGORY_ID = category.CATEGORY_ID WHERE fundraiser.FUNDRAISER_ID =?';
    connection.query(query, [fundraiserId], (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving fundraiser details: ' + err.message);
            return;
        }
        if (results.length === 0) {
            res.status(404).send('Fundraiser not found');
            return;
        }
        res.send(results[0]);
    });
});

module.exports = router;