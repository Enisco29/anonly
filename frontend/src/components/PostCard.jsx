import React from 'react';
import { FiHeart, FiSmile, FiMeh, FiFrown } from 'react-icons/fi';
import { FaHeart, FaLaugh, FaSurprise, FaSadTear, FaAngry } from 'react-icons/fa';
import './PostCard.css';

const PostCard = ({ post, onReaction }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const reactions = post.reactions || {};
  const reactionTypes = [
    { key: 'like', label: 'Like', icon: FiHeart, iconFilled: FaHeart },
    { key: 'love', label: 'Love', icon: FiHeart, iconFilled: FaHeart },
    { key: 'laugh', label: 'Laugh', icon: FiSmile, iconFilled: FaLaugh },
    { key: 'wow', label: 'Wow', icon: FiMeh, iconFilled: FaSurprise },
    { key: 'sad', label: 'Sad', icon: FiFrown, iconFilled: FaSadTear },
    { key: 'angry', label: 'Angry', icon: FiFrown, iconFilled: FaAngry }
  ];

  return (
    <div className="post-card">
      <div className="post-header">
        <span className="post-tag">{post.tag || 'general'}</span>
        <span className="post-date">{formatDate(post.createdAt)}</span>
      </div>
      <div className="post-content">{post.content}</div>
      <div className="post-reactions">
        {reactionTypes.map(({ key, label, icon: Icon, iconFilled: IconFilled }) => {
          const count = reactions[key] || 0;
          if (count === 0) return null;
          return (
            <button
              key={key}
              className="reaction-btn"
              onClick={() => onReaction(post._id, key)}
              title={label}
            >
              <IconFilled className="reaction-icon" />
              <span>{count}</span>
            </button>
          );
        })}
        <div className="reaction-add">
          {reactionTypes.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className="reaction-add-btn"
              onClick={() => onReaction(post._id, key)}
              title={label}
            >
              <Icon />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;

