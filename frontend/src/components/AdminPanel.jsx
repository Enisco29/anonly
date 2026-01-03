import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, postsAPI } from '../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await adminAPI.verify();
      if (response.data.valid) {
        setIsAuthenticated(true);
        fetchData();
      }
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  const fetchData = async () => {
    try {
      const [analyticsRes, postsRes] = await Promise.all([
        adminAPI.analytics(),
        postsAPI.getAll({ limit: 50 })
      ]);
      setAnalytics(analyticsRes.data);
      setPosts(postsRes.data.posts);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminAPI.login({ username, password });
      localStorage.setItem('adminToken', response.data.token);
      setIsAuthenticated(true);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setAnalytics(null);
    setPosts([]);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postsAPI.delete(postId);
      setPosts(posts.filter(p => p._id !== postId));
      if (analytics) {
        setAnalytics({
          ...analytics,
          totalPosts: analytics.totalPosts - 1
        });
      }
    } catch (err) {
      alert('Failed to delete post');
      console.error('Error deleting post:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-panel">
        <div className="container">
          <div className="admin-login">
            <h1>Admin Login</h1>
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>

        {analytics && (
          <div className="analytics-section">
            <h2>Analytics</h2>
            <div className="analytics-grid">
              <div className="stat-card">
                <h3>Total Posts</h3>
                <p className="stat-number">{analytics.totalPosts}</p>
              </div>
              <div className="stat-card">
                <h3>Posts Today</h3>
                <p className="stat-number">{analytics.postsToday}</p>
              </div>
              <div className="stat-card">
                <h3>Posts This Week</h3>
                <p className="stat-number">{analytics.postsThisWeek}</p>
              </div>
            </div>

            <div className="popular-tags">
              <h3>Popular Tags</h3>
              <div className="tags-list">
                {analytics.popularTags.map(tag => (
                  <div key={tag.name} className="tag-item">
                    <span className="tag-name">{tag.name}</span>
                    <span className="tag-count">{tag.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="posts-section">
          <h2>Recent Posts</h2>
          <div className="admin-posts-list">
            {posts.map(post => (
              <div key={post._id} className="admin-post-card">
                <div className="admin-post-header">
                  <span className="admin-post-tag">{post.tag}</span>
                  <span className="admin-post-date">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="admin-post-content">{post.content}</div>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

