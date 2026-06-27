
import Flashcard from '../models/FlashCard.js'
import Document from '../models/Document.js'
import Quiz from '../models/Quiz.js'


export const getDashboard = async (req, res,next) => {
    try {

        const userId = req.user._id; // Assuming you have the user ID available in the request object

        //get counts

        const totalDocuments = await Document.countDocuments({  userId });
        const totalFlashcardSets = await Flashcard.countDocuments({  userId });
        const totalQuizzes = await Quiz.countDocuments({  userId });
        const completedQuizzes = await Quiz.countDocuments({  userId, completedAt: { $ne: null } });

        //get statistics
        const flashcardSets = await Flashcard.find({ userId });
        let totalFlashcards = 0;
        let reviewFlashcards = 0;
        let starredFlashcards = 0;

        flashcardSets.forEach((set) => {
            totalFlashcards += set.cards.length;
            reviewFlashcards += set.cards.filter((card) => card.reviewCount > 0).length;
            starredFlashcards += set.cards.filter((card) => card.isStarred).length;
        });

      //get quiz statistics
      const quizzes = await Quiz.find({  userId, completedAt: { $ne: null } });
      const averageScore = quizzes?.length > 0 ? Math.round(quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / quizzes.length) : 0;


      //recent activities
      const recentDocuments = await Document.find({ userId }).sort({ uploadDate: -1 }).limit(5).select('title fileName lastAccessed status');

      const recentQuizzes = await Quiz.find({ userId }).sort({ completedAt: -1 }).limit(5)
      .populate("documentId", "title")
      .select('title score totalQuestions completedAt');

     const  studyStreak = Math.floor(Math.random() * 7) + 1; // Replace with actual logic to calculate study 
  
        res.status(200).json({

            success: true,
            data: {
                overview: {
                    totalDocuments,
                    totalFlashcardSets,
                    totalFlashcards,
                    reviewFlashcards,
                    starredFlashcards,
                    totalQuizzes,
                    completedQuizzes,
                    averageScore,
                    studyStreak
                },
                recentActivity: {
                    documents: recentDocuments,
                    quizzes: recentQuizzes
                }
            }

        })


    } catch (error) {

        next(error);
    }
}

