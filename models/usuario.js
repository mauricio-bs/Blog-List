const mongoose = require('mongoose')

var user = new mongoose.Schema({
    nome: {
        type: String,
        rqeuired: true
    },
    email: {
        type: String,
        required: true
    },
    eAdmin: {
        type: Number,
        default: 0
    },
    senha: {
        type: String,
        required: true
    }
})

const usuario = mongoose.model('usuario', user)
module.exports = usuario