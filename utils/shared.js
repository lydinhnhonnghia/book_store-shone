const mongoose = require('mongoose');
const isEmpty = require('is-empty');
const isNumber = require('is-number');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const multer = require('multer');
const moment = require('moment');
require('moment/locale/vi');

const { log } = console;
const { messagesSuccess, messagesError } = require('../configs/messages');

class Shared {
    constructor() {
        this.isFileImage = this.isFileImage.bind(this);
        this.isFileExcel = this.isFileExcel.bind(this);
        this.fileFilterImage = this.fileFilterImage.bind(this);
        this.storage = this.storage.bind(this);
        this.convertStrToArr = this.convertStrToArr.bind(this);
        this.responseError = this.responseError.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.resizeImage = this.resizeImage.bind(this);
    }

    logError(message) {
        log(chalk.red(message));
    }

    logWarning(message) {
        log(chalk.yellowBright(message));
    }

    logSuccess(message) {
        log(chalk.greenBright(message));
    }

    logInfo(message) {
        log(chalk.rgb(113, 173, 221)(message));
    }

    generatorTime(format) {
        return moment().format(format);
    }

    isEmpty(value) { return isEmpty(value); }

    isNumber(value) { return isNumber(value); }

    isNumberInteger(val) { return Number.isInteger(val); }

    isMobilePhone(value) {
        if (!this.isNumber(value) || !this.isNumberInteger(value)) { return false; }
        value = String(value).replace('+', '');
        if (value.length < 9 || value.length > 13) { return false; }
        const fistNumber = value.substr(0, 2);
        const isMobile = /84|01|02|03|04|05|06|07|08|09/i;
        const checkTwoFirstNumber = isMobile.test(fistNumber);
        return checkTwoFirstNumber;
    }

    notSpaceAllow(value) { return /^\S*$/.test(value); }

    responseSuccess(statusCode, data) {
        const response = {
            success: true,
            statusCode,
            message: messagesSuccess[statusCode] || messagesSuccess[100],
        };
        if (data) {
            response.data = data;
        }
        return response;
    }

    responseError(statusCode, error) {
        const response = {
            success: false,
            statusCode,
            message: messagesError[statusCode] || messagesSuccess[1000],
        };
        if (error) {
            response.error = error;
        }

        return response;
    }

    compareValue(val1, val2) {
        if (!val1 && !val2) return true;
        return !!(val1 && val2 && String(val1) === String(val2));
    }

    isObjectId(val) { return mongoose.Types.ObjectId.isValid(val) && typeof val !== 'number'; }

    isFileImage(string) {
        return string.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/);
    }

    fileFilterImage(req, file, cb) {
        if (!this.isFileImage(file.originalname)) {
            return cb(this.responseError(1003));
        }
        return cb(null, true);
    }

    makeDir(file_path) {
        if (!fs.existsSync(file_path)) {
            fs.mkdirSync(file_path);
        }
    }

    isFileExcel(str) {
        return str.match(/\.(xlsx|xls)$/);
    }

    filterFileExcel(req, file, cb) {
        if (!this.isFileExcel(file.originalname)) {
            return cb({ StatusCode: 40017 });
        }
        return cb(null, true);
    }

    storage(showTime = false, ...folders_saved) {
        return multer.diskStorage({
            destination: (req, file, cb) => {
                this.makeDir(path.join(__dirname, '../public/uploads/'));
                const timeMoment = showTime ? this.generatorTime('YYYY_MM_DD HH_mm_ss') : '';
                let dir_path = path.join(__dirname, `../public/uploads/${timeMoment}`);
                this.makeDir(dir_path);
                let directory_folder = '';
                // eslint-disable-next-line array-callback-return
                folders_saved.map((folder) => {
                    directory_folder += `${folder}/`;
                    dir_path = path.join(__dirname, `../public/uploads/${timeMoment}/${directory_folder}`);
                    this.makeDir(dir_path);
                });
                cb(null, dir_path);
            },
            filename: (req, file, cb) => {
                const file_name = Date.now() + path.extname(file.originalname);
                cb(null, file_name);
            },
        });
    }

    uploadFile(storage, fileFilter, single_name) {
        return multer({
            storage, fileFilter,
        }).single(single_name);
    }

    uploadManyFile(storage, file_filter, name) {
        return multer({
            storage,
            fileFilter: file_filter,
        }).array(name);
    }

    uploadManyFields(storage, file_filter, fields) {
        return multer({
            storage,
            fileFilter: file_filter,
        }).fields(fields);
    }

    handleUpload(uploadFile) {
        return (req, res, next) => {
            uploadFile(req, res, (err) => {
                if (err) return res.json(this.responseError(1011, err));
                return next();
            });
        };
    }

    deleteFile(filePath) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    sliceString(string, str_start = '', str_end = '') {
        if (!str_start && !str_end) { return ''; }
        const start = string.search(str_start);
        const end = string.search(str_end);
        if (str_start && str_end && start > -1 && end > -1) {
            return string.slice(start, end);
        }
        if (str_start && start > -1) {
            return string.slice(start);
        }
        if (str_end && end > -1) {
            return string.slice(0, end);
        }
        return '';
    }

    getFullPath(file_path) {
        return path.join(__dirname, file_path);
    }

    isArray(value) {
        return Array.isArray(value);
    }

    convertStrToArr(value = '', charSplit = ',') {
        if (this.isArray(value)) {
            return value;
        }
        const arr = value.split(charSplit);
        return arr;
    }

    populateMongoose(fieldPath, select, match) {
        return { path: fieldPath, select, match };
    }

    joinPathFolderPublic(filePath) {
        return path.join(__dirname, `../public/${filePath}`);
    }

    cvtFirstLetterUpper(str) {
        return (str.replace(/\s\s+/g, ' ')).split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    resizeImage(fullUrlImage, fileName, width = 100, height = 100) {
        const set = {};
        const dirnameSaved = path.dirname(fullUrlImage);
        const extname = path.extname(fullUrlImage);
        const replacePath = fullUrlImage.split('\\').join('/');
        const filePathSaved = this.sliceString(replacePath, '/uploads');
        set.fullSizeImage = filePathSaved;
        fileName = fileName || path.parse(fullUrlImage).name + 1;
        const pathResizeSaved = `${dirnameSaved}\\${fileName}${extname}`;
        const urlResize = pathResizeSaved.split('\\').join('/');
        set.resizeImage = this.sliceString(urlResize, '/uploads');
        sharp(fullUrlImage)
            .resize(width, height)
            .toFile(pathResizeSaved, (err) => {
            // eslint-disable-next-line no-console
                if (err) { console.log(err); }
            });
        return set;
    }
}
const shaInstance = new Shared();
module.exports = shaInstance;
