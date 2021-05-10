const jwt = require('jsonwebtoken');
const { ROLES } = require('../constants/constants');

class JWT {
    constructor() {
        this.secretMember = process.env.SECRET_TOKEN_MEMBER;
        this.secretAdmin = process.env.SECRET_TOKEN_ADMIN;
    }

    async signMember(payload = {}, expiresIn = '2h') {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, this.secretMember, { expiresIn, mutatePayload: true }, (err, token) => {
                if (err) throw reject(err);
                return resolve({
                    token,
                    iat: payload.iat * 1000,
                    exp: payload.exp * 1000,
                });
            });
        });
    }

    async signAdmin(payload = {}, expiresIn = '2h') {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, this.secretAdmin, { expiresIn, mutatePayload: true }, (err, token) => {
                if (err) throw reject(err);
                return resolve(token);
            });
        });
    }

    async verifyAdmin(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secretAdmin, (err, decoded) => {
                if (err) return reject(err);
                if (decoded.roleType !== ROLES.ADMIN) return reject(new Error('JsonWebTokenError'));
                return resolve(decoded);
            });
        });
    }

    async verifyMember(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secretMember, (err, decoded) => {
                if (err) return null;
                return resolve(decoded);
            });
        });
    }
}

const ins = new JWT();
module.exports = ins;
