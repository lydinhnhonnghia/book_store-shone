const signInCtl = require('../../../controllers/signIn');
const validators = require('../../../middlewares/account');

module.exports = (router) => {
    router.get('/admin/sign-in', signInCtl.viewSignInAdmin);
    router.post('/admin/sign-in', validators.signInMiddleware, signInCtl.signInAdmin);
    router.get('/admin/logout', signInCtl.logoutAdmin);
};
