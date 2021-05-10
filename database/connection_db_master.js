const mongoose = require('mongoose');
const {
    logError, logSuccess,
} = require('../utils/shared');

async function handle_connect(err) {
    if (err) logError('Connecting to Database failed!');
    else {
        logSuccess('Connecting to Database Master: success!');
    }
}
module.exports = async (uri) => {
    mongoose.connect(uri, {
        useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true,
    }, handle_connect);
};
