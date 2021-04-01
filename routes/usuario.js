const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
//models
const Users = require('../models/usuario')

router.get('/registro', (req, res) => {
    res.render('usuarios/registro')
})

router.post('/registro', (req, res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({text: 'Nome invalido'})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({text: 'Email invalido'})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({text: 'Senha invalida'})
    }

    if(req.body.senha.length < 4){
        erros.push({texto: 'Senha muito curta'})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: 'As senhas não coincidem, tente novamente'})
    }

    if(erros.length > 0){
        res.render('usuarios/registro', {erros: erros})
    }else{
        Users.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                req.flash('erro_msg', 'Ja existe uma conta registrada com este email')
                res.redirect('/usuarios/registro')
            }else{

                const novoUsuario = new Users({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro){
                            
                            req.flash('error_msg', 'Houve um erro durante o salvamento do usuario')
                            res.redirect('/')

                        }else{
                            novoUsuario.senha = hash
                            novoUsuario.save().then(() => {
                                req.flash('success_msg', 'Usuario criado com sucesso')
                                res.redirect('/')
                            }).catch(() => {
                                req.flash('error_msg', 'Houve um erro ao criar o usuario, tente novamente')
                                res.redirect('/usuarios/registro')
                            })
                        }
                    })
                })

            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/')
        })
    }
})

router.get('/login', (req, res) => {
    res.render('usuarios/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'Deslogado com sucesso')
    res.redirect('/')
})

module.exports = router