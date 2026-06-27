import dotenv from 'dotenv'
import { GoogleGenAI } from '@google/genai'

dotenv.config()

if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is missing')
    process.exit(1)
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
})

/* =========================
   GENERATE FLASHCARDS
========================= */

export const generateFlashcards = async (text, count = 10) => {

    const prompt = `
Generate exactly ${count} educational flashcards from the following text.

Format each flashcard exactly like this:

Q: [Clear question]
A: [Concise answer]
D: [easy | medium | hard]

Separate each flashcard with ---

Text:
${text.substring(0, 15000)}
`

    try {

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",            contents: prompt,
        })

        const generatedText = response.text || ''

        const flashcards = []

        const cards = generatedText
            .split('---')
            .filter(card => card.trim())

        for (const card of cards) {

            const lines = card.trim().split('\n')

            let question = ''
            let answer = ''
            let difficulty = 'medium'

            for (const line of lines) {

                const trimmed = line.trim()

                if (trimmed.startsWith('Q:')) {
                    question = trimmed.substring(2).trim()
                }

                else if (trimmed.startsWith('A:')) {
                    answer = trimmed.substring(2).trim()
                }

                else if (trimmed.startsWith('D:')) {

                    const diff = trimmed
                        .substring(2)
                        .trim()
                        .toLowerCase()

                    if (['easy', 'medium', 'hard'].includes(diff)) {
                        difficulty = diff
                    }
                }
            }

            if (question && answer) {
                flashcards.push({
                    question,
                    answer,
                    difficulty,
                })
            }
        }

        return flashcards.slice(0, count)

    } catch (error) {

        console.error('Gemini Flashcard Error:', error)

        throw new Error('Failed to generate flashcards')
    }
}

/* =========================
   GENERATE QUIZ
========================= */

export const generateQuiz = async (text, count = 10) => {

    const prompt = `
Generate exactly ${count} multiple choice questions from the following text.

Format each question exactly like this:

Q: [Question]
Q1: [Option 1]
Q2: [Option 2]
Q3: [Option 3]
Q4: [Option 4]
C: [Correct option number]
E: [Brief explanation]
D: [easy | medium | hard]

Separate each question with ---

Text:
${text.substring(0, 15000)}
`

    try {

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        })

        const generatedText = response.text || ''

        const questions = []

        const questionBlocks = generatedText
            .split('---')
            .filter(q => q.trim())

        for (const block of questionBlocks) {

            const lines = block.trim().split('\n')

            let question = ''
            let options = []
            let correctAnswer = ''
            let explanation = ''
            let difficulty = 'medium'

            for (const line of lines) {

                const trimmed = line.trim()

                if (trimmed.startsWith('Q:')) {
                    question = trimmed.substring(2).trim()
                }

                else if (/^Q\d:/.test(trimmed)) {
                    options.push(trimmed.substring(3).trim())
                }

                else if (trimmed.startsWith('C:')) {
                    correctAnswer = trimmed.substring(2).trim()
                }

                else if (trimmed.startsWith('E:')) {
                    explanation = trimmed.substring(2).trim()
                }

                else if (trimmed.startsWith('D:')) {

                    const diff = trimmed
                        .substring(2)
                        .trim()
                        .toLowerCase()

                    if (['easy', 'medium', 'hard'].includes(diff)) {
                        difficulty = diff
                    }
                }
            }

            if (
                question &&
                options.length === 4 &&
                correctAnswer
            ) {
                questions.push({
                    question,
                    options,
                    correctAnswer,
                    explanation,
                    difficulty,
                })
            }
        }

        return questions.slice(0, count)

    } catch (error) {

        console.error('Gemini Quiz Error:', error)

        throw new Error('Failed to generate quiz')
    }
}

/* =========================
   GENERATE SUMMARY
========================= */

export const generateSummary = async (text) => {

    const prompt = `
Summarize the following text clearly.

Highlight:
- Main ideas
- Important concepts
- Key takeaways

Text:
${text.substring(0, 20000)}
`

    try {

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        })

        return response.text || ''

    } catch (error) {

        console.error('Gemini Summary Error:', error)

        throw new Error('Failed to generate summary')
    }
}

/* =========================
   CHAT WITH CONTEXT
========================= */

export const chatWithContext = async (question, chunks) => {

    const context = chunks
        .map((chunk, index) => `Chunk ${index + 1}:\n${chunk.content}`)
        .join('\n\n')

    const prompt = `
Answer the user's question ONLY using the context below.

If the answer is not available in the context,
reply with:
"Answer not found in the document."

Context:
${context}

Question:
${question}
`

    try {

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        })

        return response.text || ''

    } catch (error) {

        console.error('Gemini Chat Error:', error)

        throw new Error('Failed to answer question')
    }
}

/* =========================
   EXPLAIN CONCEPT
========================= */

export const explainConcept = async (concept, context) => {

    const prompt = `
Explain the concept "${concept}"
using the following context.

Keep the explanation:
- Clear
- Beginner friendly
- Concise
- Include examples if needed

Context:
${context.substring(0, 10000)}
`

    try {

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        })

        return response.text || ''

    } catch (error) {

        console.error('Gemini Explain Error:', error)

        throw new Error('Failed to explain concept')
    }
}