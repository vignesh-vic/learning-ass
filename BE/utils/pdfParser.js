import fs from 'fs/promises';
import pdfParse from 'pdf-parse';

/**
@param {string} filePath - The path to the PDF file to be parsed.
@returns {Promise<{ text: string, numPages: number, info: object }>} An object containing the extracted text, number of pages, and PDF metadata.
*/
export const extractTextFromPDF  = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const parser = new pdfParse(new Uint8Array(dataBuffer));
    const data = await parser.parse();
      return { text: data.text, numPages: data.numpages, info: data.info };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw error;
  } 
};