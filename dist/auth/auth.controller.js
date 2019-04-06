"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const uniqid = require("uniqid");
const mailer_controller_1 = require("../mailer/mailer.controller");
const user_1 = require("../models/user");
class AuthController {
    generateToken(user) {
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '60 days'
        });
        return {
            token,
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        };
    }
    getUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const decodedToken = jwt.decode(token);
                if (decodedToken !== null) {
                    const id = decodedToken._id;
                    user_1.default.findById(id, (err, user) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve({
                                user: {
                                    _id: user._id,
                                    email: user.email,
                                    firstName: user.firstName,
                                    lastName: user.lastName
                                }
                            });
                        }
                    });
                }
                else {
                    reject(new Error('Invalid token.'));
                }
            });
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                user_1.default.findOne({
                    email
                }, (err, user) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        reject(err);
                    }
                    else {
                        try {
                            const passMatch = yield user.comparePassword(password);
                            if (passMatch) {
                                const resp = this.generateToken(user);
                                resolve(resp);
                            }
                            else {
                                reject(new Error('Invalid credentials.'));
                            }
                        }
                        catch (error) {
                            reject(error);
                        }
                    }
                }));
            });
        });
    }
    signup(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const { email, password, firstName, lastName } = body;
                const verifyExp = new Date();
                verifyExp.setDate(verifyExp.getDate() + 1);
                const newUser = new user_1.default({
                    email,
                    password,
                    firstName,
                    lastName,
                    verified: false,
                    verifyCode: uniqid(),
                    verifyExp
                });
                newUser.save((err, user) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        const link = `${process.env.HOST_URL}/auth/verify/${user._id}/${user.verifyCode}`;
                        // TODO: Change emails
                        mailer_controller_1.default.sendEmail('no-reply@tsnode.com', user.email, 'Welcome', 'emails/signup.hbs', {
                            name: user.firstName,
                            link
                        })
                            .then(() => {
                            const resp = this.generateToken(user);
                            resolve(resp);
                        })
                            .catch(err => {
                            reject(err);
                        });
                    }
                });
            });
        });
    }
    resendVerification(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const decodedToken = jwt.decode(token);
                const id = decodedToken._id;
                user_1.default.findById(id, (err, user) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        const today = new Date();
                        user.verifyExp.setDate(today.getDate() + 1);
                        user.verifyCode = uniqid();
                        user.save((err, _) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                const link = `${process.env.HOST_URL}/auth/verify/${user._id}/${user.verifyCode}`;
                                // TODO: Change emails
                                mailer_controller_1.default.sendEmail('no-reply@tsnode.com', user.email, 'Verify Email', 'emails/signup.hbs', {
                                    name: user.firstName,
                                    link
                                })
                                    .then(() => {
                                    resolve(true);
                                })
                                    .catch(err => {
                                    reject(err);
                                });
                            }
                        });
                    }
                });
            });
        });
    }
    verify(id, verifyCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                user_1.default.findById(id, (err, user) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        const today = new Date();
                        if (user.verifyExp < today) {
                            resolve('Verification link expired.');
                        }
                        else {
                            if (user.verifyCode === verifyCode) {
                                user.verified = true;
                                user.verifyCode = undefined;
                                user.verifyExp = undefined;
                                user.save((err, _) => {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve(true);
                                    }
                                });
                            }
                            else {
                                resolve('Invalid verification link.');
                            }
                        }
                    }
                });
            });
        });
    }
}
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map