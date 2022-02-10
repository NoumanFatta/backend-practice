const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
})

// ==== Generating Token

userSchema.methods.generatToken = function () {
    const token = jwt.sign({ _id: this._id.toString() }, 'mynameisnoumanaminfattaandiam21yearsold')
    console.log(token);
}


// ==== Hashing Password Before Inserting into DataBase

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hashedPassword = await bcrypt.hash(this.password, 12)
        this.password = hashedPassword;
    }
    next();
});


const User = new mongoose.model('User', userSchema);

module.exports = User;