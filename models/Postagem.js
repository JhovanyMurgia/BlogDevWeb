const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const Postagem = new Schema({
    conteudo: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId, 
        ref: "categorias",
        required: true
    },
    usuario: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("postagens", Postagem)