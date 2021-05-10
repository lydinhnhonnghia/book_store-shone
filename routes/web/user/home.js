const homeCtl = require('../../../controllers/home');

module.exports = (router) => {
    router.get('/', homeCtl.view);
};
