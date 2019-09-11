require('dotenv').config();
const mongoose = require('mongoose');

mongoose.createConnection(`${process.env.DB_URL}/${process.env.DB_NAME}`,
    { useNewUrlParser: true });

mongoose.Promise = global.Promise;

module.exports = mongoose






