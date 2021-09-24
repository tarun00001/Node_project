var mongoose = require('mongoose');
require('dotenv');

const DeviceSchema = mongoose.Schema({
    serialNo: {
        type: String,
        required: true,
        unique: true
    },
    manufactureDate: {
        type: Date
    },
    battery: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    reservoir: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    modelType: {
        type: String,
        required: true,
        enum: ['standard','pro'],
        default: 'standard'
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    }

    },{timestamps: true });

    module.exports = mongoose.model("Device", DeviceSchema);