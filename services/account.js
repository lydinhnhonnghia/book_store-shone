const CrudService = require('./crud');
const configJWT = require('../configs/jwt');
const { STATUS, ROLES } = require('../constants/constants');
const {
    responseError, responseSuccess, isEmpty, compareValue,
    deleteFile,
} = require('../utils/shared');

class AccountService extends CrudService {
    constructor() {
        super();
    }

    async signInMember(data) {
        data.roleType = ROLES.MEMBER;
        return this.signIn(data);
    }

    async signInAdmin(data) {
        data.roleType = ROLES.ADMIN;
        return this.signIn(data);
    }

    async signIn(data) {
        try {
            const conditions = {
                username: data.username,
                roleType: data.roleType,
                isDeleted: false,
            };
            const account = await this.accountCollection.findOne(conditions);
            if (isEmpty(account)) return responseError(1065);
            if (!account.verifyPassword(data.password)) return responseError(1065);
            if (account.status === STATUS.New || account.status === STATUS.Inactive) return responseError(1065);

            const payload = {
                accountOId: account._id,
                username: account.username,
                firstname: account.firstname,
                lastname: account.lastname,
            };
            const payloadRefreshToken = { ...payload };
            const propSignJWT = data.roleType === ROLES.ADMIN ? 'signAdmin' : 'signMember';
            const token = await configJWT[propSignJWT]({ ...payload, roleType: account.roleType }, process.env.TOKEN_LIFE);
            const dataRefreshTk = await configJWT[propSignJWT](payloadRefreshToken, process.env.REFRESH_TOKEN_LIFE || '7 days');
            let result = {};
            if (propSignJWT === 'signMember') {
                result = {
                    infoToken: token,
                    refreshToken: dataRefreshTk.token,
                    ...payload,
                };
            } else {
                result = {
                    token,
                    refreshToken: dataRefreshTk,
                    ...payload,
                };
            }

            return responseSuccess(208, result);
        } catch (error) {
            const { name } = error;
            if (name === 'JsonWebTokenError') {
                throw responseError(1002, error);
            }
            throw responseError(1000, error);
        }
    }

    async register(data) {
        try {
            data.roleType = ROLES.MEMBER;
            const existUsername = await this.hasExistUsername(data);
            if (existUsername) return responseError(1052);
            const set = {
                username: data.username,
                password: data.password,
                firstname: data.firstname,
                lastname: data.lastname,
                status: STATUS.Active,
                roleType: ROLES.MEMBER,
            };
            const result = await super.create(set);
            if (!isEmpty(result)) return responseSuccess(209);
            return responseError(1062);
        } catch (error) {
            throw responseError(1000, error);
        }
    }

    async list(data) {
        try {
            const query = { isDeleted: false, roleType: data.roleType };
            const options = {
                limit: +data.limit || 10,
                page: +data.page || 1,
                sort: { [data.sortKey || '_id']: data.sortOrder || -1 },
                select: 'username firstname lastname createdAt status mobile email',
            };
            const result = await super.listWithPagination(query, options);
            if (!isEmpty(result)) {
                return responseSuccess(202, result);
            }
            return responseError(1051);
        } catch (error) {
            throw responseError(1000, error);
        }
    }

    async hasExistUsername(data) {
        try {
            const conditions = {
                username: data.username,
                roleType: data.roleType,
                isDeleted: false,
            };
            const result = await this.accountCollection.findOne(conditions);
            if (isEmpty(result)) return false;
            if (data.accountOId) {
                return !compareValue(result._id, data.accountOId);
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    deleteUrlImage(fullUrlImage) {
        if (fullUrlImage) deleteFile(fullUrlImage);
    }

    async createAdmin(data) {
        try {
            const existUsername = await this.hasExistUsername({ username: data.username, roleType: ROLES.ADMIN });
            if (existUsername) return responseError(1052);
            const set = {
                username: data.username,
                firstname: data.firstname,
                lastname: data.lastname,
                password: data.password,
                status: STATUS.Active,
                roleType: ROLES.ADMIN,
            };
            if ('email' in data) set.email = data.email;
            if ('mobile' in data) set.mobile = data.mobile;
            const result = await super.create(set);
            if (!isEmpty(result)) return responseSuccess(201);
            // this.deleteUrlImage(data.fullUrlImage);
            return responseError(1050);
        } catch (error) {
            // this.deleteUrlImage(data.fullUrlImage);
            throw responseError(1000, error);
        }
    }

    async getInfo(data) {
        try {
            const conditions = {
                _id: data.accountOId,
                isDeleted: false,
            };
            const fields = '_id username firstname lastname email mobile';
            const result = await super.getInfo(conditions, fields);
            if (isEmpty(result)) return responseError(1010);
            return responseSuccess(204, result);
        } catch (error) {
            throw responseError(1000, error);
        }
    }

    async updateOne(data) {
        try {
            const existUsername = await this.hasExistUsername({
                username: data.username, roleType: ROLES.ADMIN, accountOId: data.accountOId,
            });
            if (existUsername) return responseError(1052);
            const conditions = {
                _id: data.accountOId,
                isDeleted: false,
            };
            const set = { };
            if ('username' in data) set.username = data.username;
            if ('password' in data) set.password = data.password;
            if ('firstname' in data) set.firstname = data.firstname;
            if ('lastname' in data) set.lastname = data.lastname;
            if ('email' in data) set.email = data.email;
            if ('mobile' in data) set.mobile = data.mobile;
            const result = await super.updateOne(conditions, set);
            if (isEmpty(result)) return responseError(1007);
            return responseSuccess(203);
        } catch (error) {
            throw responseError(1000, error);
        }
    }

    async deleteOne(data) {
        try {
            const conditions = {
                _id: data.accountOId,
                isDeleted: false,
            };
            const set = {
                isDeleted: true,
            };
            const result = await super.updateOne(conditions, set);
            if (isEmpty(result)) return responseError(1009);
            return responseSuccess(205);
        } catch (error) {
            throw responseError(1000, error);
        }
    }
}

module.exports = new AccountService();
