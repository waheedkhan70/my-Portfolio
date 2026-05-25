import express from 'express';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// POST: Upload a single file
router.post('/', upload.single('file'), (req, res) => {
  try {
    console.log(`[Upload Request] File received:`, req.file ? {
      name: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      filename: req.file.filename
    } : 'None');

    if (!req.file) {
      console.warn(`[Upload Warning] No file in request`);
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Construct the URL to access the file
    // Note: If using a reverse proxy, you might need to adjust this
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    console.log(`[Upload Success] File saved as: ${req.file.filename}, URL: ${fileUrl}`);

    res.status(200).json({
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error(`[Upload Error]`, error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
