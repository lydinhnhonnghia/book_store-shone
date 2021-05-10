const { isObjectId, isMobilePhone, isEmpty } = require('../../utils/shared');
const { ROLES = [] } = require('../../constants/constants');

class Utils {
    validateObjectId(fieldName, required = false) {
        return {
            [fieldName]: {
                [required ? 'notEmpty' : 'optional']: true,
                custom: {
                    options: (value) => isObjectId(value),
                    errorMessage: `${fieldName} must is ObjectId`,
                },
                errorMessage: `${fieldName} không được để trống`,
            },
        };
    }

    validateStatus(required) {
        return {
            status: {
                [required ? 'notEmpty' : 'optional']: true,
                custom: {
                    options: (value) => [10, 20, 40].includes(+value),
                    errorMessage: `Trạng thái phải là một trong các giá trị [${[10, 20, 40]}]`,
                },
                errorMessage: 'Trạng thái không được trống',
            },
        };
    }

    validateEmail(required) {
        return {
            email: {
                [required ? 'notEmpty' : 'optional']: true,
                isEmail: true,
                errorMessage: 'Email không đúng định dạng',
            },
        };
    }

    validateMobile(required) {
        return {
            mobile: {
                [required ? 'notEmpty' : 'optional']: true,
                custom: {
                    options: (value) => isMobilePhone(value),
                    errorMessage: 'mobile incorrect',
                },
                errorMessage: 'Số điện thoại không được để trống',
            },
        };
    }

    validateField(fieldName, required, custom) {
        const objValidate = {
            [fieldName]: {
                [required ? 'notEmpty' : 'optional']: true,
                errorMessage: `${fieldName} không được để trống`,
            },
        };
        if (!isEmpty(custom)) {
            objValidate[fieldName].custom = custom;
        }
        return objValidate;
    }

    validateFieldWithMinLength(fieldName, minLength, required, custom) {
        const objValidate = {
            [fieldName]: {
                [required ? 'notEmpty' : 'optional']: true,
                isLength: {
                    options: { min: minLength },
                    errorMessage: `${fieldName} ít nhất phải ${minLength} ký tự`,
                },
                errorMessage: `${fieldName} không được để trống`,
            },
        };
        if (!isEmpty(custom)) {
            objValidate[fieldName].custom = custom;
        }
        return objValidate;
    }

    validateRole(required) {
        return {
            role: {
                [required ? 'notEmpty' : 'optional']: true,
                isInt: true,
                custom: {
                    options: (value) => ROLES.includes(+value),
                    errorMessage: `Vai tròng phải là giá trị trong [${ROLES}]`,
                },
                errorMessage: 'Vai trò không được để trống',
            },
        };
    }

    checkBodyValidator(req, validator) {
        req.checkBody(validator);
        const errors = req.validationErrors();
        return errors;
    }

    checkQueryValidator(req, validator) {
        req.checkQuery(validator);
        const errors = req.validationErrors();
        return errors;
    }
}

module.exports = new Utils();
