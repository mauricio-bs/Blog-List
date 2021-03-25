const express = require('express')
const route = express.Router()
const mongoose = require('mongoose')
const Categorias = require('../models/Categoria')
const Categoria = mongoose.model("categorias")

route.get('/', (req, res) => {
    res.render('admin/index')
})

route.get('/posts', (req, res) => {
    res.render('Página de posts')
})

route.get('/categorias', (req, res) => {
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao listar as categorias")
        console.log('erro: ' +err)
        res.redirect('/admin')
    })
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

route.get('/categorias/edit/:id', (req, res) => {
 
    Categoria.findOne({_id: req.params.id}).then((categoria) => {
        res.render('admin/editCategorias', {categoria: categoria}) 
    }).catch((err) => {
        req.flash('error_msg', "Esta categoria não existe")
        res.redirect('/admin/categorias')
    })
    
})

route.post('/categorias/edit', (req, res) => {
    Categoria.findOne({_id: req.body.id}).then((categoria) => {
        
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash('success_msg', 'Categoria modificada com sucesso!')
            res.redirect('/admin/categorias')
        })
        .catch((err) => {
            req.flash('error_msg', 'Houve um erro interno ao salvar a edição da categoria')
            console.log(err)
            res.redirect('/admin/categorias')
        })

    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao editar a categoria')
        res.redirect('/admin/categorias')
    })
})

route.post('/categorias/delete', (req, res) => {
    Categoria.remove({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Categoria deletada com sucesso!')
        res.redirect('/admin/categorias')
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao deletar a categoria')
        console.log(err)
        res.redirect('/admin/categorias')
    })
})

module.exports = route