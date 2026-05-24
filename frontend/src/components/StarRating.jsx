import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, interactive = false, onRatingChange, size = 5 }) {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizeClasses = {
    4: 'h-4 w-4',
    5: 'h-5 w-5',
    6: 'h-6 w-6',
    8: 'h-8 w-8',
    10: 'h-10 w-10'
  };

  const currentSize = starSizeClasses[size] || 'h-5 w-5';

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((starValue) => {
        // Calculate fill state
        let isFilled = false;
        if (interactive) {
          isFilled = starValue <= (hoverRating || rating);
        } else {
          // Supports half stars / rounding to closest star
          isFilled = starValue <= Math.round(rating);
        }

        return (
          <button
            key={starValue}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`transition-transform duration-100 ${
              interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'
            }`}
          >
            <Star
              className={`${currentSize} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-200 fill-slate-100'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
}
