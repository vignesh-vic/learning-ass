import Flashcard from '../models/FlashCard.js'

export const getAllFlashcard = async (req, res, next) => {
    try {
        const flashcards = await Flashcard.find({
            userId:req.user_id,
            documentId:req.params.documentId

        }).populate('documentId','title fileName');
        res.status(200).json({
            success:true,
            count: flashcards.length,
            data: flashcards
        });
    } catch (error) {
      next(error)
    }
};


export const getFlashcardsSets = async (req, res, next) => {
    try {
        const flashcardSets = await Flashcard.find({
            userId:req.user_id,

        }).populate('documentId','title fileName');

         

        res.status(200).json({
            success: true,
            count: flashcardSets.length,
            data: flashcardSets
        });
    } catch (error) {
        next(error);
    }

}


export const reviewFlahcard = async (req, res) => {
    try {
        const flashcardSet = await Flashcard.findOne({ 

            'cards._id': req.params.cardId,
             userId:req.user_id

         });

        if (!flashcardSet) {
            return res.status(404).json({ status:false, message: 'Flashcard not found' });
        }

        const cardIndex = flashcardSet.findIndex((c) => c._id.toString() === req.params.cardId);

        if (cardIndex === -1) {
            return res.status(404).json({ status:false, message: 'Card not found' });
        }

        flashcardSet.cards[cardIndex].lastReviewed = new Date() ;
         flashcardSet.cards[cardIndex].reviewCount += 1;
        await flashcardSet.save();

        res.status(200).json({ status:true, message: 'Flashcard reviewed successfully', data: flashcardSet.cards[cardIndex] }); 

    } catch (error) {
        next(error)
    }
};


export  const toggleStartFlashcard = async (req, res) => {
    try {
        const { cardId } = req.params;  
        const flashcard = await Flashcard.findOne({ 'cards._id': cardId, userId: req.user_id });
        if (!flashcard) {
            return res.status(404).json({ status:false, message: 'Flashcard not found' });
        }   

        const cardIndex = flashcard.cards.findIndex((c) => c._id.toString() === cardId);
        if (cardIndex === -1) {
            return res.status(404).json({ status:false, message: 'Card not found' });
        }
       
        flashcard.cards[cardIndex].isStarred = !flashcard.cards[cardIndex].isStarred;
        await flashcard.save();

        res.status(200).json({ status:true, message: `Flashcard ${flashcard.cards[cardIndex].isStarred ? 'starred' : 'unstarred'}`, data: flashcard});

    } catch (error) {
        next(error)
    }
};

export const deleteFlashcardSet = async (req, res) => {
    try {
        const { id } = req.params;  
        const flashcardSet = await Flashcard.findById({_id:id, userId:req.user_id});
        if (!flashcardSet) {
            return res.status(404).json({ success: false, message: 'Flashcard set not found' });
        }   
         
        await flashcardSet.deleteOne();

        res.status(200).json({ success: true, message: 'Flashcard set deleted successfully' });
    }
        catch (error) {
        next(error)
    }   
};


