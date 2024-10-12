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
    const query = 'SELECT fundraiser.*, category.NAME AS category_name FROM fundraiser INNER JOIN category ON fundraiser.CATEGORY_ID = category.CATEGORY_ID';
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
    const query = `SELECT f.*, c.NAME AS category_name, 
                    GROUP_CONCAT(d.DONATION_ID SEPARATOR ',') AS donation_ids,
                     GROUP_CONCAT(d.DATE SEPARATOR ',') AS donation_dates,
                    GROUP_CONCAT(d.AMOUNT SEPARATOR ',') AS donation_amounts,
                    GROUP_CONCAT(d.GIVER SEPARATOR ',') AS donation_givers
                    FROM fundraiser f
                    INNER JOIN category c ON f.CATEGORY_ID = c.CATEGORY_ID
                    LEFT JOIN DONATION d ON f.FUNDRAISER_ID = d.FUNDRAISER_ID
                    WHERE f.FUNDRAISER_ID =?
                    GROUP BY f.FUNDRAISER_ID;`;
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

router.post('/donation', (req, res) => {
    const { date, amount, giver, fundraiserId } = req.body;
    const query = 'INSERT INTO DONATION (date, amount, GIVER, FUNDRAISER_ID) VALUES (?,?,?,?)';
    connection.query(query, [date, amount, giver, fundraiserId], (err, results) => {
        if (err) {
            res.status(500).send('Error inserting donation: ' + err.message);
            return;
        }
        res.send('Donation inserted successfully');
    });
});

router.post('/updateFundraiser', async (req, res) => {
    try {
        const { organizer, caption, targetFunding, currentFunding, city, active, categoryId } = req.body;
        const query = 'INSERT INTO fundraiser ( ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID) VALUES (?,?,?,?,?,?,?)';
        connection.query(query, [ organizer, caption, targetFunding, currentFunding, city, active, categoryId], (err, results) => {
            if (err) {
                res.status(500).send('Error inserting fundraiser: ' + err.message);
                return;
            }
            res.send('Fundraiser inserted successfully');
        });
    } catch (error) {
        res.status(500).send('Error inserting fundraiser: ' + error.message);
    }
});

router.put('/updateFundraiser/:id', (req, res) => {
    const fundraiserId = req.params.id;
    const { caption, organizer, targetFunding, currentFunding, city, categoryId } = req.body;
    const query = 'UPDATE fundraiser SET CAPTION =?, ORGANIZER =?, TARGET_FUNDING =?, CURRENT_FUNDING =?, CITY =?, CATEGORY_ID =? WHERE FUNDRAISER_ID =?';
    connection.query(query, [caption, organizer, targetFunding, currentFunding, city, categoryId, fundraiserId], (err) => {
        if (err) {
            res.status(500).send('Error updating fundraiser: ' + err.message);
            return;
        }
        res.send('Fundraiser updated successfully');
    });
});

router.delete('/deleteFundraiser/:id', (req, res) => {
    const fundraiserId = req.params.id;
    const checkQuery = 'SELECT COUNT(*) AS donationCount FROM DONATION WHERE FUNDRAISER_ID =?';
    connection.query(checkQuery, [fundraiserId], (err, results) => {
        if (err) {
            res.status(500).send('Error checking donations: ' + err.message);
            return;
        }
        const donationCount = results[0].donationCount;
        if (donationCount > 0) {
            res.status(400).send('Cannot delete fundraiser with donations.');
            return;
        }
        const deleteQuery = 'DELETE FROM fundraiser WHERE FUNDRAISER_ID =?';
        connection.query(deleteQuery, [fundraiserId], (err) => {
            if (err) {
                res.status(500).send('Error deleting fundraiser: ' + err.message);
                return;
            }
            res.send('Fundraiser deleted successfully');
        });
    });
});

module.exports = router;   // Export the routing module