const {
    Schema, mongoose, mongoose_paginate,
} = require('./_plugins');
const { optionsSchemaCommon, fieldsCommon } = require('./_stuffs');

const CategorySchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        ...fieldsCommon(),
    },
    { ...optionsSchemaCommon({ collection: 'category' }) },
);
CategorySchema.plugin(mongoose_paginate);
CategorySchema.index({
    name: 1, isDeleted: 1,
}, {
    unique: true,
    partialFilterExpression: {
        isDeleted: { $eq: true },
    },
});

const Category = mongoose.model('category', CategorySchema);
module.exports = Category;
