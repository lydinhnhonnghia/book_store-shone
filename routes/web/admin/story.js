const storyCtl = require('../../../controllers/story');
const validator = require('../../../middlewares/story');
const {
    fileFilterImage, storage, handleUpload, uploadFile,
} = require('../../../utils/shared');
const saveFile = uploadFile(storage(false, 'story', 'image'), fileFilterImage, 'image');

module.exports = (router) => {
    router.get('/admin/story', storyCtl.view);
    router.get('/admin/story/list', storyCtl.list);
    router.get('/admin/story/info', validator.checkQueStoryOIdMiddleware, storyCtl.getInfo);
    router.post('/admin/story/create', handleUpload(saveFile), validator.createMiddleware, storyCtl.create);
    router.post('/admin/story/update', handleUpload(saveFile), validator.updateMiddleware, storyCtl.update);
    router.post('/admin/story/update-status', validator.updateStatusMiddleware, storyCtl.updateStatus);
    router.post('/admin/story/delete', validator.checkOIdMiddleware, storyCtl.delete);
    router.get('/admin/story/:storyOId/chapters', storyCtl.viewChaptersOfStory);
    router.get('/admin/chapter/list', validator.checkQueStoryOIdMiddleware, storyCtl.listChapter);
    router.post('/admin/chapter/create', validator.createChapterMiddleware, storyCtl.createChapter);
    router.get('/admin/chapter/info', validator.checkQueChapteOIdMiddleware, storyCtl.getInfoChapter);
    router.post('/admin/chapter/update', validator.updateChapterMiddleware, storyCtl.updateChapter);
    router.post('/admin/chapter/delete', validator.checkChapteOIdMiddleware, storyCtl.deleteChapter);
};
