import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true },

    title: { type: String,  required: [true,"Please provide a document title"],trim:true },
    fileName:{
        type:String
    },
    fileSize:{
        type:Number
    },
    extractedText:{
        type:String
    },
    chunks:[{
        content:{
            type:String
        },
        pageNumber:{
            type:Number,
            default:0
        },
        chunkIndex:{
            type:Number
        }
    }],
    uploadDate:{
        type:Date,
        default: Date.now
    },
    lastAccessed:{
        type:Date,
        default: Date.now

    },
status:{
    type:String,
    
}


})