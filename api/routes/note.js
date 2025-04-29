import express from 'express';

import { createnote, deletenote, getAllnote, updatenote } from '../controllers/note.contorller.js';

const router = express.Router();

// Create a new inventory item
router.post('/icreate', createnote);

// Get all inventory items
router.get('/nget', getAllnote);

// Update an existing inventory item
router.put('/update/:noteId', updatenote); // Changed from idd to noteId

// Delete an inventory item
router.delete('/ddelete/:noteId', deletenote); // Changed from ied to noteId

export default router;
