const BaseController = require('./base');
const storyService = require('../services/story');
const chapterService = require('../services/chapter');
const bookmarkService = require('../services/bookmark');
const viewStatisticService = require('../services/viewStatistic');
const { isEmpty } = require('../utils/shared');
const { STATUS } = require('../constants/constants');

class StoryController extends BaseController {
    constructor() {
        super();
    }

    async view(req, res) {
        try {
            return super.renderPageAdmin(req, res, { path: 'story/index' });
        } catch (error) {
            return super.resJsonError(res, error, 'story');
        }
    }

    async viewChaptersOfStory(req, res) {
        try {
            const { storyOId } = req.params;
            const infoStory = await storyService.findOne({ storyOId, usePopulate: true });
            if (isEmpty(infoStory)) return super.renderPage404(res);
            return super.renderPageAdmin(req, res, {
                path: 'story/chapters',
                story: JSON.stringify({
                    storyOId,
                    name: infoStory.name,
                    code: infoStory.code,
                    authorName: (infoStory.author || {}).name || '',
                    categoryName: (infoStory.category || {}).name || '',
                }),
            });
        } catch (error) {
            return super.resJsonError(res, error, 'story');
        }
    }

    async create(req, res) {
        try {
            const result = await storyService.create(req.body);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'story');
        }
    }

    async createChapter(req, res) {
        try {
            const result = await chapterService.create(req.body);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'story');
        }
    }

    async updateChapter(req, res) {
        try {
            const result = await chapterService.updateOne(req.body);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'story');
        }
    }

    async listChapter(req, res) {
        try {
            const result = await chapterService.list(req.query);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'story');
        }
    }

    async list(req, res) {
        try {
            const result = await storyService.list(req.query);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'story');
        }
    }

    async getInfo(req, res) {
        try {
            const result = await storyService.getInfo(req.query);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'story');
        }
    }

    async update(req, res) {
        try {
            const result = await storyService.updateOne(req.body);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'story');
        }
    }

    async delete(req, res) {
        try {
            const result = await storyService.deleteOne(req.body);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'story');
        }
    }

    async deleteChapter(req, res) {
        try {
            const result = await chapterService.deleteOne(req.body);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'story');
        }
    }

    async getInfoChapter(req, res) {
        try {
            const result = await chapterService.getInfo(req.query);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'story');
        }
    }

    async viewInfoUser(req, res) {
        try {
            const { storyOId } = req.params;
            if (!storyOId) return super.renderPage404(res);
            const infoStory = await storyService.findOne({
                _id: storyOId,
                status: STATUS.Active,
                usePopulate: true,
            });
            if (!infoStory) return super.renderPage404(res);
            viewStatisticService.create({ storyOId });
            const data = {
                authorName: (infoStory.author || {}).name || '',
                categoryName: (infoStory.category || {}).name || '',
                name: infoStory.name,
                code: infoStory.code,
                profileImage: infoStory.profileImage,
                description: infoStory.description,
            };
            const { infoMember } = req.session;
            if (!isEmpty(infoMember)) {
                const findBookmark = await bookmarkService.findOne({
                    accountOId: infoMember.accountOId,
                    storyOId,
                });
                data.bookmarked = !!(findBookmark && findBookmark.status === STATUS.Active);
            }
            return super.renderPageUser(req, res, {
                path: 'story/info',
                infoStory: data,
                storyOId,
            });
        } catch (error) {
            return super.resJsonError(res, error, 'story');
        }
    }

    async viewChapter(req, res) {
        try {
            const infoChapter = await chapterService.findOne({
                storyOId: req.params.storyOId,
                chapterNumber: +req.params.chapterNumber,
                usePopulate: true,
            });
            if (!infoChapter) return super.renderPage404(res);
            const infoFirstChapter = await chapterService.findOne({
                storyOId: req.params.storyOId,
                sort: { chapterNumber: 1 },
            });
            const infoLastChapter = await chapterService.findOne({
                storyOId: req.params.storyOId,
                sort: { chapterNumber: -1 },
            });
            return super.renderPageUser(req, res, {
                path: 'story/chapter',
                infoChapter: {
                    isNotFirstChapter: infoChapter.chapterNumber > infoFirstChapter.chapterNumber,
                    isNotLastChapter: infoChapter.chapterNumber < infoLastChapter.chapterNumber,
                    content: infoChapter.content,
                    chapterNumber: infoChapter.chapterNumber,
                    title: infoChapter.title,
                    storyOId: req.params.storyOId,
                    storyName: (infoChapter.story || {}).name || '',
                },
            });
        } catch (error) {
            return super.resJsonError(res, error, 'story');
        }
    }

    async listActive(req, res) {
        try {
            const result = await storyService.listActive(req.query);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'story');
        }
    }

    async updateStatus(req, res) {
        try {
            const result = await storyService.updateStatus(req.body);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'story');
        }
    }
}
module.exports = new StoryController();
