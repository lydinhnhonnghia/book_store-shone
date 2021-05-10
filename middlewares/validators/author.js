const {
    validateField, validateObjectId,
} = require('./_utils');

const savedValidator = {
    ...validateField('name', true),
    ...validateField('description', false),
};
const authorOIdValidator = validateObjectId('authorOId', true);

module.exports = {
    createValidator: savedValidator,
    authorOIdValidator,
    updateValidator: { ...savedValidator, ...authorOIdValidator },
};
