const path=require('path')
require('dotenv').config({path:path.join(__dirname,'../bin/.env')})
const mongoose=require('mongoose')
const DB_PATH = process.env.DB_PATH
const options ={ useNewUrlParser: true, useUnifiedTopology: true}

const dbConnection=()=>{
    mongoose.connect(DB_PATH,options)
    .then(res=>{console.log('DB Connect is OK')})
    .catch(err=>{console.log('DB Connect is Error')})
}

module.exports={
    dbConnection
}
