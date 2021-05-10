const {
    Schema, ObjectId, mongoose, mongoose_paginate,
} = require('./_plugins');
const { fieldsCommon, optionsSchemaCommon } = require('./_stuffs');

const CommentReplySchema = new Schema(
    {
        commentOId: { type: ObjectId, ref: 'comment', required: true },
        accountOId: { type: ObjectId, ref: 'account', required: true },
        content: { type: String },
        ...fieldsCommon({ status: false }),
    },
    { ...optionsSchemaCommon({ collection: 'comment_reply' }) },
);
CommentReplySchema.plugin(mongoose_paginate);
const CommentReply = mongoose.model('comment_reply', CommentReplySchema);
module.exports = CommentReply;
