"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = require("bcrypt");
exports.UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: (email) => /^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g.test(email),
            message: 'Invalid email.'
        }
    },
    password: {
        type: String,
        min: [6, 'Password too short.'],
        max: [20, 'Password too long.'],
        required: true,
        validate: {
            validator: (password) => /([A-Z]+){1,}([a-z]+){1,}([0-9]+){1,}([?!@#$%^&*()_\-+=/\\.,<>;:'"]){1,}/g.test(password),
            message: 'Password must contain an uppercase letter, lowercase letter, a number, and a symbol.'
        }
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    },
    verifyCode: {
        type: String
    },
    verifyExp: {
        type: Date
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
});
exports.UserSchema.pre('save', function (next) {
    const now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    if (!this.isModified('password')) {
        next();
    }
    else {
        bcrypt_1.genSalt(10, (err, salt) => {
            if (err) {
                next();
            }
            bcrypt_1.hash(this.password, salt, (err, hash) => {
                if (err) {
                    next();
                }
                this.password = hash;
                next();
            });
        });
    }
});
exports.UserSchema.methods.comparePassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt_1.compare(password, this.password, (err, isMatch) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(isMatch);
            }
        });
    });
};
const UserModel = mongoose_1.model('User', exports.UserSchema);
exports.default = UserModel;
//# sourceMappingURL=user.js.map