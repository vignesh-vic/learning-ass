import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";


const getAllFlashcardSets = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_FLASHCARD_SETS);

        return response.data;
    }
    catch (error) {
        throw error.response?.data || { message: "failed to get all flashcard sets." };
    }

}


const getFlashcardSetById = async (setId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(setId));
        return response.data;
    }
    catch (error) {
        throw error.response?.data || { message: "failed to get flashcard set by ID." };
    }   
}

const reviewFlashcard = async (cardId, cardIndex) => {
    try {
        const response = await axiosInstance.post(API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId), { cardIndex });
        return response.data;
    }   
    catch (error) {
        throw error.response?.data || { message: "failed to review flashcard." };
    }

}

const toggleStar = async (cardId) => {
    try {
        const response = await axiosInstance.post(API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId));
        return response.data;
    }
    catch (error) {
        throw error.response?.data || { message: "failed to toggle star." };
    }
}


const deleteFlashcardSet = async (setId) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(setId));
        return response.data;
    }   catch (error) {
        throw error.response?.data || { message: "failed to delete flashcard set." };
    }
}


const flashcardService = {
    getAllFlashcardSets,
    getFlashcardSetById,
    reviewFlashcard,
    toggleStar,
    deleteFlashcardSet
};

export default flashcardService;