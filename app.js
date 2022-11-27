//carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require("./routes/admin")
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const usuarios = require("./routes/usuario")
const passport = require('passport')
require("./config/auth")(passport)
const db = require('./config/db')

//Sessão
app.use(session({
    secret: "BlogDevWeb",
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Meddleware
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next()
})

app.use(function (req, res, next) {
    if(req.user) {
        res.locals.usuarioLogado = req.user.toObject()
    }
    next()
})


//Configurações
//Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//Handlebars
app.engine('handlebars', handlebars.engine({ defaulyLayout: 'main' }))
app.set('view engine', 'handlebars')
//Mongoose
/*
mongoose.Promise = global.Promise
mongoose.connect(db.mongoURI).then(() => {
    console.log("Conectado no Mongo")
}).catch((err) => {
    console.log("Erro ao se conectar: "+err)
})
*/

//Public
app.use(express.static(path.join(__dirname, "public")))


//Rotas
app.get('/', (req, res) => {
    res.render("index")
})

app.use('/admin', admin)
app.use('/usuarios', usuarios)


//APP
const port = process.env.PORT || 3000
const start = async () => {
    try {
        mongoose.connect(db.mongoURI).catch(err => console.log(err))
        app.listen(port, () => {
            console.log(`Listen on port ${port}.`)
        })
    } catch (error) {
        console.log(error)
    }
}
start()

