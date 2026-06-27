import Document from '../models/Document.js'
import FlasCard from '../models/FlashCard.js'
import Quiz from '../models/Quiz.js'
import ChatHistory from '../models/ChatHistory.js'
import * as geminiService from '../utils/geminiService.js'
import { findRelevantChunks } from '../utils/textChunker.js'
        



const generateFlashcards = async (req, res, next) => {
    try {
        
        const { documentId, count=10 } = req.body

        if (!documentId) {
            return res.status(400).json({ message: "Document ID is required" })
        }


        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'

        })

        if (!document) {
            return res.status(404).json({success: false, message: "Document not found or not ready", status:404 })
        }

        const cards = await geminiService.generateFlashcards(document.extractedText, parseInt(count))

        const flashcardSet= await FlasCard.create({

                userId: req.user._id,
                documentId: document._id,
                cards: cards.map(card => ({
                    question: card.question,
                    answer: card.answer,
                    difficulty: card.difficulty,
                    reviewCount: 0,
                    isStarred: false,
                }))
            })

        res.status(201).json({ success: true, flashcardSet, message: "Flashcards generated successfully" })

    } catch (error) {
        next(error);
    }    

};


const generateQuiz = async (req, res, next) => {

    try {

        const { documentId, numQuestions=5, title } = req.body
        
        if (!documentId) {
            return res.status(400).json({ message: "Document ID is required" })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready' 
        })

        if (!document) {
            return res.status(404).json({success: false, message: "Document not found or not ready", status:404 })
        }
    ;        
        const questions = await geminiService.generateQuiz(document.extractedText, parseInt(numQuestions))

        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title: title || `${document.title}- Quiz`,
            questions: questions,
            totalQuestions: questions.length,
            score: 0,
            userAnswers: [],
        })

        res.status(201).json({ success: true, data: quiz, message: "Quiz generated successfully" })

    } catch (error) {
        next(error);
    }

};


const generateSummary = async (req, res, next) => {

    try {
        const { documentId } = req.body

        if (!documentId) {
            return res.status(400).json({ success: false, message: "Document ID is required" })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready' 
        })


        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found or not ready", status:404 })
        }


        const summary = await geminiService.generateSummary(document.extractedText)

        res.status(200).json({ success: true, data: { documentId: document._id, title: document.title, summary }, message: "Summary generated successfully" })



    } catch (error) {
        next(error);
    }


};

const chat = async (req, res, next) => {

    try {
        
        const {documentId , question } = req.body

        if (!documentId || !question) {
            return res.status(400).json({ success: false, message: "Document ID and question are required" })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready' 
        })


        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found or not ready", status:404 })
        }

        const relaventChunks = findRelevantChunks(document.chunks, question, 3)
        const chunkIndices = relaventChunks.map(c => c.chunkIndex)

        let chatHistory = await ChatHistory.findOne({ userId: req.user._id, documentId: document._id })

        if (!chatHistory) {
            chatHistory = await ChatHistory.create({
                userId: req.user._id,
                documentId: document._id,
                history: []
            })
        }
    
        const answer = await geminiService.chatWithContext(question, relaventChunks)

        chatHistory.messages.push({
           role: 'user',
           content: question,
            timestamp: new Date(),
            relaventChunks: []
        },
        {
            role: 'assistant',
            content: answer,
            timestamp: new Date(),
            relaventChunks: chunkIndices
        }
    
    )
    await chatHistory.save()

    res.status(200).json({ success: true, data: {question, answer, relaventChunks: chunkIndices,chatHistoryId: chatHistory._id }, message: " Response generated successfully" })
    } catch (error) {
        next(error);
    }

};

const explainConcept = async (req, res, next) => {

    try {
        
        const { documentId, concept } = req.body

        if (!documentId || !concept) {
            return res.status(400).json({ success: false, error:"Please provide document ID and concept", message: "Document ID and concept are required" })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready' 
        }) 

        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found or not ready", status:404 })
        }

        const relaventChunks = findRelevantChunks(document.chunks, concept, 3)
        const context = relaventChunks.map(c => c.content).join('\n\n')

        const explanation = await geminiService.explainConcept(concept, context)
    res.status(200).json({ success: true, data: { concept, explanation, relaventChunks: relaventChunks.map(c => c.chunkIndex) }, message: "Explanation generated successfully" })
    } catch (error) {
        next(error);
    }

};

const getChatHistory = async (req, res, next) => {

    try {

        const { documentId } = req.params

        if (!documentId) {
            return res.status(400).json({ success: false, message: "Document ID is required" })
        }

        const chatHistory = await ChatHistory.findOne({ userId: req.user._id, documentId: documentId }).select('messages')

        if (!chatHistory) {
            return res.status(200).json({ success: true, data: [], message: "No chat history found", status:404 })
        } 
        
        res.status(200).json({ success: true, data: chatHistory.messages, message: "Chat history retrieved successfully" })

    } catch (error) {
        next(error);
    }

};


export { generateFlashcards, generateSummary, chat, generateQuiz, explainConcept, getChatHistory }
