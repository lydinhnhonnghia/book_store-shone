class Utils {
    constructor() {
        this.decoded = null;
    }

    static collectionName(value = '') {
        const className = value.split('Service')[0];
        let collectionName = '';
        for (let i = 0, leng = className.length; i < leng; i += 1) {
            const isUpper = className.charAt(i) === className.charAt(i).toUpperCase();
            if (isUpper && i > 0) {
                collectionName += `_${className.charAt(i)}`;
                continue;
            }
            collectionName += className.charAt(i);
        }
        return collectionName.toLocaleLowerCase();
    }

    static setDecoded(decoded) {
        Utils.decoded = decoded;
        return Utils.decoded;
    }

    static getDecoded() {
        return Utils.decoded;
    }
}
module.exports = Utils;
