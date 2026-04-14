import React, { useState, useEffect } from 'react';
import MusicReviewCard from '../components/MusicReviewCard';
import './MusicEvaluations.css'; // We will create this next

// Define the interface for the full review with content
interface FullMusicReview {
  id: number;
  title: string;
  image_url: string;
  summary: string;
  keywords: string;
  full_content: string;
  created_at: string;
}

const MusicEvaluations: React.FC = () => {
  const [reviews, setReviews] = useState<FullMusicReview[]>([]);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  useEffect(() => {
  // Added a / at the end of the URL
  fetch(`${import.meta.env.VITE_API_URL}/api/music_reviews/`)
    .then(response => response.json())
    .then(data => setReviews(data))
    .catch(err => console.error("Fetch error:", err));
}, []);

  // Find the full review object based on the selected ID
  const selectedReview = reviews.find(review => review.id === selectedReviewId);

  return (
    <div className="evaluations-container">
      <h1>LTH's take on some pieces of music</h1>

      {/* Grid View */}
      <div className="reviews-grid">
        {reviews.map(review => (
          <MusicReviewCard 
            key={review.id} 
            review={review} 
            onClick={() => setSelectedReviewId(review.id)} // Open detail view
          />
        ))}
      </div>

      {/* Detail View (Modal) */}
      {selectedReview && (
        <div className="detail-modal" onClick={() => setSelectedReviewId(null)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedReviewId(null)}>&times;</button>
            
            <div className="modal-grid-layout">
              {/* LEFT COLUMN: Image and Keywords */}
              <div className="modal-left-col">
                <img src={selectedReview.image_url} alt={selectedReview.title} className="detail-artist-image" />
                
                <div className="modal-keywords">
                  <h3>KEYWORDS</h3>
                  <ul className="keywords-list">
                    {/* The ( ... || "") ensures it never tries to split 'undefined' */}
                    {(selectedReview.keywords || "").split('::').map((keyword, index) => (
                        /* Only render the <li> if the keyword isn't blank */
                        keyword ? <li key={index}>{keyword}</li> : null
                    ))}
                    </ul>
                </div>
              </div>

              {/* RIGHT COLUMN: Title and Full Details */}
              <div className="modal-right-col">
                <h2 className="modal-title">{selectedReview.title}</h2>
                {selectedReview.created_at && (
                  <p className="review-date">
                     {new Date(selectedReview.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
                
                <div className="full-content">
                    {/* Added the same fallback here */}
                    {(selectedReview.full_content || "").split('\n').map((paragraph, index) => (
                        <p key={index}>
                        {paragraph}
                        <br />
                        </p>
                    ))}
                    </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default MusicEvaluations;