// Define Database connection-details inside a 'dev.env' file
const mysql = require("mysql");

const pEnv = process.env;

const connection = mysql.createConnection({
    host: pEnv.DB_HOST,
    user: pEnv.MYSQL_USER,
    database: pEnv.MYSQL_DATABASE,
    password: pEnv.MYSQL_PASSWORD,
});

connection.connect();
module.exports = connection;