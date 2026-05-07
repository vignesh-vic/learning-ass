/**
 * Chunks the given text into smaller pieces of a specified maximum length.
 * @param {string} text - The text to be chunked.
 * @param {number} chunkSize - The maximum length of each chunk.
 * @param   {number} overlap - The maximum number of characters to overlap between chunks.
 * @returns {array<{content:string, chunkText:number, pageNumber:number}>} An array of text chunks.
 */
export const chunkText = (text, chunkSize = 500, overlap = 50) => {

    if (!text || text.trim() === 0) {
        return [];
    }

    const cleanedText = text
        .replace(/\r\n/g, '\n')
        .replace(/\s+/g, ' ')
        .replace(/\n/g, '\n')
        .replace(/\n/g, '\n')
        .trim()


    const paragraphs = cleanedText.split(/\n+/).filter(p => p.trim().length > 0)

    const chunks = []
    let currentChunk = []
    let currentWordCount = 0
    let chunkIndex = 0

    for (const paragraph of paragraphs) {

        const paragraphWords = paragraph.trim().split(/\s+/)
        const paragraphWordCount = paragraphWords.length

        if (paragraphWordCount > chunkSize) {

            if (currentChunk.length > 0) {
                chunks.push({
                    content: currentChunk.join(' '),
                    chunkText: chunkIndex++,
                    pageNumber: 0
                })

                currentChunk = []
                currentWordCount = 0

            }


            for (let i = 0; i < paragraphWords.length; i += (chunkSize - overlap)) {
                const chunkWords = paragraphWords.slice(i, i + chunkSize)
                chunks.push({
                    content: chunkWords.join(' '),
                    chunkText: chunkIndex++,
                    pageNumber: 0
                })

                if (i + chunkSize >= paragraphWords.length) {
                    break;
                }
            }

            continue;

        }

        if (currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0) {

            chunks.push({
                content: currentChunk.join('\n\n'),
                chunkText: chunkIndex++,
                pageNumber: 0
            })

            const prevChunkText = currentChunk.join(' ')
            const prevWords = prevChunkText.trim().split(/\s+/)
            const overlapText = prevWords.slice(-Math.min(overlap, prevWords.length)).join(' ')

            currentChunk = [overlapText, paragraph.trim()]

            currentWordCount = overlapText.split(/\s+/).length + paragraphWordCount


        } else {
            currentChunk.push(paragraph.trim())
            currentWordCount += paragraphWordCount
        }


    }

    if (currentChunk.length > 0) {
        chunks.push({
            content: currentChunk.join('\n\n'),
            chunkText: chunkIndex++,
            pageNumber: 0
        })
    }


    if (chunks.length === 0 && cleanedText.length > 0) {

        const allWords = cleanedText.trim().split(/\s+/)

        for (let i = 0; i < allWords.length; i += (chunkSize - overlap)) {
            const chunkWords = allWords.slice(i, i + chunkSize)
            chunks.push({
                content: chunkWords.join(' '),
                chunkText: chunkIndex++,
                pageNumber: 0
            })

            if (i + chunkSize >= allWords.length) break;

        }
    }

    return chunks


}


/** * Counts the number of words in the given text.
 * @param {Array<Object>} chunks - An array of text chunks.
 * @returns {string} query
 * @param {number} maxChunk - The maximum number of words allowed in a chunk.
 * @return {Array<Object>} An array of text chunks that do not exceed the specified word count.
 * 
 * */


export const findRelevantChunks = (chunks, query, maxChunk = 3) => {

    if (!chunks || chunks.length === 0 || !query) {
        return []
    }


    const stopWords = new Set(['the', 'is', 'in', 'and', 'to', 'of', 'a', 'that', 'it', 'with', 'as', 'for', 'was', 'on', 'are', 'by', 'this', 'be', 'or', 'from'])


    const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2 && !stopWords.has(word))

    if (queryWords.length === 0) {

        return chunks.slice(0, maxChunk).map((chunk) => ({
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id

        }))

    }

    const scoredChunks = chunks.map((chunk) => {

        const content = chunk.content.toLowerCase()
     
        const contentWords = content.split(/\s+/).length

        let score = 0

        for (const word of queryWords) {

            const exactMatches = content.match(new RegExp(`\\b${word}\\b`, 'g') || []).length
            score += exactMatches * 3


            const  partialMatches = content.match(new RegExp(word, 'g') || []).length
            score += Math.max(0, partialMatches - exactMatches) * 1.5

        }


        const uniqueQueryFound = queryWords.filter(word => content.includes(word)).length;

        if (uniqueQueryFound > 1) {
            score += uniqueQueryFound * 2
        }

        const normalizedScore = 1 -(index / chunks.length) * 0.1

        return {
          content: chunk.content,
          chunkIndex: chunk.chunkIndex,
          pageNumber: chunk.pageNumber,
          _id: chunk._id,
          score: score * normalizedScore,
          rawScore: score,
          matchWords: uniqueWordsFound
        }
    })


return scoredChunks
    .filter(chunk => chunk.score > 0)
    .sort((a, b) => { 
        if (b.score !== a.score) {
            return b.score - a.score
        }

        if (b.matchWords.length !== a.matchWords) {
            return b.matchWords - a.matchWords
        }

        return b.chunkIndex - a.chunkIndex
    })


}