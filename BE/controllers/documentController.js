import { error } from 'console'
import Document from '../models/Document.js'
import FlashCard from '../models/FlashCard.js'
import {extractTextFromPDF} from '../utils/pdfParser.js'
import {chunkText} from '../utils/textChunker.js'
import fs from 'fs/promises'
import mongoose from 'mongoose'
import { stat } from 'fs'


export const  uploadDocument = async (req, res, next)=>{

    try {
        if(!req.file){
            return res.status(400).json({success:false, error:'please upload a file',statusCode:400})
        }

        const {title} = req.body

        if(!title){
            await fs.unlink(req.file.path)
            return res.status(400).json({
                success:false,
                error:'Please provide a document title',
                statusCode:400
            })
        }

        const baseUrl = `https://localhost:${process.env.PORT || 5000}`
        const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`

        const document = await Document.create({
            userId:req.user._id,
            title,
            fileName:req.file.originalname,
            filePath:fileUrl,
            fileSize:req.file.size,
            status:'processing'
        })

        processPDF(document._id, req.file.path).catch((error)=>{
            console.error('Error processing PDF:', error)
        })

        res.status(201).json({
            success:true,
            data:document,
            statusCode:201,
            message:'Document uploaded successfully'
        })

    } catch (error) {
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>{

            })
        }
        next(error)
        
    }
}


const processPDF = async (documentId, filePath) => {
    try {
        const {text} = await extractTextFromPDF(filePath)
        const chunks = chunkText(text, 500,50)
   
        await Document.findByIdAndUpdate(documentId, { 
            extractedText: text,
            chunks,
            status: 'ready'
        
        })


    } catch (error) {
        console.error('Error processing PDF:', error)
        await Document.findByIdAndUpdate(documentId, { status: 'failed' })
        
    }
}

//get  documents
export const getDocuments = async (req, res, next) => {
    try {
        const documents = await Document.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user._id) } },
            {
                $lookup: {
                    from: 'flashcards',
                    localField: '_id',
                    foreignField: 'documentId',
                    as: 'flashcardSets'
                }
            },
            {
                $lookup: {
                    from: 'quizzes',
                    localField: '_id',
                    foreignField: 'documentId',
                    as: 'quizzes'    
            }},
           {
               $addFields: {
                flashcardCount:{ $size: '$flashcardSets' },
                quizCount: { $size: '$quizzes' }
                
               }
           },
           {
            $project: {
                extractedText:0,
                chunks:0,
                flashcardSets:0,
                quizzes:0
            }
           },
           {
            $sort: { updatedDate: -1 }
           }
        ])  


            res.status(200).json({
                success:true,
                count:documents.length,
                data:documents, 
                statusCode:200,
            })

    } catch (error) {
        next(error);
    }
};

//get  document
export const getDocument = async (req, res, next) => {
    try {
        const document = await Document.findOne({ _id: req.params.id, userId: req.user._id });
        if (!document) {
            return res.status(404).json({satus:false,  error: 'Document not found' });
        }

        res.json(document);
        const flashcardCount = await FlashCard.countDocuments({
            documentId:document._id,
            userId:req.user._id
        })
        const quizCount = await Quiz.countDocuments({
            documentId:document._id,
            userId:req.user._id
        })

        document.lastAccessed = new Date()
        await document.save()

        const documentData = document.toObject()
        documentData.flashcardCount = flashcardCount
        documentData.quizCount = quizCount

        res.status(200).json({
            success:true,
            data:documentData,
            statusCode:200
        })
    } catch (error) {
        next(error);
    }
};


//delete document
export const deleteDocument = async (req, res, next) => {
    try {
        const document = await Document.findOne({ _id: req.params.id, userId: req.user._id });
        
        if (!document) {
            return res.status(404).json({ message: 'Document not found', statusCode:404 });
        }

        await fs.unlink(document.filePath).catch(()=>{})

        await document.deleteOne()

        res.status(200).json({
            success:true,
            message:"Document deleted successfully"
        }) 

    } catch (error) {
        next(error);
    }
};

//update document
export const updateDocument = async (req, res, next) => {
    try {
        const document = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }   
        res.json(document);
    } catch (error) {
        next(error);
    }   
};