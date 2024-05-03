var express = require('express')
var fs = require('fs')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')

var app = express()
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.set('view engine','ejs')
app.use(cookieParser())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge : 60000000 }
}))

app.post('/authenticate',(req,res,next)=>{
    var users = JSON.parse(fs.readFileSync('users.txt').toString())
    var x = users.filter((u)=>{
        return ( u.username===req.body.username && u.password===req.body.password )
    })
    console.log(req.url)
    if(x.length>0){
        req.session.username = req.body.username
        req.session.password = req.body.password
        res.cookie('username',req.body.username)
        res.cookie('password',req.body.password)
        res.redirect('/')
    }
    else{
        res.redirect('/login')
    }
})
app.use((req,res,next)=>{
    if(req.cookies.username){
        next()
    }
    else{
        res.sendFile(__dirname+'/login.html')
    }
})

app.get('/',(req,res)=>{
    console.log(req.session)
    res.sendFile(__dirname+'/home.html')
})
app.get('/login',(req,res)=>{
    res.sendFile(__dirname+'/login.html')
})
app.get('/aboutus',(req,res)=>{
    res.sendFile(__dirname+'/aboutus.html')
})
app.get('/contactus',(req,res)=>{
    res.sendFile(__dirname+'/contactus.html')
})
app.post('/addcontact',(req,res)=>{
    var contacts = JSON.parse(fs.readFileSync('contacts.txt').toString())
    contacts.push(req.body)
    fs.writeFileSync('contacts.txt',JSON.stringify(contacts))
    //res.send('wait..........')
    res.redirect('/contactus')
})
app.get('/contactlist',(req,res)=>{
    var contacts = JSON.parse(fs.readFileSync('contacts.txt').toString())
    res.render('contactlist',{contacts:contacts})
})
app.delete('/deletecontact/:id',(req,res)=>{
    console.log(req.params)
    var contacts = JSON.parse(fs.readFileSync('contacts.txt').toString())
    contacts.splice(req.params.id,1)
    fs.writeFileSync('contacts.txt',JSON.stringify(contacts))
    res.json({status:"success"})
})
app.get('/register',(req,res)=>{
    res.sendFile(__dirname+'/register.html')
})
app.post('/addreg',(req,res)=>{
    var regs = JSON.parse(fs.readFileSync('register.txt').toString())
    regs.push(req.body)
    fs.writeFileSync('register.txt',JSON.stringify(regs))
    res.redirect('/register')
})
app.get('/courses',(req,res)=>{
    var regs = JSON.parse(fs.readFileSync('register.txt').toString())
    res.render('courses',{regs:regs})
})
app.get('/logout',(req,res)=>{
    res.clearCookie('username')
    res.clearCookie('password')
    res.redirect('/')
})

app.listen(3000,()=>{console.log('server listening on 3000')})