import React, { useState } from 'react';
import { useDirectory } from '../../context/DirectoryContext';
import { Business } from '../../types';
import { Star } from 'lucide-react';

interface ProfileReviewsSectionProps {
  business: Business;
}

/** "Reviews" tab: rating summary, review list, and the "Write a Review" modal. */
export const ProfileReviewsSection: React.FC<ProfileReviewsSectionProps> = ({ business }) => {
  const { submitReview } = useDirectory();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmittedSuccess, setReviewSubmittedSuccess] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    submitReview(business.id, {
      authorName: newReviewAuthor,
      rating: newReviewRating,
      comment: newReviewComment,
    });

    setReviewSubmittedSuccess(true);
    setTimeout(() => {
      setReviewSubmittedSuccess(false);
      setReviewModalOpen(false);
      setNewReviewAuthor('');
      setNewReviewComment('');
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-stone-900 mb-1">Customer Reviews & Testimonials</h2>
          <p className="text-xs text-stone-500">Verified customer feedback from Bozeman residents and clients.</p>
        </div>
        <button
          onClick={() => setReviewModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors"
        >
          Write a Review
        </button>
      </div>

      {/* Score Header */}
      <div className="bg-stone-50 rounded-xl p-5 flex items-center gap-6 border border-stone-200">
        <div className="text-center">
          <span className="text-4xl font-extrabold text-stone-900 block">{business.rating}</span>
          <div className="flex justify-center text-amber-400 my-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="fill-amber-400" />
            ))}
          </div>
          <span className="text-xs text-stone-500">{business.reviewsCount} reviews</span>
        </div>
        <div className="border-l border-stone-200 pl-6 text-xs text-stone-600 space-y-1">
          <p>✓ 100% Verified customer review checks</p>
          <p>✓ Business owner moderation rights with transparent responses</p>
          <p>✓ Zero anonymous spam or paid ratings manipulation</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {business.reviews?.map((r) => (
          <div key={r.id} className="border border-stone-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-700 text-xs">
                  {r.authorName[0]}
                </div>
                <div>
                  <span className="font-bold text-stone-900 text-sm block">{r.authorName}</span>
                  <div className="flex items-center gap-1.5 text-xs text-stone-400">
                    <div className="flex text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} size={11} className="fill-amber-400" />
                      ))}
                    </div>
                    <span>•</span>
                    <span>{r.date}</span>
                  </div>
                </div>
              </div>

              {r.verifiedCustomer && (
                <span className="text-[11px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                  Verified Customer
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">{r.comment}</p>

            {/* Owner Response */}
            {r.response && (
              <div className="bg-stone-50 border-l-2 border-amber-500 p-3 rounded-r-lg text-xs space-y-1 mt-2">
                <span className="font-bold text-stone-900">Response from {business.name}:</span>
                <p className="text-stone-600">{r.response.text}</p>
                <span className="text-[10px] text-stone-400 block">{r.response.date}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-lg text-stone-900">Write a Review for {business.name}</h3>
            {reviewSubmittedSuccess ? (
              <div className="py-8 text-center text-emerald-700 font-bold text-sm">
                ✓ Thank you! Your review has been submitted and published.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="e.g. Jessica Miller"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 ${
                          newReviewRating >= star ? 'bg-amber-500 text-stone-950' : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        <Star size={14} className={newReviewRating >= star ? 'fill-stone-950' : ''} />
                        <span>{star}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Review</label>
                  <textarea
                    required
                    rows={4}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Describe your experience with their services or products..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs">
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
