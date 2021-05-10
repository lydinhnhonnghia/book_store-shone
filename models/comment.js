const {
    Schema, ObjectId, mongoose, mongoose_paginate,
} = require('./_plugins');
const { fieldsCommon, optionsSchemaCommon } = require('./_stuffs');

const CommentSchema = new Schema(
    {
        storyOId: { type: ObjectId, ref: 'story', required: true },
        accountOId: { type: ObjectId, ref: 'account', required: true },
        content: { type: String },
        ...fieldsCommon({ status: false }),
    },
    { ...optionsSchemaCommon({ collection: 'comment' }) },
);
CommentSchema.plugin(mongoose_paginate);
const Comment = mongoose.model('comment', CommentSchema);
module.exports = Comment;
