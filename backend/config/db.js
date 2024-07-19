const { Pool } = require('pg');

const pool = new Pool({
    user: 'Johan',
    host: 'localhost',
    database: 'sismedico',
    password: 'ingenieroespe',
    port: 5432,
});

module.exports = pool;
