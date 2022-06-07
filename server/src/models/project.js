"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
var mongoose_1 = require("mongoose");
var projectSchema = new mongoose_1.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['Not started', 'In progress', 'Completed']
    },
    clientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Client'
    }
});
exports.Project = (0, mongoose_1.model)('Project', projectSchema);
