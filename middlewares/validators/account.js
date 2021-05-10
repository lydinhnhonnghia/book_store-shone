const { notSpaceAllow } = require('../../utils/shared');
const {
    // validateEmail,
    // validateMobile,
    validateField, validateFieldWithMinLength, validateObjectId,
} = require('./_utils');

// const email = validateEmail(true);
const username = validateFieldWithMinLength('username', 5, true, {
    options: (val) => notSpaceAllow(val),
    errorMessage: 'username mustn\'t have space',
});
const firstname = validateField('firstname', true);
const lastname = validateField('lastname', true);
const mobile = validateField('mobile', false);
const email = validateField('email', false);
const password = validateFieldWithMinLength('password', 8, true);
const confirmPassword = validateField('confirmPassword', true);

const signInValidator = {
    ...validateField('username', true),
    ...validateField('password', true),
};
const accountOIdValidator = validateObjectId('accountOId', true);
// const sign_in_with_social_validator = {
//     ...validateField('fullname', true),
//     ...validateEmail(false),
//     ...validateMobile(false),
// };
const savedValidator = {
    ...username, ...firstname, ...lastname, ...mobile, ...email,
};
const registerValidator = {
    ...savedValidator, ...password, ...confirmPassword,
};

const createAdminValidator = {
    ...savedValidator, ...password, ...confirmPassword,
};

module.exports = {
    signInValidator,
    registerValidator,
    createAdminValidator,
    accountOIdValidator,
    updateAdminValidator: { ...savedValidator, ...accountOIdValidator },
};
