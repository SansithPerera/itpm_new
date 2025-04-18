import Note from '../models/note.js';

// Create Inventory Item
export const createnote = async (req, res) => {
  const { title, content} = req.body;

  try {
    const inventoryItem = new Note({
        title, content
    });

    await inventoryItem.save();
    res.status(201).json({ message: 'note item created successfully', inventoryItem });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read All Inventory Items
export const getAllnote = async (req, res) => {
  try {
    const inventoryItems = await Note.find();
    res.status(200).json(inventoryItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Inventory Item
export const updatenote = async (req, res) => {
  const { idd } = req.params;
  const { title, content } = req.body;

  try {
    const updatedInventoryItem = await Note.findByIdAndUpdate(idd, {
        title, content
    }, { new: true });

    res.status(200).json({ message: 'note item updated successfully', updatedInventoryItem });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Inventory Item
export const deletenote = async (req, res) => {
  const { ied } = req.params;

  try {
    await Note.findByIdAndDelete(ied);
    res.status(200).json({ message: 'note item deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


