const storyCtl = require('../../../controllers/story');
const viewStatisticCtl = require('../../../controllers/viewStatistic');

module.exports = (router) => {
    router.get('/story/list-active', storyCtl.listActive);
    router.get('/story/:storyOId', storyCtl.viewInfoUser);
    router.get('/story/:storyOId/:chapterNumber', storyCtl.viewChapter);
    router.get('/chapter/list', storyCtl.listChapter);
    router.get('/view-statistic/list', viewStatisticCtl.listActive);
};
