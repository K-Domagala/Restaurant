const { Client } = require('pg');
require('dotenv').config()

var client = new Client({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    port: process.env.PG_PORT,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    ssl: true
});

client.connect();

module.exports = client