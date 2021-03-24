const express = require('express')
const route = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model("categorias")

route.get('/', (req, res) => {
    res.render('admin/index')
})

route.get('/posts', (req, res) => {
    res.render('Página de posts')
})

route.get('/categorias', (req, res) => {
    res.render('admin/categorias')
})

route.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

route.post('/categorias/nova', (req, res) => {
    
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.nome == null){
        erros.push({texto: "Slug inválido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria muito pequeno"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso")
            res.redirect('/admin/categorias')
        })
        .catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
            console.log("Erro ao salvar categoria: " +err)
        })
    }

})

module.exports = route