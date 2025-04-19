import React from 'react';
import { FaBook } from 'react-icons/fa';
import './LoadingScreen.css';

interface LoadingScreenProps {
  fullScreen?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ fullScreen = false }) => {
  return (
    <div className={`loading-overlay ${fullScreen ? 'full-screen' : ''}`}>
      <div className="loading-content">
        <div className="book-loader">
          <FaBook className="book-icon" />
        </div>
        <div className="loading-text">Loading your books...</div>
      </div>
    </div>
  );
};

export default LoadingScreen; 