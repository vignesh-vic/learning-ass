import express from 'express';
import { getAllFlashcardsSets, reviewFlahcard, toggleStartFlashcard, getFlashcards,  deleteFlashcardSet } from '../controllers/flashcardController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.use(protect)

router.get('/', getAllFlashcardsSets)
router.get('/:documentId', getFlashcards)
router.post('/:cardId/review',reviewFlahcard)
router.post('/:carId/star', toggleStartFlashcard)
router.delete('/:id', deleteFlashcardSet)


export default router;

