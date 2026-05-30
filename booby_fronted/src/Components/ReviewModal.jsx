import { useState, useEffect } from "react";
import { X, Star } from "lucide-react";

const ReviewModal = ({ onClose }) => {
  const [rating, setRating, ] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [quote, setQuote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  // Check if user already reviewed on mount
  useEffect(() => {
    const checkReview = async () => {
      try {
        const res = await fetch("http://localhost:5000/userReviews");
        const data = await res.json();
        const exists = data.some(r => r.userId === user?.id);
        if (exists) {
          onClose(); // silently close — already reviewed
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };
    checkReview();
  }, []);

  const handleSubmit = async () => {
    if (!quote.trim() || rating === 0) return;

    const newReview = {
      userId: user?.id,
      name: user?.name || "Anonymous",
      location: user?.city || "India",
      quote,
      rating,
    };

    await fetch("http://localhost:5000/userReviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    });

    setSubmitted(true);
    setTimeout(() => onClose(), 1800);
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center 
    justify-center px-4">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 
      w-full max-w-md shadow-xl relative animate-fadeIn">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 
          hover:text-gray-600 dark:hover:text-white transition"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">🎉</p>
            <h3 className="text-lg font-semibold text-[#4B2E2B] dark:text-white mb-1">
              Thank you for your review!
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your experience helps others make better decisions.
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-[#4B2E2B] 
            dark:text-white mb-1">
              How was your experience? 😊
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Share your honest feedback about Homie Furniture Rentals.
            </p>

            {/* Star Rating */}
            <div className="flex gap-2 mb-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={30}
                    className={`transition-all duration-150 ${
                      star <= (hovered || rating)
                        ? "fill-[#bf6f32] text-[#bf6f32] scale-110"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Review Text */}
            <textarea
              rows={4}
              placeholder="Tell us what you loved (or what we can improve)..."
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-600
              bg-transparent rounded-xl p-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#bf6f32]/40
              resize-none mb-4 dark:text-white placeholder:text-gray-400"
            />

            <button
              onClick={handleSubmit}
              disabled={!quote.trim() || rating === 0}
              className="w-full py-2.5 rounded-full bg-[#bf6f32] text-white
              font-semibold text-sm hover:bg-[#a95c27] transition
              disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;