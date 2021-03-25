const express = require('express')
const handlebars = require('express-handlebars')
const {urlencoded, json} = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

//configurações
    //Sessão
        app.use(session({
            secret: "cursonode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())

    //Midleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("Success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })

    //body parser
        app.use(urlencoded({extended:true}))
        app.use(json())
    
    //handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    
    //mongoose
        const connectDB = require('./database/connection')
        connectDB()
    
    //Public
        app.use(express.static(path.join(__dirname, 'public')))

//Rotas
    app.use('/admin', admin)


//outros
const PORT = 8081
app.listen(PORT, () => {console.log(`servidor rodando em http://localhost:${PORT}`)})