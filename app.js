const express = require('express')
const handlebars = require('express-handlebars')
const {urlencoded, json} = require('body-parser')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
//configurações
require('./config/auth')(passport)
const app = express()
//rotas
const admin = require('./routes/admin')
const usuarios = require('./routes/usuario')
//models
const PostDB = require('./models/postagem')
const Cat = require('./models/Categoria')

//configurações
    //Sessão
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
        //Configuração do passport
        app.use(passport.initialize())
        app.use(passport.session())

    //Midleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
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
    app.get('/postagem/:slug', (req, res) => {
        PostDB.findOne({slug: req.params.slug}).then((postagem) => {
            if(postagem){
                res.render('postagem/index', {postagem: postagem})
            }else{
                req.flash('error_msg', 'Esta postagem não existe')
                res.redirect('/')
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/')
        })
    })

    app.get('/404', (req, res) => {
        res.send('Erro 404!')
    })

    app.get('/posts', (req, res) => {
        res.send('Lista de Posts')
    })

    app.get('/categorias', (req, res) => {
        Cat.find().then((categorias) => {
            res.render('categorias/index', {categorias: categorias})
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao interno ao listar as categorias')
            res.redirect('/')
        })
    })
    app.get('/categorias/:slug', (req, res) => {
        Cat.findOne({slug: req.params.slug}).then((categorias) => {
            if(categorias){

                PostDB.find({categoria: categoria._id}).then((postagens) => {
                    res.render('categorias/postagens', {postagens: postagens, categoria: categorias})

                }).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao listar os posts!')
                    res.redirect('/')
                })

            }else{

                req.flash('error_msg', 'Esta categoria não existe')
                res.redirect('/')

            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno ao carregar a pagina desta categoria')
            res.redirect('/')
        })
    })

    app.use('/usuarios', usuarios)
    app.use('/admin', admin)

//outros
const PORT = 8081
app.listen(PORT, () => {console.log(`servidor rodando em http://localhost:${PORT}`)})