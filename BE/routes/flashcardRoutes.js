import express from 'express';
import {  reviewFlahcard, toggleStartFlashcard,   deleteFlashcardSet, getFlashcardsSets, getAllFlashcard } from '../controllers/flashcardController.js';
import protect from "../middleware/auth.js"

const router = express.Router();

router.use(protect)

router.get('/', getFlashcardsSets)
router.get('/:documentId', getAllFlashcard)
router.post('/:cardId/review',reviewFlahcard)
router.put('/:cardId/star', toggleStartFlashcard)
router.delete('/:id', deleteFlashcardSet)
 

export default router;

