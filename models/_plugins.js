const mongoose = require('mongoose');
const mongoose_paginate = require('mongoose-paginate');

module.exports = {
    mongoose,
    mongoose_paginate,
    Schema: mongoose.Schema,
    ObjectId: mongoose.Schema.ObjectId,
};
