const {
    Schema, ObjectId, mongoose, mongoose_paginate,
} = require('./_plugins');
const { fieldsCommon, optionsSchemaCommon } = require('./_stuffs');

const ViewStatisticDetailSchema = new Schema(
    {
        viewStatisticOId: {
            type: ObjectId, required: true, ref: 'story', unique: true,
        },
        accountOIds: [
            {
                accountOId: { type: ObjectId, ref: 'account' },
                count: { type: Number },
            },
        ],
        locationIPs: [
            {
                locationIP: { type: String },
                count: { type: Number },
            },
        ],
        ...fieldsCommon({
            updatedBy: false, createdBy: false, status: false, createdAt: false, isDeleted: false, updatedAt: false,
        }),
    },
    { ...optionsSchemaCommon({ collection: 'view_statistic_detail' }) },
);
ViewStatisticDetailSchema.plugin(mongoose_paginate);
const ViewStatisticDetail = mongoose.model('view_statistic_detail', ViewStatisticDetailSchema);
module.exports = ViewStatisticDetail;
