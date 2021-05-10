const { PROD_ENV } = require('../constants/constants');

let URI = '';

if (PROD_ENV) {
    URI = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
} else {
    URI = 'mongodb://localhost:27017/book_store';
}

require('./connection_db_master')(URI);
