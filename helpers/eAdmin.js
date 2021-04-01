
module.exports = {
    eAdmin: function(req, res, next) {
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next();
        }
        else{
            req.flash('erro_msg', 'Somente administradores podem acessar esta pagina')
            res.redirect('/')
        }
    }
}