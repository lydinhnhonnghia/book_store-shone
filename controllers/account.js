const BaseController = require('./base');
const accountService = require('../services/account');
// const gTTS = require('gtts'); 
      
// var speech = '<p>Đẳng cấp của tiền đạo người Uruguay sẽ giúp Quỷ đỏ nâng cấp hàng công. Với cựu cầu thủ PSG, đội chủ sân Old Trafford sẽ "thiên biến vạn hóa" tuyến đầu của mình.</p>'; 
// var gtts = new gTTS(speech, 'vi'); 
  
// gtts.save('Voice.mp3', function (err, result){ 
//     if(err) { throw new Error(err); } 
//     console.log("Text to speech converted!"); 
// }); 

class AccountController extends BaseController {
    constructor() {
        super();
    }

    async viewAdmin(req, res) {
        try {
            return super.renderPageAdmin(req, res, { path: 'account/admin' });
        } catch (error) {
            return super.resJsonError(res, error, 'account');
        }
    }

    async viewMember(req, res) {
        try {
            return super.renderPageAdmin(req, res, { path: 'account/member' });
        } catch (error) {
            return super.resJsonError(res, error, 'account');
        }
    }

    async list(req, res) {
        try {
            const result = await accountService.list(req.query);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'account');
        }
    }

    async createAdmin(req, res) {
        try {
            const result = await accountService.createAdmin(req.body);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'account');
        }
    }

    async update(req, res) {
        try {
            const result = await accountService.updateOne(req.body);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'account');
        }
    }

    async delete(req, res) {
        try {
            const result = await accountService.deleteOne(req.body);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'account');
        }
    }

    async getInfo(req, res) {
        try {
            const result = await accountService.getInfo(req.query);
            return super.resJsonSuccess(res, result);
        } catch (error) {
            return super.resJsonError(res, error, 'account');
        }
    }
}
module.exports = new AccountController();
