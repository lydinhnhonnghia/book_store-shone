/* eslint-disable class-methods-use-this */

const { STATUS } = require('../constants/constants');
const { generatorTime } = require('../utils/shared');
const { ObjectId } = require('./_plugins');

class Utils {
    optionsSchemaCommon({ collection }) {
        return {
            _id: true, id: false, collection, versionKey: false,
        };
    }

    fieldsCommon({
        status = true,
        isDeleted = true,
        createdAt = true,
        updatedAt = true,
        createdBy = true,
        updatedBy = true,
    } = {}) {
        const fields = {};
        status && (fields.status = {
            type: String, required: true, enum: Object.values(STATUS), index: true, default: STATUS.New,
        });
        isDeleted && (fields.isDeleted = { type: Boolean, required: true, default: false });
        createdAt && (fields.createdAt = { type: Date, default: generatorTime });
        updatedAt && (fields.updatedAt = { type: Date });
        createdBy && (fields.createdBy = { type: ObjectId, ref: 'account', required: true });
        updatedBy && (fields.updatedBy = { type: ObjectId, ref: 'account' });
        return fields;
    }
}

module.exports = new Utils();
