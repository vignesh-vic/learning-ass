import mongoose from 'mongoose'
import bycrpt from 'bcryptjs'

 const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        unique:true,
        trim: true,
        minlength:[2, 'Name must be at least 2 characters long']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: 6
    },
    profileImage:{
        type: String,
        default:null,

    }
}, {
    timestamps: true
});


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }   
    const salt = await bycrpt.genSalt(10);
    this.password = await bycrpt.hash(this.password, salt);
    next();
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bycrpt.compare(enteredPassword, this.password);
}   

const User = mongoose.model('User', userSchema);

export default User;