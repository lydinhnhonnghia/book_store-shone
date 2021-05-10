const {
    Schema, mongoose, mongoose_paginate,
} = require('./_plugins');
const { fieldsCommon, optionsSchemaCommon } = require('./_stuffs');

const InformationSchema = new Schema(
    {
        logo: { type: String, required: true },
        fullSizeLogo: { type: String, required: true },
        email: { type: String },
        mobile: { type: String },
        facebookLink: { type: String },
        description: { type: String, required: true },
        ...fieldsCommon(),
    },
    { ...optionsSchemaCommon({ collection: 'information' }) },
);
InformationSchema.plugin(mongoose_paginate);
const Information = mongoose.model('information', InformationSchema);
module.exports = Information;
