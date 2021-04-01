const express = require('express')
const route = express.Router()
const mongoose = require('mongoose')
//Models
const Categoria = require('../models/Categoria')
const Postagem = require('../models/postagem')
//Helper
const {eAdmin} = require('../helpers/eAdmin')


route.get('/', eAdmin, (req, res) => {
    res.render('admin/index')
})

route.get('/posts', (req, res) => {
    res.render('Página de posts')
})

route.get('/categorias', eAdmin, (req, res) => {
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao listar as categorias")
        console.log('erro: ' +err)
        res.redirect('/admin')
    })
})

route.get('/categorias/add', eAdmin, (req, res) => {
    res.render('admin/addcategorias')
})

route.post('/categorias/nova', eAdmin, (req, res) => {
    
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

route.get('/categorias/edit/:id', eAdmin, (req, res) => {
 
    Categoria.findOne({_id: req.params.id}).then((categoria) => {
        res.render('admin/editCategorias', {categoria: categoria}) 
    }).catch((err) => {
        req.flash('error_msg', "Esta categoria não existe")
        res.redirect('/admin/categorias')
    })
    
})

route.post('/categorias/edit', eAdmin, (req, res) => {
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

route.post('/categorias/delete', eAdmin, (req, res) => {
    Categoria.remove({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Categoria deletada com sucesso!')
        res.redirect('/admin/categorias')
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao deletar a categoria')
        console.log(err)
        res.redirect('/admin/categorias')
    })
})

route.get('/postagens', (req, res) => {
    
    Postagem.find().populate('categoria').sort({data:'desc'}).then((postagens) => {
        res.render('admin/postagens', {postagens: postagens})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as postagens')
        console.log(err)
        res.redirect('/admin')
    })
        
})

route.get('/postagens/add', eAdmin, (req, res) => {
    Categoria.find().then((categorias) => {
        res.render('admin/addpostagem', {categorias: categorias})    
    })
    .catch((err) => {
        req.flash('error_msg', 'Houve um erro ao carregar o formulário')
        res.redirect('/admin')
    })
    
})

route.post('/postagens/novo', eAdmin,  (req, res) => {
    
    var erros =[]

    if(req.body.categoria == 0){
        erros.push({texto: 'Categoria invalida, registre uma nova categoria'})
    }

    if(erros.length > 0){
        res.render('/admin/addpostagem', {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }
        new Postagem(novaPostagem).save().then(() => {
            req.flash('success_msg', 'Postagem criada com sucesso!')
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro durante o salvamento da postagem')
            console.log(err)
            res.redirect('/admin/postagens')
        })
    }
})

route.get('/postagens/edit/:id', eAdmin, (req, res) => {
   
    Postagem.findOne({_id: req.params.id}).then((postagem) => {
        Categoria.find().then((categorias) => {
            res.render('admin/editpostagens', {categorias: categorias, postagem: postagem})
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao listar as categorias')
            res.redirect('/admin/postagens')
        })

    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao carregar o formulario de edição')
        res.redirect('/admin/postagens')
    })
    
})

route.post('/postagem/edit', eAdmin, (req, res) => {

    Postagem.findOne({_id: req.body.id}).then((postagem) => {
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(() =>{
            req.flash('success_msg', 'Postagem editada com sucesso!')
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('error_msg', 'Erro interno')
            console.log(err)
            res.redirect('/admin/postagens')
        })

    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao salvar a edição')
        console.log(err)
        res.redirect('/admin/postagens')
    })
})

route.get('/postagens/delete/:id', eAdmin, (req, res) => {
    Postagem.remove({_id: req.params.id}).then(() => {
        req.flash('success_msg', 'Postagem deletada com sucesso')
        res.redirect('/admin/postagens')
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/admin/postagens')
    })
})

module.exports = route