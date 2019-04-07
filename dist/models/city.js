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
const mongoose_1 = require("mongoose");
exports.CitySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    locations: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Locations"
        }
    ],
    accepted: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Locations"
        }
    ]
}, {
    timestamps: true
});
exports.CitySchema.methods.removeLocation = function (id, from, to = null) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const newArray = this[from].filter((loc) => {
                return loc.toString() !== id;
            });
            this[from] = newArray;
            if (to !== null) {
                this[to].push(id);
            }
            resolve(true);
        }
        catch (error) {
            reject(error);
        }
    }));
};
const CityModel = mongoose_1.model("Cities", exports.CitySchema);
exports.default = CityModel;
//# sourceMappingURL=city.js.map