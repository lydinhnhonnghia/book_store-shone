module.exports = (router) => {
    require('./user/index')(router);
    require('./admin/index')(router);
};
