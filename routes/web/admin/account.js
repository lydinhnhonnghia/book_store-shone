const accountCtl = require('../../../controllers/account');
const validators = require('../../../middlewares/account');
// const {
//     fileFilterImage, storage, handleUpload, uploadFile,
// } = require('../../../utils/shared');

// const uploadFileUser = uploadFile(storage('users'), fileFilterImage, 'image');

module.exports = (router) => {
    router.get('/admin/account/admin', accountCtl.viewAdmin);
    router.get('/admin/account/member', accountCtl.viewMember);
    router.get('/admin/account/list', accountCtl.list);
    router.post('/admin/account/create', validators.createAdminMiddleware, accountCtl.createAdmin);
    router.get('/admin/account/info', validators.checkQueOIdMiddleware, accountCtl.getInfo);
    router.post('/admin/account/update', validators.updateAdminMiddleware, accountCtl.update);
    router.post('/admin/account/delete', validators.checkOIdMiddleware, accountCtl.delete);
};
