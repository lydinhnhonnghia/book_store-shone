const utils = require('../utils/utils');

class BaseService {
    constructor() {
        this.collectionName = utils.collectionName(this.constructor.name);
    }

    me() {
        return this.constructor.name;
    }

    promise(_promise) {
        return Promise.resolve(_promise).then((res) => res).catch((err) => { throw err; });
    }
}
module.exports = BaseService;
