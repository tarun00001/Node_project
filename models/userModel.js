const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
require('dotenv');

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum : ['male','female','other']
    },
    country: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    paswordResetToken: String,
    paswordResetExpires: Date,
    
    phone: {
        type: String,
        minlength: 10,
        maxlength: 10,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    isActive: {
        type: Boolean,
        default: true,
        select: false
    },
    role: {
        type: String,
        enum : ['user','admin'],
        default: 'user'
    },
    devices: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Device'
    },
},
{timestamps: true });       

UserSchema.pre('save', async function(next){
    // console.log('hii from inside')
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
})

    UserSchema.methods.createPasswordResetToken = function () {
        const resetToken = crypto.randomBytes(32).toString('hex');

        this.paswordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

        // console.log({resetToken},this.paswordResetToken);

        this.paswordResetExpires = Date.now() + 5 * 60* 1000;

        return resetToken;
    }


module.exports = mongoose.model("User", UserSchema);