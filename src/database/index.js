require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:false,
        useCreateIndex:true
    })

module.exports = mongoose






