import React, { useState, useEffect, useCallback } from 'react';
import { postsAPI, tagsAPI, reactionsAPI } from '../services/api';
import PostCard from './PostCard';
import './Wall.css';

const Wall = () => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTags();
    fetchPosts(1, true);
  }, []);

  useEffect(() => {
    if (selectedTag || searchQuery) {
      fetchPosts(1, true);
    }
  }, [selectedTag, searchQuery]);

  const fetchTags = async () => {
    try {
      const response = await tagsAPI.getAll();
      setTags(response.data);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  const fetchPosts = async (pageNum, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = {
        page: pageNum,
        limit: 20,
        ...(selectedTag && { tag: selectedTag }),
        ...(searchQuery && { search: searchQuery })
      };

      const response = await postsAPI.getAll(params);
      const newPosts = response.data.posts;

      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      setHasMore(pageNum < response.data.pagination.pages);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1);
    }
  };

  const handleReaction = async (postId, type) => {
    try {
      const response = await reactionsAPI.add(postId, type);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? { ...post, reactions: response.data.reactions }
            : post
        )
      );
    } catch (err) {
      console.error('Error adding reaction:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(1, true);
  };

  if (loading) {
    return (
      <div className="wall-page">
        <div className="container">
          <div className="loading-spinner">Loading posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="wall-page">
      <div className="container">
        <h1>Anonymous Wall</h1>
        <p className="wall-subtitle">Read what others are sharing</p>

        <div className="wall-filters">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          <div className="tag-filters">
            <button
              className={`tag-filter ${selectedTag === '' ? 'active' : ''}`}
              onClick={() => setSelectedTag('')}
            >
              All
            </button>
            {tags.slice(0, 10).map(tag => (
              <button
                key={tag.name}
                className={`tag-filter ${selectedTag === tag.name ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag.name)}
              >
                {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)} ({tag.count})
              </button>
            ))}
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="posts-grid">
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>No posts found. Be the first to share something!</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post._id}
                post={post}
                onReaction={handleReaction}
              />
            ))
          )}
        </div>

        {hasMore && (
          <div className="load-more-container">
            <button
              onClick={handleLoadMore}
              className="btn btn-secondary"
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wall;

