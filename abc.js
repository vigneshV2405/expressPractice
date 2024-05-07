const express = require('express')
const fs = require('fs')
const app = express()
const bodyParser = require('body-parser')

app.set('view-engine','ejs')
app.use(express.static("staticfiles"))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/products',(req,res)=>{
    let products = JSON.parse((fs.readFileSync(__dirname+'/products.txt')).toString())
    res.render("productslist.ejs",{products:products})
})

app.get('/search',(req,res)=>{
    res.send('wait...............')
})
app.get('/product/:id',(req,res)=>{
    let products = JSON.parse((fs.readFileSync(__dirname+'/products.txt')).toString())
    let product = products.filter((p)=>{return p.id==req.params.id})
    res.render('product.ejs',{product:product[0]})
})
app.get('/addproduct',(req,res)=>{
    res.sendFile(__dirname+"/addproduct.html")
})
app.post('/addproduct',(req,res)=>{
    let products = JSON.parse((fs.readFileSync(__dirname+'/products.txt')).toString())
    newId = products.length?products[products.length-1].id+1:1
    let newProduct = {
        id : newId,
        title : req.body.title,
        price : req.body.price,
        description : req.body.description,
        category : req.body.category,
        image : req.body.image,
    }
    products = [...products,newProduct]
    fs.writeFileSync("products.txt",JSON.stringify(products))
    res.send("product added successfully")
})
app.delete("/deleteproduct/:id",(req,res)=>{
    let products = JSON.parse((fs.readFileSync(__dirname+'/products.txt')).toString())
    let updated = products.filter((p)=>{
        return p.id!=+req.params.id
    })
    fs.writeFileSync('products.txt',JSON.stringify(updated))
    res.json({status:"ok",deleted:true})
})

app.listen(4500,()=>{console.log('server running on 4500')})