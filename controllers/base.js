/* eslint-disable no-underscore-dangle */
const path = require('path');
const {
    writeLog,
} = require('../logs/config_log');
const {
    generatorTime,
} = require('../utils/shared');
const {
    TITLE_WEB_ADMIN,
    TITLE_WEB_MEMBER,
    STATUS,
} = require('../constants/constants');
const informationService = require('../services/information');

class BaseController {
    resJsonSuccess(res, result = {}) {
        return res.json(result);
    }

    resJsonError(res, error = '', file_name) {
        const msg = `${generatorTime()}: ${JSON.stringify(error)}`;
        writeLog(file_name, msg);
        return res.json(error);
    }

    renderPageAdmin(req, res, params) {
        const commonProp = {
            title: TITLE_WEB_ADMIN,
            infoUser: {
                username: req.user.username,
                firstname: req.user.firstname,
                lastname: req.user.lastname,
            },
        };
        Object.assign(params, commonProp);
        return res.render(`admin/${params.path}`, params);
    }

    renderPage404(res) {
        return res.render('404', { layout: false });
    }

    async renderPageUser(req, res, params) {

        let infoWeb = await informationService.findOne({
            status: STATUS.Active,
        });
        if (infoWeb) {
            infoWeb = {
                logo: infoWeb.logo,
                facebookLink: infoWeb.facebookLink,
                email: infoWeb.email,
                description: infoWeb.description,
            };
        } else {
            infoWeb = {
                logo: '/assets/images/logo.jpg',
                facebookLink: 'https://facebook.com/truyencuaban',
                email: 'truyencuaban@gmail.com',
                description: 'Truyen là website đọc truyện convert online cập nhật liên tục và nhanh nhất các truyện tiên hiệp, kiếm hiệp, huyền ảo được các thành viên liên tục đóng góp rất nhiều truyện hay và nổi bật',
            };
        }
        const commonProp = {
            title: TITLE_WEB_MEMBER,
            layout: path.join(__dirname, '../views/user/layouts/main'),
            infoWeb,
            infoMember: req.session.infoMember,
        };
        Object.assign(params, commonProp);
        return res.render(`user/${params.path}`, params);
    }
}
module.exports = BaseController;
