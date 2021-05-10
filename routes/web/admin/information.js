const informationCtl = require('../../../controllers/information');
const validator = require('../../../middlewares/information');
const {
    fileFilterImage, storage, handleUpload, uploadFile,
} = require('../../../utils/shared');

const saveFile = uploadFile(storage(false, 'information', 'logo'), fileFilterImage, 'logo');

module.exports = (router) => {
    router.get('/admin/information', informationCtl.view);
    router.post('/admin/information/create', handleUpload(saveFile), validator.createMiddleware, informationCtl.create);
    router.post('/admin/information/update', handleUpload(saveFile), validator.updateMiddleware, informationCtl.update);
};
