import { buildStars } from "@/lib/utils/array-utils";
import { formatFaNumber } from "@/lib/utils/persian-format";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating?:       number;
  reviewsCount?: number;
}

export default function StarRating({ rating = 0, reviewsCount = 0 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-x-1.5 flex-wrap">
      <div
        className="flex flex-row-reverse justify-end items-center gap-x-1 shrink-0"
        role="img"
        aria-label={`امتیاز ${rating} از ۵`}
      >
        {buildStars(rating).map((filled, i) => (
          <Star
            key={i}
            size={12}
            aria-hidden
            className={filled ? "text-amber-400 fill-amber-400" : "text-neutral-300 fill-neutral-300"}
          />
        ))}
      </div>
      <span className="text-xs text-neutral-500 whitespace-nowrap">
        ({formatFaNumber(reviewsCount)} نظر)
      </span>
    </div>
  );
}
