const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/usuario")
const Usuario = mongoose.model("usuarios")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/registro', (req, res) =>{
    res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido!"})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválida!"})
    }

    if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros})
    }else{
        const novoUsuario = new Usuario({
            nome: req.body.nome,
            senha: req.body.senha
        })

        bcrypt.genSalt(10, (erro, salt) => {
            bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                if(erro){
                    req.flash("error_msg", "Houve um erro ao salvar o usuário!")
                    res.redirect('/')
                }

                novoUsuario.senha = hash

                novoUsuario.save().then(() => {
                    req.flash("success_mes", "Usuário criado com sucesso!")
                    res.redirect('/admin/postagens')
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro ao criar usuário!")
                    res.redirect("/usuarios/registro")
                })

            })
        })
        
    }    

})

router.get('/login', (req, res) => {
    res.render('usuarios/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: '/admin/postagens',
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)

})

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err) }
        req.flash('success_msg', "Deslogado com sucesso!")
        res.redirect('/')
    })
    
})





module.exports = router
