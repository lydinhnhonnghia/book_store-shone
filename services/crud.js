const BaseService = require('./base');
const models = require('../models/_utils');
const { isEmpty, generatorTime } = require('../utils/shared');
const { getDecoded } = require('../utils/utils');
const { STATUS } = require('../constants/constants');

class CrudService extends BaseService {
    constructor() {
        super();
        this.accountCollection = models.AccountModel;
        this.authorCollection = models.AuthorModel;
        this.bookmarkCollection = models.BookmarkModel;
        this.categoryCollection = models.CategoryModel;
        this.chapterCollection = models.ChapterModel;
        this.comment_replyCollection = models.CommentReplyModel;
        this.commentCollection = models.CommentModel;
        this.historyCollection = models.HistoryModel;
        this.ratingCollection = models.RatingModel;
        this.storyCollection = models.StoryModel;
        this.view_statisticCollection = models.ViewStatisticModel;
        this.view_statistic_detailCollection = models.ViewStatisticDetailModel;
        this.informationCollection = models.InformationModel;
    }

    collectionCurrent() {
        const { collectionName } = this;
        return this[`${collectionName}Collection`];
    }

    listAll(query = {}, populate) {
        try {
            const { collectionName } = this;
            const promise = this[`${collectionName}Collection`].find(query).populate(populate);
            return this.promise(promise);
        } catch (error) {
            throw error;
        }
    }

    listActive(query = {}, fields, populate, options = {}) {
        try {
            const { collectionName } = this;
            Object.assign(query, { status: STATUS.Active, isDeleted: false });
            const promise = this[`${collectionName}Collection`].find(query);
            if (fields) promise.select(fields);
            if (populate) promise.populate(populate);
            if (options.limit) promise.limit(+options.limit);
            if (options.sort) promise.sort(options.sort);
            return this.promise(promise);
        } catch (error) {
            throw error;
        }
    }

    listWithPagination(query = {}, options = {}) {
        try {
            const defaul_options = {
                limit: 10,
                page: 1,
                sort: {
                    _id: -1,
                },
            };
            const options_ = !isEmpty(options) ? options : defaul_options;
            const { collectionName } = this;
            const promise = this[`${collectionName}Collection`].paginate(query, options_);
            return this.promise(promise);
        } catch (error) {
            throw error;
        }
    }

    create(data) {
        try {
            const { collectionName } = this;
            const decoded = getDecoded();
            if (decoded) {
                data.createdBy = decoded.accountOId;
            }
            const promise = this[`${collectionName}Collection`].create(data);
            return this.promise(promise);
        } catch (error) {
            throw error;
        }
    }

    updateOne(conditions, set, options = { new: true }) {
        try {
            const { collectionName } = this;
            const decoded = getDecoded();
            if (decoded) {
                set.updatedBy = decoded.accountOId;
            }
            set.updatedAt = generatorTime();
            const promise = this[`${collectionName}Collection`].findOneAndUpdate(conditions, set, options);
            return this.promise(promise);
        } catch (error) {
            throw error;
        }
    }

    getInfo(conditions, fields, populate) {
        try {
            const { collectionName } = this;
            const promise = this[`${collectionName}Collection`].findOne(conditions);
            if (fields) promise.select(fields);
            if (populate) promise.populate(populate);
            return this.promise(promise);
        } catch (error) {
            throw error;
        }
    }

    removeOne(conditions) {
        try {
            const { collectionName } = this;
            const promise = this[`${collectionName}Collection`].deleteOne(conditions);
            return this.promise(promise);
        } catch (error) {
            throw error;
        }
    }

    populateModel(path, select, match = {}, options = {}) {
        return {
            path, select, match: { isDeleted: false, ...match }, options,
        };
    }
}
module.exports = CrudService;
