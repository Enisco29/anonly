import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI, tagsAPI } from '../services/api';
import './PostForm.css';

const PostForm = () => {
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('general');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await tagsAPI.getAll();
      setTags(response.data);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!content.trim()) {
      setError('Please enter a message');
      return;
    }

    if (content.length > 500) {
      setError('Message must be 500 characters or less');
      return;
    }

    setLoading(true);

    try {
      await postsAPI.create({ content: content.trim(), tag });
      setSuccess(true);
      setContent('');
      setTag('general');
      setTimeout(() => {
        navigate('/wall');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-form-page">
      <div className="container">
        <div className="post-form-container">
          <h1>Post a Message</h1>
          <p className="form-subtitle">Share your thoughts anonymously</p>

          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label htmlFor="content">Your Message</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={6}
                maxLength={500}
                required
              />
              <div className="char-count">
                {content.length}/500 characters
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tag">Category (Optional)</label>
              <select
                id="tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                <option value="general">General</option>
                <option value="fun">Fun</option>
                <option value="rant">Rant</option>
                <option value="question">Question</option>
                <option value="advice">Advice</option>
                <option value="confession">Confession</option>
                {tags
                  .filter(t => !['general', 'fun', 'rant', 'question', 'advice', 'confession'].includes(t.name))
                  .map(t => (
                    <option key={t.name} value={t.name}>
                      {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
                    </option>
                  ))}
              </select>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && (
              <div className="alert alert-success">
                Post submitted successfully! Redirecting to wall...
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || success}
            >
              {loading ? 'Submitting...' : 'Submit Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostForm;

