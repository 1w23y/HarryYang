const dbDetails = require("./db_details");  // Import the database configuration file
const mysql = require('mysql2');      // Import the MySQL2 library

module.exports = {     //Connect to database
    getConnection: () => {
        return mysql.createConnection({
            host: dbDetails.host,
            user: dbDetails.user,
            password: dbDetails.password,
            database: dbDetails.database
        });
    }
};