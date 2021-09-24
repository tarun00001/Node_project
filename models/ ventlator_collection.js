
      const mongoose = require('mongoose');

const ventlator_collectionSchema =new mongoose.Schema({
  deviceId: {
      type: String,
      required: true
  },
  logMsg: {
      type: String,
      required: true
  },
  logGeneratedDate: {
    type: Date,
    required: true
  },
  logType: {
    type: String,
    enum: ['error','warn','debug','info']
},
  modelType: {
    type: String,
    enum: ["001","002"]
  }
 
},{timestamps: true });

module.exports = mongoose.model("ventlator_collection", ventlator_collectionSchema);