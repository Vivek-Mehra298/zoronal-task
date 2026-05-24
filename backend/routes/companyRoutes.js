import express from 'express';
import Company from '../models/Company.js';
import mongoose from 'mongoose';

const router = express.Router();

// GET /api/companies → list all companies with average ratings and review counts
router.get('/', async (req, res) => {
  try {
    const companies = await Company.aggregate([
      {
        $lookup: {
          from: 'reviews', // MongoDB collection name for Review is usually 'reviews'
          localField: '_id',
          foreignField: 'companyId',
          as: 'reviews',
        },
      },
      {
        $project: {
          name: 1,
          logoUrl: 1,
          description: 1,
          location: 1,
          city: 1,
          foundedOn: 1,
          createdAt: 1,
          reviewCount: { $size: '$reviews' },
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: '$reviews' }, 0] },
              then: { $round: [{ $avg: '$reviews.rating' }, 1] },
              else: 0,
            },
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving companies', error: error.message });
  }
});

// POST /api/companies → create a company
router.post('/', async (req, res) => {
  const { name, logoUrl, description, location, city, foundedOn } = req.body;

  if (!name || !logoUrl || !description || !location || !city || !foundedOn) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newCompany = new Company({
      name,
      logoUrl,
      description,
      location,
      city,
      foundedOn: Number(foundedOn),
    });

    const savedCompany = await newCompany.save();
    // Add default rating/count fields for response consistency
    res.status(201).json({
      ...savedCompany.toObject(),
      reviewCount: 0,
      averageRating: 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating company', error: error.message });
  }
});

// GET /api/companies/:id → get single company with average rating and review details
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid company ID format' });
  }

  try {
    const companyStats = await Company.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'companyId',
          as: 'reviews',
        },
      },
      {
        $project: {
          name: 1,
          logoUrl: 1,
          description: 1,
          location: 1,
          city: 1,
          foundedOn: 1,
          createdAt: 1,
          reviewCount: { $size: '$reviews' },
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: '$reviews' }, 0] },
              then: { $round: [{ $avg: '$reviews.rating' }, 1] },
              else: 0,
            },
          },
        },
      },
    ]);

    if (!companyStats || companyStats.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(companyStats[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company details', error: error.message });
  }
});

export default router;
