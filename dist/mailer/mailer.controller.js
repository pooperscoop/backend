"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
class Mailer {
    constructor() {
        this.mgAuth = {
            auth: {
                api_key: process.env.MAILGUN_API_KEY,
                domain: process.env.EMAIL_DOMAIN
            }
        };
        this.MailGunner = nodemailer_1.createTransport(mg(this.mgAuth));
    }
    sendEmail(from, to, subject, template, context = null) {
        return new Promise((resolve, reject) => {
            this.MailGunner.sendMail({
                from,
                to,
                subject,
                template: {
                    name: template,
                    engine: 'handlebars',
                    context
                }
            }, (err, info) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(info);
                }
            });
        });
    }
}
exports.default = new Mailer();
//# sourceMappingURL=mailer.controller.js.map