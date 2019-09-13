const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    },
    tasks:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tasks'
    }] ,
    createdAt: {
        type: Date,
        default:Date.now
    }
})

const project = mongoose.model('Projects',ProjectSchema);

module.exports = project