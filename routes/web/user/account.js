const userCtl = require('../../../controllers/account');
const {
    createMiddleware,
    updateMiddleware,
    getInfoMiddleware,
    updateStatusMiddleware,
    deleteMiddleware,
} = require('../../../middlewares/account');
const {
    fileFilterImage, storage, handleUpload, uploadFile,
} = require('../../../utils/shared');

const uploadFileUser = uploadFile(storage('users'), fileFilterImage, 'image');

module.exports = (router) => {
    // router.post('/api/wb/user/list_all', user_con.listAll);
    // router.post('/api/wb/user/list', user_con.list);
    // router.post('/api/wb/user/create', handleUpload(uploadFileUser), createMiddleware, user_con.create);
    // router.post('/api/wb/user/get_info', getInfoMiddleware, user_con.getInfo);
    // // router.post('/api/wb/user/update', handleUpload(uploadFileUser), updateMiddleware, user_con.update);
};
