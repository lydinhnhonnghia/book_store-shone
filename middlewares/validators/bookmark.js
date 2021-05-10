const { STATUS } = require('../../constants/constants');
const {
    validateField, validateObjectId,
} = require('./_utils');

const savedValidator = {
    ...validateObjectId('accountOId', true),
    ...validateObjectId('storyOId', true),
    ...validateField('status', true, {
        options: (val) => [STATUS.Active, STATUS.Inactive].includes(val),
        errorMessage: `trạng thái phải là giá trị trong [${STATUS.Active}, ${STATUS.Inactive}]`,
    }),
};

module.exports = {
    createValidator: savedValidator,
};
