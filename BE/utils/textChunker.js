/**
 * Chunks the given text into smaller pieces of a specified maximum length.
 * @param {string} text - The text to be chunked.
 * @param {number} chunkSize - The maximum length of each chunk.
 * @param   {number} overlap - The maximum number of characters to overlap between chunks.
 * @returns {array<{content:string, chunkText:number, pageNumber:number}>} An array of text chunks.
 */
export const chunkText = (text, chunkSize=500, overlap=50) => {

    if(!text || text.trim() === 0) {
        return [];
    }

    const cleanedText = text
         .replace(/\r\n/g, '\n')
         .replace(/\s+/g, ' ')
         .replace(/\n/g, '\n')
         .replace(/\n/g, '\n')
         .trim()

    
    const paragraphs = cleanedText.split(/\n+/).filter(p=>p.trim().length > 0)

    const chunks = []
    let currentChunk = []
    let currentWordCount = 0
    let  chunkIndex = 0

    for (const paragraph of paragraphs) {
    
        const paragraphWords = paragraph.trim().split(/\s+/)
        const paragraphWordCount = paragraphWords.length

        if ( paragraphWordCount > chunkSize) {
           
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

                if(i + chunkSize >= paragraphWords.length) {
                    break;
                }
            }

            continue;

        }

        if(currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0) {
           
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


        }else {
            currentChunk.push(paragraph.trim())
            currentWordCount += paragraphWordCount
        }

    
    }

    if(currentChunk.length > 0) {
        chunks.push({
            content: currentChunk.join('\n\n'),
            chunkText: chunkIndex++,
            pageNumber: 0
        })
    }


    if(chunks.length ===0 && cleanedText.length > 0) {

        const allWords = cleanedText.trim().split(/\s+/)

        for (let i = 0; i < allWords.length; i += (chunkSize - overlap)) {
            const chunkWords = allWords.slice(i, i + chunkSize)
            chunks.push({
                content: chunkWords.join(' '),
                chunkText: chunkIndex++,
                pageNumber: 0
            })

            if(i + chunkSize >= allWords.length) break;

        }
    }

    return chunks


}


/** * Counts the number of words in the given text.
 * @param {Array<Object>} chunks - An array of text chunks.
 * @returns {string} query
 * @param {number} maxChunk - The maximum number of words allowed in a chunk.
 * @return {Array<Object>} An array of text chunks that do not exceed the specified word count.