const dbDetails = require("./db_details");         
const mysql = require('mysql2');

module.exports = {
    getConnection:()=>{
        return mysql.createConnection({     
            host:dbDetails.host,
            user:dbDetails.user,
            password:dbDetails.password,
            database:dbDetails.database
    });
    }
}