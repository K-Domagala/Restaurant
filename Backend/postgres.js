const { Client } = require('pg');
require('dotenv').config())

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: 'postgres',
    database: 'Restaurant'
});

client.connect();

module.exports = client