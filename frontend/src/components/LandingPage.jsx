import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="container">
        <div className="landing-content">
          <h1 className="landing-title">Anonymous Wall</h1>
          <p className="landing-subtitle">
            Share your thoughts, questions, rants, or anything on your mind.
            <br />
            Completely anonymous. No registration required.
          </p>
          <div className="landing-cta">
            <Link to="/post" className="btn btn-primary">
              Post a Message
            </Link>
            <Link to="/wall" className="btn btn-secondary">
              View Wall
            </Link>
          </div>
          <div className="landing-features">
            <div className="feature">
              <h3>100% Anonymous</h3>
              <p>No accounts, no tracking, no personal information</p>
            </div>
            <div className="feature">
              <h3>Free Expression</h3>
              <p>Share your thoughts without fear of judgment</p>
            </div>
            <div className="feature">
              <h3>Community Driven</h3>
              <p>Read and react to posts from others</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

