module.exports = (router) => {
    require('./signIn')(router);
    require('../../guard/middleware')(router, 'verifyAdmin');
    require('./dashboard')(router);
    require('./account')(router);
    require('./category')(router);
    require('./author')(router);
    require('./story')(router);
    require('./information')(router);
};
