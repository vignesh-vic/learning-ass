import Document from '../models/Document.js'
import FlashCard from '../models/FlashCard.js'
import {extractTextFromPDF} from '../utils/pdfParser.js'
import {chunkText} from '../utils/textChunker.js'
import fs from 'fs/promises'
import mongoose from 'mongoose'


export const  uploadDocument = async (req, res, next)=>{

    try {
        
    } catch (error) {
        if(req.file){
            await fs.unlink(req.file.path).catch(()=>{

            })
        }
        next(error)
        
    }
}


//get  documents
export const getDocuments = async (req, res, next) => {
    try {
        const documents = await Document.find();
        res.json(documents);
    } catch (error) {
        next(error);
    }
};

//get  document
export const getDocument = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json(document);
    } catch (error) {
        next(error);
    }
};


//delete document
export const deleteDocument = async (req, res, next) => {
    try {
        const document = await Document.findByIdAndDelete(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json({ message: 'Document deleted successfully' });
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