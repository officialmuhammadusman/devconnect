import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaSpinner, FaHeart, FaComment, FaShare, FaRegCommentDots, FaCalendarAlt } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const Feed = () => {
  const { token, loading: authLoading, getFeedPosts } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !token) {
      navigate("/login");
    }
  }, [token, authLoading, navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!token || authLoading) return;

      setIsLoading(true);
      setError("");

      const result = await getFeedPosts();

      setIsLoading(false);

      if (result.success && Array.isArray(result.posts)) {
        setPosts(result.posts);
      } else {
        setError(result.message || "Failed to load posts");
        setPosts([]); // Ensure posts is an empty array on failure
      }
    };

    fetchPosts();
  }, [token, authLoading, getFeedPosts]);

  if (authLoading && !token) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="relative overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-3xl"></div>
          <div className="relative text-center py-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Your Feed
            </h1>
            <p className="text-slate-300 mt-2">Stay updated with posts from developers you follow</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-xl text-sm border border-red-500/30 mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center">
            <FaSpinner className="w-12 h-12 text-cyan-400 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 text-center border border-slate-700/50">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaRegCommentDots className="text-slate-400 text-2xl" />
            </div>
            <p className="text-slate-300 mb-4">
              No posts to show. Follow some developers or create a post!
            </p>
            <Link
              to="/create-post"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium shadow-lg shadow-cyan-500/25"
            >
              Create a Post
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post._id}
                className="bg-slate-700/30 backdrop-blur-lg rounded-xl p-6 border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {post.user.profileImage ? (
                    <img
                      src={post.user.profileImage}
                      alt={post.user.fullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                      <FaUserCircle className="text-white text-lg" />
                    </div>
                  )}
                  <div className="ml-4 flex-1">
                    <Link
                      to={`/my-profile/${post.user._id}`}
                      className="text-white font-semibold hover:text-cyan-400 transition-colors duration-200"
                    >
                      {post.user.fullName || "Anonymous"}
                    </Link>
                    <div className="flex items-center text-slate-400 text-sm mt-1">
                      <FaCalendarAlt className="mr-1" />
                      <span>{dayjs(post.createdAt).fromNow()}</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-200 leading-relaxed mb-4">{post.text}</p>
                {post.image && (
                  <div className="rounded-lg overflow-hidden border border-slate-600">
                    <img
                      src={post.image}
                      alt="Post content"
                      className="w-full h-auto max-h-96 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex items-center space-x-6 text-slate-400 text-sm border-t border-slate-600/50 pt-4">
                  <button className="flex items-center hover:text-red-400 transition-colors duration-200">
                    <FaHeart className="mr-2" /> Like
                  </button>
                  <button className="flex items-center hover:text-blue-400 transition-colors duration-200">
                    <FaComment className="mr-2" /> Comment
                  </button>
                  <button className="flex items-center hover:text-green-400 transition-colors duration-200">
                    <FaShare className="mr-2" /> Share
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;