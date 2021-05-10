const CrudService = require('./crud');
const {
    responseError, responseSuccess, isEmpty,
} = require('../utils/shared');
const { STATUS } = require('../constants/constants');

class ViewStatisticService extends CrudService {
    constructor() {
        super();
    }

    async findOne(data) {
        const conditions = {
            isDeleted: false,
        };
        if (data.storyOId) conditions.storyOId = data.storyOId;
        const promise = this.collectionCurrent().findOne(conditions);
        const result = await promise.lean();
        return result;
    }

    async create(data) {
        try {
            const existStory = await this.findOne({
                storyOId: data.storyOId,
            });
            if (existStory) {
                const set = {
                    count: existStory.count + 1,
                };
                const result = await super.updateOne({ _id: existStory._id }, set);
                if (!isEmpty(result)) return responseSuccess(201);
                return responseError(1006);
            }
            const set = {
                storyOId: data.storyOId,
                count: 1,
                status: STATUS.Active,
            };
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
            const fields = '_id count storyOId';
            const populate = [];
            populate.push({
                ...this.populateModel('story', '_id name profileImage'),
                populate: this.populateModel('chapter', '_id chapterNumber title'),
            });
            delete data.fieldsSelected;
            const result = await super.listActive(data, fields, populate, options);
            return responseSuccess(202, result);
        } catch (error) {
            throw responseError(1000, error);
        }
    }
}

module.exports = new ViewStatisticService();
