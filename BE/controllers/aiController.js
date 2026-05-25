import Document from '../models/Document.js'
import FlasCard from '../models/FlashCard.js'
import Quiz from '../models/Quiz.js'
import ChatHistory from '../models/ChatHistory.js'
import * as geminiService from '../utils/geminiService.js'
        



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

const generateSummary = async (req, res, next) => {
    // Implementation for generating summary
};

const chat = async (req, res, next) => {
    // Implementation for chat
};

const generateQuiz = async (req, res, next) => {
    // Implementation for generating quiz
};

const explainConcept = async (req, res, next) => {
    // Implementation for explaining concept
};

const getChatHistory = async (req, res, next) => {
    // Implementation for getting chat history
};

export { generateFlashcards, generateSummary, chat, generateQuiz, explainConcept, getChatHistory };