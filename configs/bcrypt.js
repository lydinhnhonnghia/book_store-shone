const bcrypt = require('bcryptjs');

class Bcrypt {
    constructor() {
        this.SALT_ROUNDS = 9;
        this.hashPassword = this.hashPassword.bind(this);
        this.verifyPassword = this.verifyPassword.bind(this);
    }

    hashPassword(password) {
        return bcrypt.hashSync(password, this.SALT_ROUNDS);
    }

    verifyPassword(password, encrypted) {
        return bcrypt.compareSync(password, encrypted);
    }
}

module.exports = new Bcrypt();
