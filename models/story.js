const { STORY_STATES } = require('../constants/constants');
const {
    Schema, ObjectId, mongoose, mongoose_paginate,
} = require('./_plugins');

const { optionsSchemaCommon, fieldsCommon } = require('./_stuffs');

const StorySchema = new Schema(
    {
        code: { type: String, required: true },
        name: { type: String, required: true },
        categoryOId: {
            type: ObjectId, ref: 'category', required: true, index: true,
        },
        authorOId: { type: ObjectId, ref: 'author' },
        ageLimitOId: { type: ObjectId, ref: 'age_limit' },
        profileImage: { type: String },
        source: { type: String },
        shortDescription: { type: String },
        description: { type: String },
        state: { type: String, default: STORY_STATES.FULL, enum: Object.values(STORY_STATES) },
        ...fieldsCommon(),
    },
    { ...optionsSchemaCommon({ collection: 'story' }), toJSON: { virtuals: true } },
);
StorySchema.plugin(mongoose_paginate);
StorySchema.index({
    code: 1, isDeleted: 1,
}, {
    unique: true,
    partialFilterExpression: {
        isDeleted: { $eq: true },
    },
});
StorySchema.virtual('author', {
    ref: 'author',
    localField: 'authorOId',
    foreignField: '_id',
    justOne: true,
});
StorySchema.virtual('category', {
    ref: 'category',
    localField: 'categoryOId',
    foreignField: '_id',
    justOne: true,
});
StorySchema.virtual('totalChapter', {
    ref: 'chapter',
    localField: '_id',
    foreignField: 'storyOId',
    count: true,
});
StorySchema.virtual('chapters', {
    ref: 'chapter',
    localField: '_id',
    foreignField: 'storyOId',
});
StorySchema.virtual('chapterNewest', {
    ref: 'chapter',
    localField: '_id',
    foreignField: 'storyOId',
    justOne: true,
});
StorySchema.virtual('chapter', {
    ref: 'chapter',
    localField: '_id',
    foreignField: 'storyOId',
    justOne: true,
});
StorySchema.virtual('bookmark', {
    ref: 'bookmark',
    localField: '_id',
    foreignField: 'storyOId',
    justOne: true,
});
const Story = mongoose.model('story', StorySchema);
module.exports = Story;
