const {
    Schema, ObjectId, mongoose, mongoose_paginate,
} = require('./_plugins');
const { fieldsCommon, optionsSchemaCommon } = require('./_stuffs');

const ViewStatisticSchema = new Schema(
    {
        storyOId: {
            type: ObjectId, required: true, ref: 'story', unique: true,
        },
        count: { type: Number, default: 0, required: true },
        ...fieldsCommon({ updatedBy: false, createdBy: false }),
    },
    { ...optionsSchemaCommon({ collection: 'view_statistic' }), toJSON: { virtuals: true }, toObject: { virtuals: true } },
);
ViewStatisticSchema.plugin(mongoose_paginate);
ViewStatisticSchema.virtual('story', {
    ref: 'story',
    localField: 'storyOId',
    foreignField: '_id',
    justOne: true,
});
const ViewStatistic = mongoose.model('view_statistic', ViewStatisticSchema);
module.exports = ViewStatistic;
