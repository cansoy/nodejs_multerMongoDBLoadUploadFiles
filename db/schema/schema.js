const mongoose=require('mongoose')

const fileSchema=new mongoose.Schema({
    name:{
        type:String
    },
    registerTime:{
        type:Date
    },
    fileName:{
        type:String
    },
    fileExt:{
        type:String
    },
    file:{
        type:Buffer
    }
})

const FileSchema=mongoose.model('FileSchema',fileSchema)

module.exports={
    FileSchema
}
