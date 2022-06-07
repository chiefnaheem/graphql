import {model, Schema} from 'mongoose';

const clientSchema = new Schema({
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
})
export const Client = model('Client', clientSchema);