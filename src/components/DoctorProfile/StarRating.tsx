import { FaStar } from "react-icons/fa6";

// 🌟 StarRating Component
const StarRating = ({ rating, reviewsCount }: { rating: number; reviewsCount: number }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i < rating);

  return (
    <div className="flex items-center gap-x-1.5 flex-wrap">
      <div
        className="flex flex-row-reverse justify-end items-center gap-x-1 shrink-0"
        role="img"
        aria-label={`امتیاز ${rating} از ۵`}
      >
        {stars.map((filled, index) => (
          <FaStar
            key={index}
            color={filled ? '#FFB800' : '#D1D1D1'}
            size={12}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="text-xs text-neutral-500 whitespace-nowrap">
        ({reviewsCount.toLocaleString('fa-IR')} نظر)
      </span>
    </div>
  );
};

export default StarRating;
