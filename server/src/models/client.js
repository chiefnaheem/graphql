"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var mongoose_1 = require("mongoose");
var clientSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
    },
    phone: {
        type: String,
    }
});
exports.Client = (0, mongoose_1.model)('Client', clientSchema);
