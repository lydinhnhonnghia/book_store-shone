const {
    Schema, ObjectId, mongoose, mongoose_paginate,
} = require('./_plugins');
const { fieldsCommon, optionsSchemaCommon } = require('./_stuffs');

const HistorySchema = new Schema(
    {
        storyOId: { type: ObjectId, required: true, ref: 'story' },
        accountOId: { type: ObjectId, ref: 'account', required: true },
        ...fieldsCommon({ status: false }),
    },
    { ...optionsSchemaCommon({ collection: 'history' }) },
);
HistorySchema.plugin(mongoose_paginate);
const History = mongoose.model('history', HistorySchema);
module.exports = History;
