import React, { useState, useEffect } from 'react';
import MusicReviewCard from './MusicReviewCard';
import './MusicEvaluations.css'; // We will create this next

// Define the interface for the full review with content
interface FullMusicReview {
  id: number;
  title: string;
  image_url: string;
  summary: string;
  keywords: string;
  full_content: string;
}

const MusicEvaluations: React.FC = () => {
  const [reviews, setReviews] = useState<FullMusicReview[]>([]);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch all reviews from your new backend endpoint
    fetch(`${import.meta.env.VITE_API_URL}/api/music_reviews`)
      .then(response => response.json())
      .then(data => setReviews(data));
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
        <div className="detail-modal" onClick={() => setSelectedReviewId(null)}> {/* Click outside to close */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevent clicks on content from closing */}
            <button className="close-button" onClick={() => setSelectedReviewId(null)}>&times;</button>
            <div className="modal-inner">
                <img src={selectedReview.image_url} alt={selectedReview.title} className="detail-artist-image" />
                <div className="detail-info">
                    <h2>{selectedReview.title}</h2>
                    <p className="full-content">{selectedReview.full_content}</p>
                    
                    {/* Parse the delimited keyword string */}
                    <h3>KEYWORDS</h3>
                    <ul className="keywords-list">
                      {selectedReview.keywords.split('::').map((keyword, index) => (
                        <li key={index}>{keyword}</li>
                      ))}
                    </ul>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicEvaluations;