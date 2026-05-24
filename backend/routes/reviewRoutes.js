import express from 'express';
import Review from '../models/Review.js';
import Company from '../models/Company.js';
import mongoose from 'mongoose';

const router = express.Router();

// POST /api/companies/:companyId/reviews → Add a review
router.post('/companies/:companyId/reviews', async (req, res) => {
  const { companyId } = req.params;
  const { fullName, subject, reviewText, rating } = req.body;

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    return res.status(400).json({ message: 'Invalid company ID format' });
  }

  if (!fullName || !subject || !reviewText || !rating) {
    return res.status(400).json({ message: 'All review fields are required' });
  }

  const ratingNum = Number(rating);
  if (ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    // Verify company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const newReview = new Review({
      companyId,
      fullName,
      subject,
      reviewText,
      rating: ratingNum,
      likes: 0,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
});

// GET /api/companies/:companyId/reviews → Get all reviews for a company with sorting
router.get('/companies/:companyId/reviews', async (req, res) => {
  const { companyId } = req.params;
  const { sort } = req.query; // 'date', 'rating', 'relevance'

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    return res.status(400).json({ message: 'Invalid company ID format' });
  }

  try {
    let sortOptions = { createdAt: -1 }; // default: newest first ('date')
    
    if (sort === 'rating') {
      sortOptions = { rating: -1, createdAt: -1 }; // Highest rating first
    } else if (sort === 'relevance') {
      sortOptions = { likes: -1, createdAt: -1 }; // Sorted by likes count
    }

    const reviews = await Review.find({ companyId }).sort(sortOptions);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reviews', error: error.message });
  }
});

// PATCH /api/reviews/:id/like → Increment like count
router.patch('/reviews/:id/like', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid review ID format' });
  }

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true } // Returns the updated document
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error updating like count', error: error.message });
  }
});

export default router;
