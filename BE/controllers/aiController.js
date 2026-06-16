import Document from '../models/Document.js'
import FlasCard from '../models/FlashCard.js'
import Quiz from '../models/Quiz.js'
import ChatHistory from '../models/ChatHistory.js'
import * as geminiService from '../utils/geminiService.js'
import { findRelevantChunks } from '../utils/textChunker.js'




const generateFlashcards = async (req, res, next) => {
    try {

        const { documentId, count = 10 } = req.body

        if (!documentId) {
            return res.status(400).json({ message: "Document ID is required" })
        }


        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'

        })

        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found or not ready", status: 404 })
        }

        const cards = await geminiService.generateFlashcards(document.extractedText, parseInt(count))

        const flashcardSet = await FlasCard.create({

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

const generateSummary = async (req, res, next) => {

    try {

        const { documentId } = req.body

        if (!documentId) {
            return res.status(400).json({ statusCode: 400, success: false, error: "please provide  document ID", message: "Document ID is required" })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        })

        if (!document) {
            return res.status(404).json({ statusCode: 404, success: false, error: "Document not found or not ready", message: "Document not found or not ready" })
        }

        const summary = await geminiService.generateSummary(document.extractedText)

        res.status(200).json({ success: true, data: { documentId: document._id, title: document.title, summary }, message: "Summary generated successfully" })

    } catch (error) {
        next(error);
    }

};

const chat = async (req, res, next) => {

    try {

        const { documentId, question } = req.body

        if (!documentId || !question) {
            return res.status(400).json({ statusCode: 400, success: false, error: "Document ID and question are required" })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        })

        if (!document) {
            return res.status(404).json({ statusCode: 404, success: false, error: "Document not found or not ready" })
        }

        //find relavant chunks
        const relevantChunks = findRelevantChunks(document.chunks, question, 3)

        const chunkIndices = relevantChunks.map(chunk => chunk.chunkIndex)

        const chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: document._id,
            message: []
        })

        const answer = await geminiService.chatWithContext(question, relevantChunks)

        chatHistory.message.push({
            role: 'user',
            content: question,
            timestamp: new Date(),
            relavantChunks: []


        },

        {
            role: 'assistant',
            content: answer,
            timestamp: new Date(),
            relavantChunks: chunkIndices
        }
    
    
    )

    await chatHistory.save()

    res.status(200).json({ success: true, data: { relevantChunks: chunkIndices,chatHitoryId: chatHistory._id, question, answer }, message: "Chat response generated successfully" })


    } catch (error) {
        next(error);
    }

};

const generateQuiz = async (req, res, next) => {

    try {

        const { documentId, numQuestions = 5, title } = req.body

        if (!documentId) {
            return res.status(400).json({ message: "Document ID is required" })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        })

        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found or not ready" })
        }

        const questions = await geminiService.generateQuiz(document.extractedText, parseInt(numQuestions))

        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title: title || `Quiz for ${document.title} - Quize`,
            questions: questions,
            totalQuestions: questions.length,
            userAnswers: [],
            score: 0


        })

        res.status(201).json({ success: true, quiz, message: "Quiz generated successfully" })

    } catch (error) {
        next(error);
    }

};

const explainConcept = async (req, res, next) => {

    try {
        const {documentId, concept} = req.body

        if (!documentId || !concept) {
            return res.status(400).json({ message: "Document ID and concept are required" , statusCode: 400})
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        })

        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found or not ready", statusCode: 404 })
        }

        //find relavant chunks
        const relevantChunks = findRelevantChunks(document.chunks, concept, 3)
        const context = relevantChunks.map(chunk => chunk.content).join('\n\n')

        //generate explanation using geminiService
        const explanation = await geminiService.explainConcept(concept, context)

        res.status(200).json({ success: true, data: {explanation, concept, relevantChunks: relevantChunks.map(chunk => chunk.chunkIndex)}, message: "Concept explained successfully" })


        
    } catch (error) {
        next(error);
    }

};

const getChatHistory = async (req, res, next) => {
    try {
        const { documentId } = req.params

        if (!documentId) {
            return res.status(400).json({ message: "Document ID is required", statusCode: 400 })
        }


        const chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: documentId,
        }).select('message')


        if (!chatHistory) {
            return res.status(200).json({ success: true, data: [], message: "Chat history not found", statusCode: 200 })
        }

        res.status(200).json({ success: true, data: chatHistory.messages, message: "Chat history retrieved successfully" })

    } catch (error) {
        next(error);
    }


};

export { generateFlashcards, generateSummary, chat, generateQuiz, explainConcept, getChatHistory };