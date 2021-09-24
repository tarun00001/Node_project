var mongoose = require('mongoose');
require('dotenv');

const GlucoseSchema = mongoose.Schema({
    date: {
        type: Date
    },
    readingTime: {
        type: String,
        required: true
    },
    glucoseReading: {
        type: Number, 
        required: true,
    },
    readingType: {
        type: String,
        required: true,
        enum: ['0','1','2']
    },
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    },{timestamps: true });

    module.exports = mongoose.model("Glucose", GlucoseSchema);