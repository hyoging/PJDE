const express = request("express")
const app = express()
const numjucks = require("numjucks")
const bodyParser = require("body-parser")

app.set("view engine", "html")
numjucks.configure("./login", {
    express:app
})

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static())

app.get("/express", (req,res) =>{
    let name = req.query.name
    res.render("login.html",{
        user: name
    })
})

app.post("/express", (req,res) =>{
    res.send("<h1>post 방식의 요청입니다.<h1>")
})

app.listen(3000, ()=>{
    console.log("server onload")
})