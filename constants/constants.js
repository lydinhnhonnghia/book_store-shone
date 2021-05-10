exports.PROD_ENV = process.env.NODE_ENV === 'production';
exports.STATUS = {
    Active: 'Active',
    Inactive: 'Inactive',
    New: 'New',
};

exports.ROLES = {
    ADMIN: 'ADMIN',
    MEMBER: 'MEMBER',
};

exports.STARTS = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

exports.TITLE_WEB_ADMIN = 'Quản lý hệ thống đọc truyện';
exports.TITLE_WEB_MEMBER = 'Đọc truyện trực tuyến theo cách của bạn';
exports.STORY_STATES = { FULL: 'FULL', NOT_FULL: 'NOT FULL' };
