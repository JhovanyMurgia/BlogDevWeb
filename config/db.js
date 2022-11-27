if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://jhovany:jhou1234@cluster0.klgogmn.mongodb.net/?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb+srv://jhovany:jhou1234@cluster0.klgogmn.mongodb.net/?retryWrites=true&w=majority"}
    
}