import express from 'express';
import { Profile } from '../models/Profile.js';

const router = express.Router();

// Get the central profile
router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
       // Create a default profile if none exists
       profile = await Profile.create({});
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update the central profile
router.put('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile(req.body);
      const newProfile = await profile.save();
      return res.json(newProfile);
    }
    
    // Update existing
    const updatedProfile = await Profile.findByIdAndUpdate(profile._id, req.body, { new: true });
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
