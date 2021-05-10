const BaseController = require('./base');
const accountService = require('../services/account');
const { TITLE_WEB_MEMBER, TITLE_WEB_ADMIN } = require('../constants/constants');
const configPasspost = require('../configs/passport');
const { responseError } = require('../utils/shared');

class SignInController extends BaseController {
    constructor() {
        super();
    }

    async viewSignInAdmin(req, res) {
        try {
            return res.render('admin/signInAdmin/index', {
                title: TITLE_WEB_ADMIN,
                layout: false,
            });
        } catch (error) {
            return super.resJsonError(res, error, 'account');
        }
    }

    async signInAdmin(req, res, next) {
        try {
            return configPasspost.authenticate('local', (err, result) => {
                if (err) return super.resJsonError(res, err, 'account');
                if (!result) return super.resJsonSuccess(res, responseError(1065));
                return req.logIn(result, (errLogin) => {
                    if (errLogin) {
                        return next(err);
                    }
                    return super.resJsonSuccess(res, result);
                });
            })(req, res, next);
        } catch (error) {
            return super.resJsonError(res, error, 'account');
        }
    }

    async viewSignInMember(req, res) {
        try {
            return res.render('user/signInMember/index', {
                title: TITLE_WEB_MEMBER,
                layout: false,
            });
        } catch (error) {
            return super.resJsonError(res, error, 'account');
        }
    }

    async signInMember(req, res) {
        try {
            const result = await accountService.signInMember(req.body);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'account');
        }
    }

    async signInWithSocial(req, res) {
        try {
            const result = await accountService.signInWithSocial(req.body);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'account');
        }
    }

    async register(req, res) {
        try {
            const result = await accountService.register(req.body);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'account');
        }
    }

    logoutAdmin(req, res) {
        req.logout();
        return res.redirect('/admin/sign-in');
    }

    logoutMember(req, res) {
        res.clearCookie('_tk_')
        return res.redirect(req.session.pathCurrent || '/');
    }
}

module.exports = new SignInController();
