import {model, Schema} from 'mongoose';

const projectSchema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive']
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    }
    
})
export const Project = model('Project', projectSchema);