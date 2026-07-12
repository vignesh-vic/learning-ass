import { API_PATHS } from "../utils/apiPath";
import axiosInstance from "../utils/axiosInstance";


const generateFlashcards = async (documentId,options) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, {documentId,...options});
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "failed to generate flashcards."};
    }   

}


const generateQuiz = async (documentId,options) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, {documentId,...options});
        return response.data;
    } catch (error) {
        throw error.response?.data || {message: "failed to generate quiz."};
    }

}


const generateSummary = async (documentId,options) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, {documentId});
        return response?.data?.data;
    }
    catch (error) {
        throw error.response?.data || {message: "failed to generate summary."};
    }
}

const chat = async (documentId, message) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.CHAT, {documentId, question: message});
        return response.data;
    }
    catch (error) {
        throw error.response?.data || {message: "failed to chat."};
    }   

}

const explainConcept = async (documentId, concept) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, {documentId, concept}); 
        return response.data.data;
    }
    catch (error) {
        throw error.response?.data || {message: "failed to explain concept."};
    }
} 


const getChatHistory = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.AI.GET_CHAT_HISTORY(documentId));
        return response.data;
    }
    catch (error) {
        throw error.response?.data || {message: "failed to get chat history."};
    }
}


const aiService = {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory  
}

export default aiService;

