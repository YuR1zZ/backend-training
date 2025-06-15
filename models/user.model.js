import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required : [true , 'User Name is Required'],
        trim:true,
        minlength:2,
        maxlength:50,
    },
    email:{
        type: String,
        required : [true , 'User Name is Required'],
        unique:true,
        trim:true,
        lowercase:true,
        minlength:2,
        maxlength:50,
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ , 'Please enter a valid email address'],
    },
    password: {
        type:String,
        required: [true , 'User Password is required'],
        trim : true,
        minlength: 6,
    },

}, {timestamps: true});
const User = mongoose.model('User', userSchema);
export default User;