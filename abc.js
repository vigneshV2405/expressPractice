const express = require('express')
const app = express()

app.set('view-engine','ejs')
app.use(express.static("staticfiles"))
app.get('/products',(req,res)=>{
    fetch('https://fakestoreapi.com/products')
    .then((res)=>{return res.json()})
    .then((data)=>{
        res.render("productslist.ejs",{products:data})
        //res.send(data)
    })
})

app.get('/search',(req,res)=>{
    console.log(req.query)
    res.send('wait...............')
})
app.get('/product/:id',(req,res)=>{
    fetch("https://fakestoreapi.com/products/"+req.params.id)
    .then((res)=>{return res.json()})
    .then((data)=>{
        res.render("product.ejs",{product:data})
        //res.send(data)
    })
})

app.listen(4500,()=>{console.log('server running on 4500')})