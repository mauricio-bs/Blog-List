const express = require('express')
const handlebars = require('express-handlebars')
const {urlencoded, json} = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
//const mongoose = require('mongoose')

//configurações
    //body parser
        app.use(urlencoded({extended:true}))
        app.use(json())
    //handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    //mongoose
        //Em breve
    //Public
        app.use(express.static(path.join(__dirname, 'public')))

//Rotas
    app.use('/admin', admin)


//outros
const PORT = 8081
app.listen(PORT, () => {
    console.log('servidor rodando!')
})