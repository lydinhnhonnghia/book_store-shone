const winston = require('winston');
const path = require('path');

function logConfiguration(file_name = 'error') {
    return {
        transports: [
            new winston.transports.File({ filename: path.join(__dirname, `../logs/log/${file_name}.log`) }),
        ],
    };
}

function writeLog(file_name, error) {
    const logger = winston.createLogger(logConfiguration(file_name));
    logger.error(error);
}

module.exports.writeLog = writeLog;
