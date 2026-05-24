import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company reference is required'],
    index: true,
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1 star'],
    max: [5, 'Rating cannot exceed 5 stars'],
  },
  likes: {
    type: Number,
    default: 0,
  },
}, { 
  timestamps: true 
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
