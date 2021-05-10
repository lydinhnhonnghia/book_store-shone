const CrudService = require('./crud');
const { STATUS } = require('../constants/constants');
const {
    responseError, responseSuccess, isEmpty, deleteFile, joinPathFolderPublic, resizeImage,
} = require('../utils/shared');

class InformationService extends CrudService {
    constructor() {
        super();
    }

    async findOne(data = {}) {
        const conditions = {
            isDeleted: false,
        };
        if (data.status) conditions.status = data.status;
        const result = await this.collectionCurrent().findOne(conditions).lean();
        return result;
    }

    async create(data) {
        try {
            const existInfo = await this.findOne();
            if (existInfo) return responseError(1151);
            const set = {
                description: data.description,
                status: STATUS.Active,
            };
            const newLogo = resizeImage(data.fullLogoUrl, 'logo');
            set.fullSizeLogo = newLogo.fullSizeImage;
            set.logo = newLogo.resizeImage;
            if ('email' in data) set.email = data.email;
            if ('mobile' in data) set.mobile = data.mobile;
            if ('facebookLink' in data) set.facebookLink = data.facebookLink;
            const result = await super.create(set);
            if (!isEmpty(result)) return responseSuccess(201);
            return responseError(1006);
        } catch (error) {
            throw responseError(1000, error);
        }
    }

    async updateOne(data) {
        try {
            const conditions = {
                _id: data.informationOId,
                isDeleted: false,
            };
            const set = {};
            const options = { new: true };
            if (data.fullLogoUrl) {
                options.new = false;
                const newLogo = resizeImage(data.fullLogoUrl, 'logo');
                set.fullSizeLogo = newLogo.fullSizeImage;
                set.logo = newLogo.resizeImage;
            }
            if ('description' in data) set.description = data.description;
            if ('email' in data) set.email = data.email;
            if ('mobile' in data) set.mobile = data.mobile;
            if ('facebookLink' in data) set.facebookLink = data.facebookLink;
            const result = await super.updateOne(conditions, set, options);
            if (isEmpty(result)) return responseError(1007);
            if (!options.new) {
                deleteFile(joinPathFolderPublic(result.fullSizeLogo));
            }
            return responseSuccess(203);
        } catch (error) {
            throw responseError(1000, error);
        }
    }

    async getInfo(data) {
        try {
            const conditions = {
                _id: data.infomationOId,
                isDeleted: false,
            };
            const fields = 'logo description email mobile facebookLink';
            const result = await super.getInfo(conditions, fields);
            if (isEmpty(result)) return responseError(1010);
            return responseSuccess(204);
        } catch (error) {
            throw responseError(1000, error);
        }
    }
}

module.exports = new InformationService();
