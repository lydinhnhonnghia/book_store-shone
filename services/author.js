const CrudService = require('./crud');
const { STATUS } = require('../constants/constants');
const {
    responseError, responseSuccess, isEmpty, compareValue, cvtFirstLetterUpper,
} = require('../utils/shared');

class AuthorService extends CrudService {
    constructor() {
        super();
    }

    async list(data) {
        try {
            const query = { isDeleted: false };
            const options = {
                limit: +data.limit || 10,
                page: +data.page || 1,
                sort: { [data.sortKey || '_id']: data.sortOrder || -1 },
                select: 'name description createdDate',
            };
            const result = await super.listWithPagination(query, options);
            if (!isEmpty(result)) return responseSuccess(202, result);
            return responseError(1008);
        } catch (error) {
            throw responseError(1000, error);
        }
    }

    async listActive(data) {
        try {
            const result = await super.listActive(data, '_id name');
            return responseSuccess(202, result);
        } catch (error) {
            throw responseError(1000, error);
        }
    }

    async findOne(data) {
        const conditions = {
            isDeleted: false,
        };
        if (data.name) conditions.name = cvtFirstLetterUpper(data.name);
        const result = await this.collectionCurrent().findOne(conditions).lean();
        return result;
    }

    async getInfo(data) {
        try {
            const conditions = {
                _id: data.authorOId,
                isDeleted: false,
            };
            const result = await super.getInfo(conditions);
            if (isEmpty(result)) return responseError(1010);
            return responseSuccess(204, result);
        } catch (error) {
            throw responseError(1000, error);
        }
    }

    async create(data) {
        try {
            const existName = await this.findOne({ name: cvtFirstLetterUpper(data.name) });
            if (existName) return responseError(1121);
            const set = {
                name: cvtFirstLetterUpper(data.name),
                description: data.description,
                createdBy: data.createdBy,
                status: STATUS.Active,
            };
            const result = await super.create(set);
            if (!isEmpty(result)) return responseSuccess(201);
            return responseError(1006);
        } catch (error) {
            throw responseError(1000, error);
        }
    }

    async updateOne(data) {
        try {
            const findName = await this.findOne(data);
            if (findName && !compareValue(findName._id, data.authorOId)) {
                return responseError(1121);
            }
            const conditions = {
                _id: data.authorOId,
                isDeleted: false,
            };
            const set = { };
            if ('name' in data) set.name = cvtFirstLetterUpper(data.name);
            if ('description' in data) set.description = data.description;
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
                _id: data.authorOId,
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

module.exports = new AuthorService();
