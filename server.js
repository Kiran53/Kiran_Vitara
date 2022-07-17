require('dotenv').config()
const express=require('express')
const authRoutes=require('./routes/auth')
const mongoose=require('mongoose')
const path=require('path')
const cookieParser = require('cookie-parser')
const dbURI=process.env.dbURI
const port=process.env.PORT || 4000
const app=express()

app.use(express.json())
app.use(cookieParser())

app.use(express.static(path.join(__dirname, '/client/build')))
app.use('/api',authRoutes)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'))
})
mongoose.connect(dbURI,{useUnifiedTopology: true})
.then(()=>app.listen(port,()=>console.log(`server started on http://localhost:${port}`)))
.catch((err)=>console.log(err))
