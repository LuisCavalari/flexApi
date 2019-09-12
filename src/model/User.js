const mongoose = require('../database');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
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
UserSchema.pre('save',async function(next){
    const hash = await bcrypt.hash(this.password,10);
    this.password = hash;
})

const user = mongoose.model('User',UserSchema);

module.exports = user