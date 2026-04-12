import React from 'react';

// Define the interface for your review data
interface MusicReview {
  id: number;
  title: string;
  image_url: string;
  summary: string;
  keywords: string;
}

interface MusicReviewCardProps {
  review: MusicReview;
  onClick: () => void; // Function to call when clicked
}

const MusicReviewCard: React.FC<MusicReviewCardProps> = ({ review, onClick }) => {
  return (
    <div className="music-card" onClick={onClick}>
      <img src={review.image_url} alt={review.title} className="artist-image" />
      <h3>{review.title}</h3>
      <p>{review.summary}</p>
    </div>
  );
};

export default MusicReviewCard;