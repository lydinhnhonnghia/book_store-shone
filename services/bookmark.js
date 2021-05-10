const CrudService = require('./crud');
const { STATUS } = require('../constants/constants');
const {
    responseError, responseSuccess, isEmpty,
} = require('../utils/shared');

class BookmarkService extends CrudService {
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
                select: 'name description status createdAt',
            };
            const result = await super.listWithPagination(query, options);
            if (!isEmpty(result)) return responseSuccess(202, result);
            return responseError(1008);
        } catch (error) {
            throw responseError(1000, error);
        }
    }

    async findOne(data) {
        const conditions = {
            isDeleted: false,
        };
        if (data.accountOId) conditions.accountOId = data.accountOId;
        if (data.storyOId) conditions.storyOId = data.storyOId;
        const result = await this.collectionCurrent().findOne(conditions).lean();
        return result;
    }

    async create(data) {
        try {
            const existBMforStory = await this.findOne({
                accountOId: data.accountOId,
                storyOId: data.storyOId,
            });

            if (existBMforStory) {
                if ([STATUS.Active, STATUS.Inactive].includes(data.status) && data.status === existBMforStory.status) {
                    return responseError(1161);
                }
                const conditions = {
                    _id: existBMforStory._id,
                };
                const set = {
                    status: data.status,
                };
                if ('chapterOId' in data) set.chapterOId = data.chapterOId;
                const result = await super.updateOne(conditions, set);
                if (!isEmpty(result)) return responseSuccess(203);
                return responseError(1007);
            }
            const set = {
                accountOId: data.accountOId,
                storyOId: data.storyOId,
                status: STATUS.Active,
            };
            if ('chapterOId' in data) set.chapterOId = data.chapterOId;
            const result = await super.create(set);
            if (!isEmpty(result)) return responseSuccess(201);
            return responseError(1006);
        } catch (error) {
            throw responseError(1000, error);
        }
    }

    async listActive(data) {
        try {
            const options = {};
            if (data.sortKey || data.sortOrder) {
                options.sort = {
                    [data.sortKey || '_id']: +data.sortOrder || -1,
                };
                delete data.sortKey;
                delete data.sortOrder;
            }
            if (data.limit) {
                options.limit = data.limit;
                delete data.limit;
            }
            const fields = '_id accountOId storyOId';
            const populate = [
                {
                    ...this.populateModel('story', '_id name profileImage'),
                    populate: this.populateModel('chapter', '_id chapterNumber title'),
                },
                this.populateModel('chapter', '_id title chapterNumber'),
            ];
            const result = await super.listActive(data, fields, populate, options);
            return responseSuccess(202, result);
        } catch (error) {
            throw responseError(1000, error);
        }
    }
}

module.exports = new BookmarkService();
