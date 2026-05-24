import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from '../components/StarRating';
import AddReviewModal from '../components/AddReviewModal';
import { MapPin, Calendar, ArrowLeft, Plus, MessageSquare, ThumbsUp, CalendarClock, Star, RefreshCw } from 'lucide-react';

export default function CompanyDetail({ companyId, onBack, onAddReviewSuccess }) {
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [sortOption, setSortOption] = useState('date'); // 'date' | 'rating' | 'relevance'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState(new Set()); // track local liked review IDs to prevent multi-clicking in same session
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:5000/api';

  const fetchCompanyDetails = async () => {
    try {
      setLoadingCompany(true);
      const res = await axios.get(`${API_BASE}/companies/${companyId}`);
      setCompany(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load company details.');
    } finally {
      setLoadingCompany(false);
    }
  };

  const fetchReviews = async (sort = sortOption) => {
    try {
      setLoadingReviews(true);
      const res = await axios.get(`${API_BASE}/companies/${companyId}/reviews?sort=${sort}`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, [companyId]);

  useEffect(() => {
    fetchReviews(sortOption);
  }, [companyId, sortOption]);

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOption(value);
  };

  const handleLikeReview = async (reviewId) => {
    if (likedReviews.has(reviewId)) return; // Prevent liking twice in the same session

    try {
      const res = await axios.patch(`${API_BASE}/reviews/${reviewId}/like`);
      // Update local state reviews array
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, likes: res.data.likes } : r))
      );
      setLikedReviews((prev) => new Set([...prev, reviewId]));
    } catch (err) {
      console.error('Error liking review', err);
    }
  };

  const handleCreateReviewSubmit = async (formData) => {
    try {
      await axios.post(`${API_BASE}/companies/${companyId}/reviews`, formData);
      // Success! Refetch company metrics and reviews
      await fetchCompanyDetails();
      await fetchReviews(sortOption);
      if (onAddReviewSuccess) {
        onAddReviewSuccess('Your review has been successfully posted!');
      }
    } catch (err) {
      console.error('Failed to post review', err);
      throw err; // pass error to modal to stop it from closing
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loadingCompany) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-inner animate-spin">
          <RefreshCw className="h-6 w-6" />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-500">Retrieving company dashboard...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center">
        <h3 className="text-lg font-bold text-slate-900">Unable to locate Company</h3>
        <p className="text-sm text-slate-500 mt-2">{error || 'The requested organization is missing or has been deleted.'}</p>
        <button
          onClick={onBack}
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </button>
      </div>
    );
  }

  const { name, logoUrl, description, location, city, foundedOn, averageRating = 0, reviewCount = 0 } = company;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in space-y-8">
      {/* Navigation Header */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-950 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </button>
      </div>

      {/* Main Profile Header Card */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 md:p-10 relative overflow-hidden">
        {/* Decorative backdrop gradient */}
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="absolute left-1/3 bottom-0 h-32 w-32 rounded-full bg-indigo-500/5 blur-3xl"></div>

        <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
          {/* Logo Frame */}
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-2 shadow-inner">
            <img
              src={logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150'}
              alt={`${name} logo`}
              className="h-full w-full object-cover rounded-xl"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=150';
              }}
            />
          </div>

          {/* Details & Info Block */}
          <div className="flex-1 space-y-3">
            <h1 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl md:text-4xl">
              {name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="h-4 w-4 text-slate-400" />
                {city}, {location}
              </span>
              <span className="hidden text-slate-300 sm:inline">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="h-4 w-4 text-slate-400" />
                Founded {foundedOn}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 pt-1 max-w-3xl">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Rating Analytics Box & Reviews Listing */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Rating Analytics Left Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm text-center">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400">
              Overall Score
            </h3>
            
            {reviewCount > 0 ? (
              <div className="mt-4 space-y-3">
                <div className="font-display text-6xl font-extrabold tracking-tight text-slate-900">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center">
                  <StarRating rating={averageRating} size={6} />
                </div>
                <p className="text-xs font-semibold text-slate-500">
                  Based on {reviewCount} verified {reviewCount === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-2">
                <div className="flex justify-center text-slate-300">
                  <Star className="h-14 w-14" />
                </div>
                <p className="text-sm text-slate-400 italic">No ratings published yet.</p>
              </div>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Write a Review
            </button>
          </div>
        </div>

        {/* Reviews Listing Right Panel */}
        <div className="lg:col-span-8 space-y-6">
          {/* Reviews Filter Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
            <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Reviews ({reviewCount})
            </h2>

            {reviewCount > 0 && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Sort By:
                </label>
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="date">Newest First</option>
                  <option value="rating">Highest Ratings</option>
                  <option value="relevance">Most Relevant</option>
                </select>
              </div>
            )}
          </div>

          {/* Reviews Stream */}
          {loadingReviews ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-28 rounded shimmer"></div>
                    <div className="h-4 w-20 rounded shimmer"></div>
                  </div>
                  <div className="h-4 w-2/3 rounded shimmer"></div>
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded shimmer"></div>
                    <div className="h-3 w-5/6 rounded shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => {
                const alreadyLiked = likedReviews.has(review._id);
                return (
                  <div
                    key={review._id}
                    className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-200"
                  >
                    {/* Reviewer Meta */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-display text-xs font-bold text-slate-600">
                          {review.fullName ? review.fullName[0].toUpperCase() : 'A'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{review.fullName}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <CalendarClock className="h-3 w-3" />
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          {review.rating.toFixed(1)} ★
                        </span>
                        <StarRating rating={review.rating} size={4} />
                      </div>
                    </div>

                    {/* Review Body */}
                    <div className="mt-4">
                      <h4 className="font-display text-base font-bold text-slate-900">
                        {review.subject}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                        {review.reviewText}
                      </p>
                    </div>

                    {/* Interactive Like Row */}
                    <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <button
                        onClick={() => handleLikeReview(review._id)}
                        disabled={alreadyLiked}
                        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
                          alreadyLiked
                            ? 'bg-blue-50 text-blue-600 cursor-default'
                            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700 cursor-pointer'
                        }`}
                      >
                        <ThumbsUp className={`h-4 w-4 ${alreadyLiked ? 'fill-blue-600' : ''}`} />
                        <span>{alreadyLiked ? 'Liked' : 'Helpful'}</span>
                      </button>
                      <span className="text-xs font-medium text-slate-400">
                        {review.likes} {review.likes === 1 ? 'person' : 'people'} found this helpful
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-display mt-4 text-base font-bold text-slate-900">No reviews yet</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-xs">
                Be the first to share your employee experience and guide potential job candidates!
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-blue-700"
              >
                Write First Review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateReviewSubmit}
        companyName={name}
      />
    </div>
  );
}
