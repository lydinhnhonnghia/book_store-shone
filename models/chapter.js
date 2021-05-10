const {
    Schema, mongoose, mongoose_paginate, ObjectId,
} = require('./_plugins');
const { optionsSchemaCommon, fieldsCommon } = require('./_stuffs');

const ChapterSchema = new Schema(
    {
        chapterNumber: { type: Number, required: true },
        title: { type: String, required: true },
        content: { type: String, required: true },
        wordCount: { type: Number },
        storyOId: {
            type: ObjectId, ref: 'story', required: true, index: true,
        },
        ...fieldsCommon({
            createdAt: false, createdBy: false, status: false, updatedAt: false, updatedBy: false,
        }),
    },
    { ...optionsSchemaCommon({ collection: 'chapter' }) },
);
ChapterSchema.plugin(mongoose_paginate);
ChapterSchema.virtual('story', {
    ref: 'story',
    localField: 'storyOId',
    foreignField: '_id',
    justOne: true,
});
const Chapter = mongoose.model('chapter', ChapterSchema);
module.exports = Chapter;
