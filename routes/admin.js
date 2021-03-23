const express = require('express')
const route = express.Router()

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


module.exports = route