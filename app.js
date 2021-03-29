const express = require('express')
const handlebars = require('express-handlebars')
const {urlencoded, json} = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
//models
const PostDB = require('./models/postagem')

//configurações
    //Sessão
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())

    //Midleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })

    //body parser
        app.use(urlencoded({extended:true}))
        app.use(json())
    
    //handlebars
        app.engine('handlebars', handlebars({
            defaultLayout: 'main', runtimeOptions:{
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        }}))
        app.set('view engine', 'handlebars')
    
    //mongoose
        const connectDB = require('./database/connection')
        connectDB()
    
    //Public
        app.use(express.static(path.join(__dirname, 'public')))

//Rotas
    app.get('/', (req, res) => {
        PostDB.find().populate('categoria').sort({data: 'desc'}).then((postagens) => {
            res.render('index', {postagens: postagens})
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/404')
        })
    })

    app.get('/404', (req, res) => {
        res.send('Erro 404!')
    })

    app.get('/posts', (req, res) => {
        res.send('Lista de Posts')
    })

    app.use('/admin', admin)


//outros
const PORT = 8081
app.listen(PORT, () => {console.log(`servidor rodando em http://localhost:${PORT}`)})