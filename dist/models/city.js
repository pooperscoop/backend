"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.LocationSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    locations: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Locations"
        }
    ]
}, {
    timestamps: true
});
const UserModel = mongoose_1.model("Cities", exports.LocationSchema);
exports.default = UserModel;
//# sourceMappingURL=city.js.map