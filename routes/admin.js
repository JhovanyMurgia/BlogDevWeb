const { auto } = require('async')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")

router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/categorias', (req, res) => {
    Categoria.find().sort({date: "desc"}).lean().then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as categorias!')
        res.redirect('/admin')

    })
    
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', (req, res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido!"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso!')
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a categoria! Tente novamente.')
            res.redirect("/admin/postagens")
        })
    }    
})

router.get('/postagens', (req, res) => {
    Postagem.find().lean().populate('categoria').sort({data: "desc"}).then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar as postagens!")
        res.redirect('/adimin')
    })
    
})

router.get('/postagens/add/:usuario', (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagem", {categorias: categorias})
        
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as categorias!')
        res.redirect('/admin')

    })
})
router.post('/postagens/nova', (req, res) =>{


    var erros = []

    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto: "Sem conteudo!"})
    }

    if(erros.length > 0){
        res.render("admin/postagens", {erros: erros})
    }else{
        const novaPostagem = {
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            usuario: req.body.usuario
        }
    
        new Postagem(novaPostagem).save().then(() => {
            req.flash('success_msg', 'Postagem criada com sucesso!')
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao criar a postagem! Tente novamente.')
            res.redirect("/admin/postagens")
        }) 
        
    }      

})

router.get('/minhaspostagens/:usuario', (req, res) => {
    Postagem.find({usuario: req.params.usuario}).lean().populate('categoria').sort({data: "desc"}).then((postagens) => {
        res.render('admin/minhaspostagens', {postagens: postagens})

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar as postagens!")
        res.redirect('/adimin/postagens')
    })
})

router.post("/minhaspostagens/deletar", (req, res) => {
    Postagem.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Post excluido com sucesso!")
        res.redirect('/admin/postagens')       
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao excluiro post!")
        res.redirect('/admin/postagens') 
        
    })
})




module.exports = router