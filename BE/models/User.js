import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';

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
        return 
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);  // ✅ Fix 2: Added missing `await`
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('User', userSchema);

export default User;