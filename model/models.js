const mongoose = require("mongoose")
const mySchema = new mongoose.Schema({
    fullName:{
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password:{
        type: String,
        required: true
    },
    score: {
        html: {
            type: Number
        },
        css: {
            type: Number
        },
        node: {
            type: Number
        },
        javaScript: {
            type: Number
        }
    },
    blackList: {
        type: Array,
        default: []
    }
}, {timestamps: true})

const User = mongoose.model("Users", mySchema)
module.exports = User