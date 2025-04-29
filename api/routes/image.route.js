import express from 'express';
import Tesseract from 'tesseract.js';
import fetch from 'node-fetch'; // Import node-fetch to make HTTP requests

const router = express.Router();

// Function to clean up the OCR text
const cleanText = (text) => {
  const cleanedText = text.trim(); // Trim leading and trailing spaces
  return cleanedText;
};

// Route to handle OCR
router.post('/ocr', async (req, res) => {
  const { imageUrl } = req.body; // Receive image URL from frontend

  if (!imageUrl) {
    return res.status(400).json({ message: 'Image URL is required' });
  }

  try {
    // Fetch the image from the URL using fetch (node-fetch)
    const response = await fetch(imageUrl);
    
    // Check if the response is successful (status code 200)
    if (!response.ok) {
      throw new Error('Error fetching the image');
    }

    // Convert the response to a buffer
    const imageBuffer = await response.buffer(); // This will correctly buffer the image

    // Use Tesseract.js to extract text from the image
    const { data: { text } } = await Tesseract.recognize(
      imageBuffer, // Pass image data from the URL
      'eng', // Use English language for OCR
      {
        logger: (m) => {
          console.log('Tesseract progress:', m); // Log OCR progress
        }
      }
    );

    // Clean the extracted text
    const cleanedText = cleanText(text);

    // Send the cleaned text as the response
    res.json({ text: cleanedText });
  } catch (error) {
    console.error('Error processing the image or fetching:', error);
    res.status(500).json({ message: 'Error processing the image', error: error.message });
  }
});

export default router;
