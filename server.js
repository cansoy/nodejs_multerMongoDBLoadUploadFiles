const fs=require('fs')
const path =require('path')
require('dotenv').config({path:path.join(__dirname,'./bin/.env')})
const express=require('express')
const server=express()
const multer =require('multer')
const upload=multer()
const uuid=require('uuid')
const connect=require('./db/connect')
const schema=require('./db/schema/schema')
const stream=require('stream')

const PORT=process.env.PORT

server.use(express.json())
server.use(express.urlencoded({extended:false}))
server.use(express.static(path.join(__dirname,'./public')))

server.set('view engine','ejs')
server.set('views',path.join(__dirname,'./views'))

server.get('/',async(req,res)=>{
    await connect.dbConnection()
    const collectionCount=await schema.FileSchema.count()
    res.render('index',{collectionCount:collectionCount})
})

server.post('/posted',upload.single('file'),async(req,res)=>{
    const reqBody=req.body
    const reqFile=req.file
    if (reqFile != undefined) {
        const fileName=`${reqBody.name}_${uuid.v4()}`
        const fileExt=path.parse(reqFile.originalname).ext
        const FileSchema=new schema.FileSchema({
            name:fileName,
            registerTime:new Date().getTime(),
            fileName:fileName,
            fileExt:fileExt,
            file:reqFile.buffer
        })
        await FileSchema.save()
    }
    res.redirect('/posted')
})

server.get('/posted',(req,res)=>{
    res.render('posted')
})

server.get('/showdb',async(req,res)=>{
    await connect.dbConnection()
    const findAll =await schema.FileSchema.find()
    const files=findAll.map(item=>({
        fileName:item.name,
        src:Buffer.from(item.file),
        fileExt:item.fileExt
    }))
    files.forEach(item=>{
        if (item.fileExt==".mp4") {
            const readStream=stream.Readable.from(item.src) 
            const writeStream=fs.createWriteStream(`./public/${item.fileName}.mp4`)
            readStream.pipe(writeStream)
        }   
    })
    res.render('showdb',{files:files})
})

server.get('/showdb/:picture',async(req,res)=>{
    const reqParam=req.params.picture
    await connect.dbConnection()
    const file=await schema.FileSchema.findOne({name:reqParam})
    const fileBuffer= Buffer.from(file.file).toString('base64')
    res.render('download')
})

server.listen(PORT,()=>{
    console.log('////////////////////////////////////////////////////////////////////')
})