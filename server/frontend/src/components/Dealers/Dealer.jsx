import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(null);

  let { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dealerResponse = await fetch(`/djangoapp/dealer/${id}`);
        const dealerData = await dealerResponse.json();
        if (dealerData.status === 200) {
          setDealer(dealerData.dealer);
        }
  
        const reviewsResponse = await fetch(`/djangoapp/reviews/dealer/${id}`);
        const reviewsData = await reviewsResponse.json();
        if (reviewsData.status === 200) {
          if (reviewsData.reviews.length > 0) {
            setReviews(reviewsData.reviews);
          } else {
            setUnreviewed(true);
          }
        }
  
        if (sessionStorage.getItem("username")) {
          setPostReview(
            <a href={`/postreview/${id}`}>
              <img src={review_icon} style={{ width: '10%', marginLeft: '10px', marginTop: '10px' }} alt='Post Review' />
            </a>
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [id]);

  const senti_icon = (sentiment) => {
    let icon = sentiment === "positive" ? positive_icon : sentiment === "negative" ? negative_icon : neutral_icon;
    return icon;
  };

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>{dealer.full_name || 'Loading...'}{postReview}</h1>
        <h4 style={{ color: "grey" }}>{dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}</h4>
      </div>
      <div className="reviews_panel">
        {reviews.length === 0 && !unreviewed ? (
          <p>Loading Reviews....</p>
        ) : unreviewed ? (
          <p>No reviews yet!</p>
        ) : reviews.map(review => (
          <div key={review.id} className='review_panel'>
            <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment' />
            <div className='review'>{review.review}</div>
            <div className="reviewer">{review.name} {review.car_make} {review.car_model} {review.car_year}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dealer;
