const express = require('express')
const app = express()

app.get('/products',(req,res)=>{
    fetch('https://fakestoreapi.com/products')
    .then((res)=>{return res.json()})
    .then((data)=>{
        res.send(data)
    })
})

app.listen(4500,()=>{console.log('server running on 4500')})