const {
    Schema, ObjectId, mongoose, mongoose_paginate,
} = require('./_plugins');
const { STARTS } = require('../constants/constants');
const { fieldsCommon, optionsSchemaCommon } = require('./_stuffs');

const RatingSchema = new Schema(
    {
        storyOId: { type: ObjectId, required: true, ref: 'story' },
        accountOId: { type: ObjectId, ref: 'account', required: true },
        locationIP: { type: String },
        star: {
            type: Number, enum: STARTS, default: 0, required: true,
        },
        ...fieldsCommon({ updatedBy: false, createdBy: false }),
    },
    { ...optionsSchemaCommon({ collection: 'rating' }) },
);
RatingSchema.plugin(mongoose_paginate);
const Rating = mongoose.model('rating', RatingSchema);
module.exports = Rating;
