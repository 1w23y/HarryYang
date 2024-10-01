const express = require('express');  // Create an Express Router instance and define routes
const router = express.Router();
var dbcon = require("../crowdfunding_db");  // Import the database connection configuration file

var connection = dbcon.getConnection();  // Call the introduced getConnection method to get the database connection object.
connection.connect((err) => {           // Connect to the database
    if (err) {                           // If a connection error occurs, an error message is printed
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);   // If the connection is successful, print the thread ID
});

router.get('/', (req, res) => {     // Get all active fundraiser and category names
    const query = 'SELECT fundraiser.*, category.NAME AS category_name FROM fundraiser INNER JOIN category ON fundraiser.CATEGORY_ID = category.CATEGORY_ID WHERE fundraiser.ACTIVE = 1';
    connection.query(query, (err, results) => {
        if (err) {            // If the query is incorrect, an error message is displayed
            res.status(500).send('Error retrieving active fundraisers: ' + err.message);
            return;
        }
        res.send(results);    // If the query is successful, the query result is displayed
    });
});

router.get('/category', (req, res) => {     //Get all categories
    const query = 'SELECT * FROM category';
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving categories: ' + err.message);
            return;
        }
        res.send(results);
    });
});

router.get('/search', (req, res) => {      // Search based on organizer, city and category ID
    const organizer = req.query.organizer; // Get organizer
    const city = req.query.city;           // Get city
    const categoryId = req.query.categoryId; // Get ID
    let query = 'SELECT fundraiser.*, category.NAME as category_name FROM fundraiser INNER JOIN category ON fundraiser.CATEGORY_ID = category.CATEGORY_ID WHERE fundraiser.ACTIVE = 1';
    // Get the fundraiser and category name for the event as active
    let conditions = [];
    if (organizer) {       // If any parameter exists, add it to the query
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
    connection.query(query, (err, results) => {    // Perform database queries
        if (err) {
            console.error('Error retrieving fundraisers: ' + err.message);
            res.status(500).send('Error retrieving fundraisers.');
            return;
        }
        res.send(results);
    });
});

router.get('/fundraiser/:id', (req, res) => {     // Get fundraising information by ID
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

module.exports = router;   // Export the routing module