var express = require('express')

var app = express()

app.listen(3000, function() {
    console.log("서버 실행중...")
})

app.get('/', function(req,res) {
    res.sendFile(__dirname + "/public/login.html")
})

app.get('/main', function(req,res) {
    res.sendFile(__dirname + "/public/login.html")
})

app.use(express.static('public'))
