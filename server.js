// npm install express.
// npm instal nodemon - serve para rodar o sv automatico
// npm install nunjucks - cria template pra poder botar o html



//configurando o servidor
const express = require("express");
const server = express();

//configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

// habilitar body do formulario
server.use(express.urlencoded({extended: true}))

// configurar banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'pwzkwfrkxrvbiyr',
    password: '772fd572f9e00bbb89f4b16366a571011bfb97decf922bde26dad4189ff99f76',
    host: 'ec2-52-23-14-156.compute-1.amazonaws.com',
    port: 5432,
    database: 'ddcp78c4i1hki7'
})

// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./",{
    express:server,
    noChache: true,
})


// configurar a apresentação
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })

})

server.post("/", function(req, res){
    //pegar dados do formulario.
    const name=req.body.name
    const email=req.body.email
    const blood=req.body.blood

    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios.")
    }

    // colocando valores dentro do banco
    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err){
        //fluxo de erro

        if (err) return res.send("erro no banco de dados")
        return res.redirect("/")
    })
})


//ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function(){
    console.log("Iniciei o servidor!");
});