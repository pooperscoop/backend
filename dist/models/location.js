"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.LocationSchema = new mongoose_1.Schema({
    submittedBy: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    coordinates: {
        longitude: {
            type: String,
            required: true
        },
        latitude: {
            type: String,
            required: true
        }
    },
    cityID: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Cities"
    }
}, {
    timestamps: true
});
const UserModel = mongoose_1.model("Locations", exports.LocationSchema);
exports.default = UserModel;
//# sourceMappingURL=location.js.map