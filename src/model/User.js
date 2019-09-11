const mongoose = require('../database');

const UserSchema = mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        unique:true,
        require:true,
        lowercase:true
    },
    password:{
        type: String ,
        require: true ,
        select: false ,
    },
    createdAt:{
        type:Date,
        default: Date.now
    }

});

const user = mongoose.model('User',UserSchema);