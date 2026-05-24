import React from 'react';
import StarRating from './StarRating';
import { MapPin, Calendar, Star } from 'lucide-react';

export default function CompanyCard({ company, onClick }) {
  // Defensive check for company object
  if (!company || typeof company !== 'object') return null;
  
  const { name = 'Unknown', logoUrl, description = 'No description', location, city = 'N/A', foundedOn = 'N/A', averageRating = 0, reviewCount = 0 } = company;

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <div>
        {/* Header containing Logo & Info */}
        <div className="flex items-start gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1 transition-transform duration-300 group-hover:scale-105">
            <img
              src={logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150'}
              alt={`${name} logo`}
              className="h-full w-full object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=150';
              }}
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
              {name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-slate-400" />
                {city}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-400" />
                {foundedOn}
              </span>
            </div>
          </div>
        </div>

        {/* Rating Metrics */}
        <div className="mt-4 flex items-center gap-2">
          {reviewCount > 0 ? (
            <>
              <div className="flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                <Star className="h-3 w-3 fill-amber-600 text-amber-600" />
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={averageRating} size={4} />
              <span className="text-xs text-slate-400 font-medium">
                ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </>
          ) : (
            <>
              <span className="text-xs italic text-slate-400">No reviews yet</span>
            </>
          )}
        </div>

        {/* Description Body */}
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-blue-600 font-semibold group-hover:text-indigo-600 transition-colors">
        <span>View Reviews</span>
        <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
      </div>
    </div>
  );
}
