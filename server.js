const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');

const app = express()
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookie())
app.set('view engine','ejs')
app.use(express.static('staticfiles'))


function isLoggedIn(req,res,next){
    //console.log(req.cookies)
    if(req.cookies.token){
        jwt.verify(req.cookies.token,'vignesh',(err,user)=>{
            if(err){
                res.clearCookie('token')
                res.redirect('/login')
            }
            else{
                next()
            }
        })
    }
    else{
        res.redirect('/login')
    }
    
}

app.get('/',isLoggedIn,(req,res)=>{
    jwt.verify(req.cookies.token,'vignesh',(err,user)=>{
        if(err){
            res.clearCookie('token')
            res.redirect('/')
        }
        else{
            res.render('home2',{username:user.username})
        }
    })
})
app.get('/login',(req,res)=>{
    jwt.verify(req.cookies.token,'vignesh',(err,user)=>{
        if(err){
            res.clearCookie('token')
            res.sendFile(__dirname+'/login.html')
        }
        if(user){
            res.redirect('/')
        }
    })
})
app.post('/authenticate',(req,res)=>{
    if(req.body.username &&req.body.password){
        var token = jwt.sign({...req.body},'vignesh')
        res.cookie('token',token)
        res.redirect('/')
    }
    else{
        res.redirect('/login')
    }
})
app.get('/logout',(req,res)=>{
    jwt.verify(req.cookies.token,'vignesh',(err,user)=>{
        if(err){
            //console.log(err)
            res.clearCookie('token')
            res.redirect('/')
        }
        else{
            res.clearCookie('token')
            res.redirect('/')
        }
    })
})

app.listen(4000,()=>{console.log('app running on 4000')})