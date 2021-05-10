const { Schema, mongoose, mongoose_paginate } = require('./_plugins');
const { optionsSchemaCommon, fieldsCommon } = require('./_stuffs');
const { ROLES } = require('../constants/constants');
const { hashPassword, verifyPassword } = require('../configs/bcrypt');

const AccountSchema = new Schema(
    {
        username: { type: String, required: true },
        firstname: { type: String, index: true },
        lastname: { type: String, index: true },
        avatar: { type: String },
        email: { type: String },
        mobile: { type: String },
        roleType: { type: String, enum: Object.values(ROLES), required: true },
        password: { type: String, required: true },
        birthday: { type: Date },
        ...fieldsCommon({ createdBy: false, updatedBy: false }),
    },
    { ...optionsSchemaCommon({ collection: 'account' }) },
);
AccountSchema.plugin(mongoose_paginate);
AccountSchema.pre(['save', 'findOneAndUpdate'], function (next) {
    const { password } = this;
    if (password) {
        this.password = hashPassword(password);
    }
    next();
});

AccountSchema.method('verifyPassword', function (password) {
    return verifyPassword(password, this.password);
});
AccountSchema.index({
    username: 1, isDeleted: 1, roleType: 1,
}, {
    unique: true,
    partialFilterExpression: {
        isDeleted: { $eq: true },
    },
});
const Account = mongoose.model('account', AccountSchema);
module.exports = Account;
