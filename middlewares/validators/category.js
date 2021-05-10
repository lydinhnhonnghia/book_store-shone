const {
    validateField, validateObjectId,
} = require('./_utils');

const savedValidator = {
    ...validateField('name', true),
    ...validateField('description', false),
};
const categoryOIdValidator = validateObjectId('categoryOId', true);

module.exports = {
    createValidator: savedValidator,
    categoryOIdValidator,
    updateValidator: { ...savedValidator, ...categoryOIdValidator },
};
