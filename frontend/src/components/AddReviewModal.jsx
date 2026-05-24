import React, { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';
import StarRating from './StarRating';

export default function AddReviewModal({ isOpen, onClose, onSubmit, companyName }) {
  const [formData, setFormData] = useState({
    fullName: '',
    subject: '',
    reviewText: '',
    rating: 0,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const tempErrors = {};
    if (!formData.fullName.trim()) tempErrors.fullName = 'Full Name is required';
    if (!formData.subject.trim()) tempErrors.subject = 'Subject line is required';
    
    if (!formData.reviewText.trim()) {
      tempErrors.reviewText = 'Review description is required';
    } else if (formData.reviewText.trim().length < 15) {
      tempErrors.reviewText = 'Review description must be at least 15 characters';
    }

    if (formData.rating === 0) {
      tempErrors.rating = 'Please choose a rating (1 to 5 stars)';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRatingChange = (newRating) => {
    setFormData((prev) => ({ ...prev, rating: newRating }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        fullName: '',
        subject: '',
        reviewText: '',
        rating: 0,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-slide-up border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Write a Review
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Share your honest workspace experience at <span className="font-semibold text-blue-600">{companyName}</span>.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Interactive Star Rating */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 flex flex-col items-center justify-center">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Rate your overall experience
            </label>
            <StarRating
              interactive={true}
              rating={formData.rating}
              onRatingChange={handleRatingChange}
              size={10}
            />
            {errors.rating && (
              <p className="mt-2 text-xs text-rose-600 font-medium text-center">{errors.rating}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                errors.fullName
                  ? 'border-rose-300 bg-rose-50/25 focus:border-rose-500'
                  : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {errors.fullName && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Subject Headline
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. Dynamic environment with amazing learning curves"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
                errors.subject
                  ? 'border-rose-300 bg-rose-50/25 focus:border-rose-500'
                  : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {errors.subject && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.subject}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Review Details
            </label>
            <textarea
              name="reviewText"
              value={formData.reviewText}
              onChange={handleChange}
              rows="5"
              placeholder="What are the pros and cons? How is the leadership team, compensation, and workspace flexibility?"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all resize-none ${
                errors.reviewText
                  ? 'border-rose-300 bg-rose-50/25 focus:border-rose-500'
                  : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {errors.reviewText && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.reviewText}</p>}
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
