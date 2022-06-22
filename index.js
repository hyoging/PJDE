var express = require('express')

var app = express()
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())
app.unsubscribe(bodyParser.urlencoded({extended: true}))

app.listen(3000, function() {
    console.log("서버 실행중...")
})


app.set('view engine','ejs'); // 1
app.use(express.static(__dirname + '/public'));

const mysql = require('mysql');
const { render } = require('express/lib/response')

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'PJDE',
    password : '1234',
    database : 'pjde'
  });

db.connect();

module.exports = db;

app.get('/', function(req,res) {
    res.render('index');
})

app.get('/logout', function(req, res){
    res.clearCookie('id');
    res.clearCookie('name').redirect('/');
})

app.get("/main", function(req,res){ 
    var userId = req.cookies['id'];
    var userName = req.cookies['name'];
    

    var sql1 = 'select * from project where manager = "' + userId + '" or userId1 = "' + userId + '" or userId2 = "' + userId + '" or userId3 = "' + userId + '" or userId4 = "' + userId + '";';

    var sql2 = 'select * from notice join project where notice.proid = project.proid and (manager = "' + userId + '" or userId1 = "' + userId + '" or userId2 = "' + userId + '" or userId3 = "' + userId + '" or userId4 = "' + userId + '") order by notDate asc;';
    

    db.query(sql1, function (err, result, fields) {
        if (err) throw err;
        db.query(sql2, function (err, notice, fields) {
            if (err) throw err;
            res.render('main', {result:result, notice:notice, userId:userId, userName:userName});
        }); 
    }); 
})

app.get("/addProject", function(req,res){ 
    var userId = req.cookies['id'];
    var userName = req.cookies['name'];
    res.render('addProject', {userId:userId, userName:userName});
})

app.get("/main/notice", function(req,res){ 
    var userId = req.cookies['id'];
    var userName = req.cookies['name'];
    const sql = 'select * from notice join project where notice.proid = project.proid and (manager = "' + userId + '" or userId1 = "' + userId + '" or userId2 = "' + userId + '" or userId3 = "' + userId + '" or userId4 = "' + userId + '") order by notDate desc;';
    db.query(sql, (err, row)=>{
      if(err) {
        console.error(err.message);
      }
      res.render('mainNotice', {project:row, userId:userId, userName:userName});
    });
})

app.get("/main/:id/editProject", function(req,res){ 
    const id = req.params.id;
    var date = req.query.date;
    var userId = req.cookies['id'];

    const sql = "select * from project where proId='" + id + "';"
    db.query(sql, (err, row)=>{
      if(err) {
        console.error(err.message);
      }
      res.render('editProject', {project:row});
    });
})


app.get("/main/:id/calender", function(req,res){ 
    const id = req.params.id;
    var date = req.query.date;
    var userId = req.cookies['id'];
    var userName = req.cookies['name'];

    if(date == undefined){
        var today = new Date();
        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var day = ('0' + today.getDate()).slice(-2);

        var date = year + '-' + month  + '-' + day;
    }

    const sql = "SELECT * FROM schedule WHERE proId='" + id + "' and schDate='" + date + "';";

    const sql2 = "SELECT proName from project where proId='" + id + "';";

    db.query(sql, (err, row)=>{
      if(err) {
        console.error(err.message);
      }
      db.query(sql2, (err, row2)=>{
        if(err) {
          console.error(err.message);
        }
        res.render('calender', {id: id, project:row, date:date, userId:userId, userName:userName, proName:row2});
      });
    });
})

app.get("/main/:id/calender/addSchedule", function(req,res){
    var userId = req.cookies['id'];
    var userName = req.cookies['name'];
    res.render('addSchedule', {userId:userId, userName:userName});
})

app.get("/main/:id/calender/addSchedule/addSche", function(req,res){
    var id = req.params.id;
    var name = req.query.name;
    var date = req.query.select;

    db.query('insert into schedule (schNm, schDate, proId) VALUES("' + name + '", "' + date + '", "' + id + '");');

    res.send("<script>window.location.replace('/main/" + id +"/calender');</script>");
})

app.get("/main/:id/meeting", function(req,res){ 
    var userId = req.cookies['id'];
    var userName = req.cookies['name'];
    const id = req.params.id;

    const sql = "SELECT * FROM meeting WHERE proId=? order by meDate desc";
    const sql2 = "SELECT proName from project where proId='" + id + "';";
    db.query(sql, id, (err, row)=>{
      if(err) {
        console.error(err.message);
      }
      db.query(sql2, (err, row2)=>{
        if(err) {
          console.error(err.message);
        }
        res.render('meeting', {project:row, userId:userId, userName:userName, proName:row2});
      });
    });
})

app.get("/main/:id/meeting/addMeeting", function(req,res){
    var userId = req.cookies['id'];
    var userName = req.cookies['name'];
    res.render('addMeeting', {userId:userId, userName:userName});
})

app.get("/main/:id/meeting/addMeeting/addMeet", function(req,res){
    var id = req.params.id;
    var title = req.query.title;
    var userId = req.cookies['id'];
    var content = req.query.content;

    db.query('insert into meeting (title, userId, proId, content, meDate) VALUES("' + title + '", "' + userId + '", "' + id + '", "' + content + '", DATE_FORMAT(now(), \'%Y-%m-%d\'));');

    res.send("<script>window.location.replace('/main/" + id +"/meeting');</script>");
})

app.get("/main/:id/notice", function(req,res){ 
    const id = req.params.id;
    var userId = req.cookies['id'];
    var userName = req.cookies['name'];

    const sql = "SELECT * FROM notice WHERE proId=? order by notDate desc";

    const sql2 = "SELECT proName from project where proId='" + id + "';";
    db.query(sql, id, (err, row)=>{
      if(err) {
        console.error(err.message);
      }
      db.query(sql2, (err, row2)=>{
        if(err) {
          console.error(err.message);
        }
        res.render('notice', {project:row, userId:userId, userName:userName, proName:row2});
      });
    });
})

app.get("/main/:id/notice/addNotice", function(req,res){ 
    const id = req.params.id;
    var userId = req.cookies['id'];
    var userName = req.cookies['name'];

    res.render('addNotice', {userId:userId, userName:userName});
})

app.get("/main/:id/notice/addNotice/addNot", function(req,res){
    var id = req.params.id;
    var content = req.query.content;
    var userId = req.cookies['id'];

    db.query('insert into notice (content, proId, userId, notDate) VALUES("' + content + '", "' + id + '", "' + userId + '", DATE_FORMAT(now(), \'%Y-%m-%d\'));');

    res.send("<script>window.location.replace('/main/" + id +"/notice');</script>");
})

app.get("/register", function(req,res){ 
    res.render('register'); 
})

app.get("/send", function(req,res){ 
    var name = req.query.name; 
    var id = req.query.id;
    var password = req.query.password;

    var sql = 'select * from user where userId = "' + id + '";';

    if(name.length > 0 && name.length <= 10 && id.length > 0 && id.length <= 20 && password.length > 0 && password.length <= 20){
        db.query(sql, function(err, result){
            if (err) throw err;
            var numRows = result.length;
            if(numRows > 0){
                res.send("<script>alert('이미 존재하는 아이디입니다.'); window.location.replace('/register');</script>");
            }else{
                db.query('insert into user (userId, password, userName) VALUES("' + id + '", "' + password + '", "' + name + '");');
                res.send("<script>alert('회원가입 되었습니다.'); window.location.replace('/');</script>");
            }
        })
        
    }else{
        res.send("<script>alert('다시 입력해주세요.'); window.location.replace('/register');</script>");
    }
})

app.get("/login", function(req, res){
    res.render('login');
});

app.get("/trylogin", function(req,res){
    var id = req.query.id;
    var password = req.query.password;

    var sql = 'select * from user where userId = "' + id + '" and password = "' + password + '";';

    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        var numRows = result.length;
        if(numRows > 0){
            console.log("로그인");
            var name = result[0].userName;
            res.cookie('id', id);
            res.cookie('name', name);
            res.send("<script>alert('" + name + "님 환영합니다.'); window.location.replace('/main');</script>");
        }else{
            res.send("<script>alert('아이디 또는 비밀번호를 잘못 입력하였습니다.'); window.location.replace('/login');</script>");
        }
    });
    
})

app.get("/create", function(req,res){ 
    var color = req.query.color;
    var title = req.query.title;
    var manager = req.query.manager;
    var id1 = req.query.id1;
    var id2 = req.query.id2;
    var id3 = req.query.id3;
    var id4 = req.query.id4;
    var progress = req.query.progress;

    var today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    var dateString = year + month + day;
    var hours = ('0' + today.getHours()).slice(-2); 
    var minutes = ('0' + today.getMinutes()).slice(-2);
    var seconds = ('0' + today.getSeconds()).slice(-2); 
    var timeString = hours + minutes + seconds;

    Id = req.cookies['id'];

    var len = title.length;
    if(len > 6) len = 6;

    var proid = dateString + timeString + title.substring(0, len);

    const sql = "SELECT * FROM user WHERE userId=?";

    if(title != ""){
        db.query(sql, id1, (err1, row1)=>{
            if(err1) {
                console.error(err1.message);
            }
            if(row1.length > 0){
                db.query(sql, id2, (err2, row2)=>{
                    if(err2) {
                        console.error(err2.message);
                    }
                    if(row2.length > 0){
                        db.query(sql, id3, (err3, row3)=>{
                            if(err3) {
                                console.error(err3.message);
                            }
                            if(row3.length > 0){
                                db.query(sql, id4, (err4, row4)=>{
                                    if(err4) {
                                        console.error(err4.message);
                                    }
                                    if(row4.length > 0){
                                        db.query('insert into project (proId, proName, col, manager, userId1, userId2, userId3, userId4, progress) VALUES("' + proid + '", "' + title + '", "' + color + '", "' + manager + '", "' + id1 + '", "' + id2 + '", "' + id3 + '", "' + id4 + '", "' + progress + '");');
                                        res.send("<script> window.location.replace('/main');</script>");
                                    }else{
                                        res.send("<script>alert('" + id4 + "는(은) 없는 아이디입니다.'); window.location.replace('/addProject');</script>");
                                    }
                                });
                            }else{
                                res.send("<script>alert('" + id3 + "는(은) 없는 아이디입니다.'); window.location.replace('/addProject');</script>");
                            }
                        });
                    }else{
                        res.send("<script>alert('" + id2 + "는(은) 없는 아이디입니다.'); window.location.replace('/addProject');</script>");
                    }
                });
            }else{
                res.send("<script>alert('" + id1 + "는(은) 없는 아이디입니다.'); window.location.replace('/addProject');</script>");
            }
        });
    }else{
        res.send("<script>alert('프로젝트 명을 입력해주세요.'); window.location.replace('/addProject');</script>");
    }
})

app.get("/main/:id/editPro", function(req,res){ 
    var color = req.query.color;
    var title = req.query.title;
    var id = req.params.id;
    var id1 = req.query.id1;
    var id2 = req.query.id2;
    var id3 = req.query.id3;
    var id4 = req.query.id4;
    var id5 = req.query.id5;
    var progress = req.query.progress;

    const sql = "SELECT * FROM user WHERE userId=?";

    if(title != ""){
        db.query(sql, id1, (err1, row1)=>{
            if(err1) {
                console.error(err1.message);
            }
            if(row1.length > 0){
                db.query(sql, id2, (err2, row2)=>{
                    if(err2) {
                        console.error(err2.message);
                    }
                    if(row2.length > 0){
                        db.query(sql, id3, (err3, row3)=>{
                            if(err3) {
                                console.error(err3.message);
                            }
                            if(row3.length > 0){
                                db.query(sql, id4, (err4, row4)=>{
                                    if(err4) {
                                        console.error(err4.message);
                                    }
                                    if(row4.length > 0){
                                        db.query(sql, id5, (err5, row5)=>{
                                            if(err5) {
                                                console.error(err5.message);
                                            }
                                            if(row5.length > 0){
                                                db.query('UPDATE project SET proName = "' + title + '", col = "' + color + '", manager = "' + id1 +'", userId1 = "' + id2 + '", userId2 = "' + id3 + '", userId3 = "' + id4 + '", userId4 = "' + id5 + '", progress = "' + progress + '" WHERE proId = "' + id + '";');
                                                res.send("<script> window.location.replace('/main/" + id + "/calender');</script>");
                                            }else{
                                                res.send("<script>alert('" + id5 + "는(은) 없는 아이디입니다.'); window.location.replace('/main/" + id + "/editProject'));</script>");
                                            }
                                        });
                                    }else{
                                        res.send("<script>alert('" + id4 + "는(은) 없는 아이디입니다.'); window.location.replace('/main/" + id + "/editProject');</script>");
                                    }
                                });
                            }else{
                                res.send("<script>alert('" + id3 + "는(은) 없는 아이디입니다.'); window.location.replace('/main/" + id + "/editProject');</script>");
                            }
                        });
                    }else{
                        res.send("<script>alert('" + id2 + "는(은) 없는 아이디입니다.'); window.location.replace('/main/" + id + "/editProject');</script>");
                    }
                });
            }else{
                res.send("<script>alert('" + id1 + "는(은) 없는 아이디입니다.'); window.location.replace('/main/" + id + "/editProject');</script>");
            }
        });
    }else{
        res.send("<script>alert('프로젝트 명을 입력해주세요.'); window.location.replace('/main/" + id + "/editProject');</script>");
    }
})

app.get("/main/:id/delete", function(req,res){ 
    var id = req.params.id;

    var sql = 'DELETE FROM project WHERE proId="' + id + '";';

    db.query(sql, (err, row)=>{
        if(err) {
          console.error(err.message);
        }
        res.send("<script> window.location.replace('/main');</script>");
      });
 })


app.get("/main/:id/todo", function(req,res){ 
    var id = req.params.id;
    var userId = req.cookies['id'];
    var userName = req.cookies['name'];

    var sql = 'select * from todo where userId = "' + userId + '" and proId = "' + id + '" order by checked;';

    const sql2 = "SELECT proName from project where proId='" + id + "';";
    db.query(sql, id, (err, row)=>{
      if(err) {
        console.error(err.message);
      }
      db.query(sql2, (err, row2)=>{
        if(err) {
          console.error(err.message);
        }
        res.render('todo', {project:row, userId:userId, userName:userName, proName:row2});
      });
    });
 })

 app.get("/main/:id/todo/addTodo", function(req,res){ 
    var userId = req.cookies['id'];
    var userName = req.cookies['name'];
    var id = req.params.id;
    var title = req.query.title;

    var sql = 'select * from todo where userId = "' + userId + '" and proId = "' + id + '" and title = "' + title + '";';

    db.query(sql, (err, row)=>{
        if(err) {
          console.error(err.message);
        }
        if(row.length == 0){
            db.query('insert into todo (userId, proId, title, checked) VALUES("' + userId + '", "' + id + '", "' + title + '", false);');
            res.send("<script>window.location.replace('/main/" + id + "/todo');</script>");
        }else{
            res.send("<script>alert('이미 있는 todo입니다.');window.location.replace('/main/" + id + "/todo');</script>");
        }
    });
    
 })

 app.get("/main/:id/todo/changeTodo", function(req,res){ 
    var userId = req.cookies['id'];
    var userName = req.cookies['name'];
    var id = req.params.id;
    var title = req.query.title;
    var checked = req.query.checked;

    db.query('UPDATE todo SET checked =' + checked + ' where userId = "' + userId + '" and proId = "' + id + '" and title = "' + title + '";');
    res.send("<script>window.location.replace('/main/" + id + "/todo');</script>");
    
 })

 app.get("/main/:id/todo/deleteAll", function(req,res){ 
    var userId = req.cookies['id'];
    var id = req.params.id;

    var sql = 'DELETE FROM todo where userId = "' + userId + '" and proId = "' + id + '";';

    db.query(sql, (err, row)=>{
        if(err) {
          console.error(err.message);
        }
        res.send("<script>window.location.replace('/main/" + id + "/todo');</script>");
    });
    
 })
 
 