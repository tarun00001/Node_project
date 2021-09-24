const mongoose = require('mongoose');
require('dotenv');


const ResourceSchema =new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    uniqueCode: {
        type: String,
        required: true,
        unique: true
    },
    modelType: [
        Object
    ],
    collectionName: {
        type: String,
        unique: true
    }
},{timestamps: true });

module.exports = mongoose.model("Resource", ResourceSchema);