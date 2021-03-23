const express = require('express')
const route = express.Router()

route.get('/', (req, res) => {
    res.render('Página principal do painel ADM')
})
route.get('/posts', (req, res) => {
    res.render('Página de posts')
})
route.get('/categorias', (req, res) => {
    res.render('Página de categorias')
})


module.exports = route