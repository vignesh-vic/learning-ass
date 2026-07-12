import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

const getQuizzesForDocument = async (documentId) => {

    try {

        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOC(documentId));
        return response.data;

    } catch (error) {
        throw error.response?.data || { message: "failed to get quizzes for document." };
    }

}


const getQuizById = async (quizId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_BY_ID(quizId));
    }
    catch (error) {
        throw error.response?.data || { message: "failed to get quiz by ID." };
    }
}


const submitQuiz = async (quizId, answers) => {
    try {
        const response = await axiosInstance.post(API_PATHS.QUIZZES.SUBMIT_QUIZ(quizId), { answers });
        return response.data;
    }
    catch (error) {
        throw error.response?.data || { message: "failed to submit quiz." };
    }
}

const getQuizResults = async (quizId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.QUIZZES.GET_QUIZ_RESULTS(quizId));
    }
    catch (error) {
        throw error.response?.data || { message: "failed to get quiz results." };
    }
}

const deleteQuiz = async (quizId) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.QUIZZES.DELETE_QUIZ(quizId));
    }
    catch (error) {
        throw error.response?.data || { message: "failed to delete quiz." };
    }

}

const quizService = {
    getQuizzesForDocument,
    getQuizById,
    submitQuiz,
    getQuizResults,
    deleteQuiz
};


export default quizService;  



