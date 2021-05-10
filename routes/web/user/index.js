const JWT = require('../../../configs/jwt');

module.exports = (router) => {
    require('./signIn')(router);
    router.use(async (req, res, next) => {
        try {
            const tokenMember = req.cookies._tk_;
            req.session.pathCurrent = req.url;
            const infoMember = {};
            if (tokenMember) {
                const decodeInfoMember = await JWT.verifyMember(tokenMember);
                if (decodeInfoMember) {
                    infoMember.isLoggedIn = true;
                    infoMember.accountOId = decodeInfoMember.accountOId;
                    infoMember.username = decodeInfoMember.username;
                    infoMember.firstname = decodeInfoMember.firstname;
                    infoMember.lastname = decodeInfoMember.lastname;
                }
            }
            req.session.infoMember = infoMember;
            return next();
        } catch (error) {
            return next();
        }
    });
    require('./account')(router);
    require('./home')(router);
    require('./story')(router);
    require('./bookmark')(router);
};
