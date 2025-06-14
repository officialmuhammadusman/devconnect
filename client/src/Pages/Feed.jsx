import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom"; // Added useLocation for context
import { useAuth } from "../context/AuthContext";
import {
  FaUserCircle,
  FaSpinner,
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShare,
  FaRegCommentDots,
  FaCalendarAlt,
  FaEdit,
  FaTrashAlt,
  FaTimes,
  FaPaperPlane,
  FaRetweet,
} from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "react-toastify";

dayjs.extend(relativeTime);

const Feed = () => {
  const {
    user,
    token,
    loading: authLoading,
    getFeedPosts,
    likePost,
    sharePost,
    editPost,
    deletePost,
    commentOnPost,
    initiateChat,
  } = useAuth();

  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editText, setEditText] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [previewEditImage, setPreviewEditImage] = useState("");

  // State for delete confirmation modal
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);

  // State for new comment text, mapped by postId
  const [newCommentTexts, setNewCommentTexts] = useState({});

  // State for sharing posts
  const [sharingPostId, setSharingPostId] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !token) {
      navigate("/login");
    }
  }, [token, authLoading, navigate]);

  // Fetch posts on component mount or token change
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
        setPosts([]);
      }
    };

    fetchPosts();
  }, [token, authLoading, getFeedPosts]);

  // Handle post like/unlike
  const handleLikePost = async (postId) => {
    if (!user) {
      toast.warn("Please log in to like posts.");
      return;
    }

    const result = await likePost(postId);

    if (result.success) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: result.likes } : post
        )
      );
    }
  };

  // Handle post sharing to user's profile
  const handleSharePost = async (postId) => {
    if (!user) {
      toast.warn("Please log in to share posts.");
      return;
    }

    // Prevent sharing own posts
    const originalPost = posts.find((p) => p._id === postId);
    if (originalPost && originalPost.user._id === user._id) {
      toast.info("You cannot share your own posts.");
      return;
    }

    setSharingPostId(postId);

    try {
      const result = await sharePost(postId);

      if (result.success) {
        // Re-fetch the feed to show the newly shared post
        const updatedFeed = await getFeedPosts();
        if (updatedFeed.success) {
          setPosts(updatedFeed.posts);
        }
        
        toast.success("Post shared to your profile successfully!");
      } else {
        toast.error(result.message || "Failed to share post.");
      }
    } catch (error) {
      toast.error("An error occurred while sharing the post.");
    } finally {
      setSharingPostId(null);
    }
  };

  // Handle new comment input change
  const handleCommentChange = (postId, text) => {
    setNewCommentTexts((prev) => ({ ...prev, [postId]: text }));
  };

  // Handle adding a new comment
  const handleAddComment = async (postId) => {
    if (!user) {
      toast.warn("Please log in to comment.");
      return;
    }
    const commentText = newCommentTexts[postId]?.trim();
    if (!commentText) {
      toast.error("Comment cannot be empty.");
      return;
    }

    const result = await commentOnPost(postId, { text: commentText });

    if (result.success) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: result.comment.comments }
            : post
        )
      );
      setNewCommentTexts((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  // Open edit modal
  const openEditModal = (post) => {
    setEditingPost(post);
    setEditText(post.text);
    setPreviewEditImage(post.image || "");
    setEditImageFile(null);
    setShowEditModal(true);
  };

  // Handle image file change in edit modal
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditImageFile(file);
    if (file) {
      setPreviewEditImage(URL.createObjectURL(file));
    } else {
      setPreviewEditImage(editingPost.image || "");
    }
  };

  // Save edited post
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingPost) return;

    const formData = new FormData();
    formData.append("text", editText);
    if (editImageFile) {
      formData.append("image", editImageFile);
    } else if (previewEditImage === "" && editingPost.image) {
      formData.append("removeImage", "true");
    }

    const result = await editPost(editingPost._id, formData);

    if (result.success) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === editingPost._id ? { ...post, ...result.post } : post
        )
      );
      setShowEditModal(false);
      setEditingPost(null);
      setEditText("");
      setEditImageFile(null);
      setPreviewEditImage("");
    }
  };

  // Open delete confirmation modal
  const openDeleteConfirmModal = (postId) => {
    setDeletingPostId(postId);
    setShowDeleteConfirmModal(true);
  };

  // Confirm and delete post
  const handleConfirmDelete = async () => {
    if (!deletingPostId) return;

    const result = await deletePost(deletingPostId);

    if (result.success) {
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== deletingPostId)
      );
      setShowDeleteConfirmModal(false);
      setDeletingPostId(null);
    }
  };

  // Helper function to render shared post indicator
  const renderSharedPostHeader = (post) => {
    if (post.isShared && post.originalPost) {
      return (
        <div className="flex items-center mb-3 text-slate-400 text-sm border-b border-slate-600/30 pb-3">
          <FaRetweet className="mr-2 text-cyan-400" />
          <span>
            <Link
              to={`/my-profile/${post.user._id}`}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              {post.user.fullName || "Anonymous"}
            </Link>
            {" shared this post"}
          </span>
        </div>
      );
    }
    return null;
  };

  // Helper function to get the display post (original or current)
  const getDisplayPost = (post) => {
    return post.isShared && post.originalPost ? post.originalPost : post;
  };

  if (authLoading && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <FaSpinner className="w-16 h-16 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-3xl mx-auto">
        <div className="relative overflow-hidden mb-8 rounded-xl shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-3xl"></div>
          <div className="relative text-center py-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Your Feed
            </h1>
            <p className="text-slate-300 mt-2">
              Stay updated with posts from developers you follow
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-xl text-sm border border-red-500/30 mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-10">
            <FaSpinner className="w-12 h-12 text-cyan-400 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 text-center border border-slate-700/50 shadow-xl">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaRegCommentDots className="text-slate-400 text-2xl" />
            </div>
            <p className="text-slate-300 mb-4 text-lg">
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
            {posts.map((post) => {
              const displayPost = getDisplayPost(post);
              const isUserPost = user && displayPost.user._id === user._id;
              const isSharedPost = post.isShared && post.originalPost;
              
              return (
                <article
                  key={post._id}
                  className="bg-slate-700/30 backdrop-blur-lg rounded-xl p-6 border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-300 shadow-lg"
                >
                  {renderSharedPostHeader(post)}
                  
                  <div className="flex items-center mb-4">
                    {displayPost.user.profileImage ? (
                      <img
                        src={displayPost.user.profileImage}
                        alt={displayPost.user.fullName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/48x48/64748b/ffffff?text=${displayPost.user.fullName?.[0] || '?'}`;
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                        <FaUserCircle className="text-white text-lg" />
                      </div>
                    )}
                    <div className="ml-4 flex-1">
                      <Link
                        to={`/my-profile/${displayPost.user._id}`}
                        className="text-white font-semibold hover:text-cyan-400 transition-colors duration-200"
                      >
                        {displayPost.user.fullName || "Anonymous"}
                      </Link>
                      <div className="flex items-center text-slate-400 text-sm mt-1">
                        <FaCalendarAlt className="mr-1" />
                        <span>{dayjs(displayPost.createdAt).fromNow()}</span>
                        {isSharedPost && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="text-cyan-400">Shared {dayjs(post.createdAt).fromNow()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {!isSharedPost && isUserPost && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(post)}
                          className="p-2 rounded-full text-slate-400 hover:text-blue-400 hover:bg-slate-600/50 transition-colors duration-200"
                          title="Edit Post"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => openDeleteConfirmModal(post._id)}
                          className="p-2 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-600/50 transition-colors duration-200"
                          title="Delete Post"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-slate-200 leading-relaxed mb-4">
                    {displayPost.text}
                  </p>
                  
                  {displayPost.image && (
                    <div className="rounded-lg overflow-hidden border border-slate-600 mb-4">
                      <img
                        src={displayPost.image}
                        alt="Post content"
                        className="w-full h-auto max-h-96 object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/600x400/334155/ffffff?text=Image+Load+Error";
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-6 text-slate-400 text-sm border-t border-slate-600/50 pt-4">
                    <button
                      onClick={() => handleLikePost(isSharedPost ? post.originalPost._id : post._id)}
                      className={`flex items-center transition-colors duration-200 ${
                        user && displayPost.likes.includes(user._id)
                          ? "text-red-500 hover:text-red-600"
                          : "hover:text-red-400"
                      }`}
                    >
                      {user && displayPost.likes.includes(user._id) ? (
                        <FaHeart className="mr-2 text-xl" />
                      ) : (
                        <FaRegHeart className="mr-2 text-xl" />
                      )}
                      {displayPost.likes.length} Like{displayPost.likes.length !== 1 ? 's' : ''}
                    </button>
                    
                    <button className="flex items-center hover:text-blue-400 transition-colors duration-200">
                      <FaComment className="mr-2" /> 
                      {displayPost.comments?.length || 0} Comment{(displayPost.comments?.length || 0) !== 1 ? 's' : ''}
                    </button>
                    
                    {user && displayPost.user._id !== user._id && (
                      <button
                        onClick={() => handleSharePost(isSharedPost ? post.originalPost._id : post._id)}
                        disabled={sharingPostId === (isSharedPost ? post.originalPost._id : post._id)}
                        className="flex items-center hover:text-green-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sharingPostId === (isSharedPost ? post.originalPost._id : post._id) ? (
                          <FaSpinner className="mr-2 animate-spin" />
                        ) : (
                          <FaShare className="mr-2" />
                        )}
                        Share
                      </button>
                    )}
                  </div>

                  <div className="mt-6 border-t border-slate-600/50 pt-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Comments</h3>
                    {displayPost.comments && displayPost.comments.length > 0 ? (
                      <div className="space-y-3">
                        {displayPost.comments.map((comment) => (
                          <div key={comment._id} className="flex items-start">
                            {comment.user?.profileImage ? (
                              <img
                                src={comment.user.profileImage}
                                alt={comment.user.fullName}
                                className="w-8 h-8 rounded-full object-cover border border-slate-600 flex-shrink-0"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://placehold.co/32x32/64748b/ffffff?text=${comment.user.fullName?.[0] || '?'}`;
                                }}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                                <FaUserCircle className="text-slate-300 text-sm" />
                              </div>
                            )}
                            <div className="ml-3 bg-slate-700/50 p-3 rounded-lg flex-1">
                              <div className="flex items-center justify-between">
                                <Link
                                  to={`/my-profile/${comment.user?._id}`}
                                  className="text-white font-semibold text-sm hover:text-cyan-400"
                                >
                                  {comment.user?.fullName || "Anonymous"}
                                </Link>
                                <span className="text-slate-400 text-xs">
                                  {dayjs(comment.createdAt).fromNow()}
                                </span>
                              </div>
                              <p className="text-slate-200 text-sm mt-1">
                                {comment.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm">No comments yet. Be the first to comment!</p>
                    )}

                    <div className="mt-4 flex items-center space-x-3">
                      <textarea
                        value={newCommentTexts[isSharedPost ? post.originalPost._id : post._id] || ""}
                        onChange={(e) => handleCommentChange(isSharedPost ? post.originalPost._id : post._id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(isSharedPost ? post.originalPost._id : post._id);
                          }
                        }}
                        className="flex-1 p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none h-auto overflow-hidden"
                        placeholder="Add a comment..."
                        rows="1"
                      ></textarea>
                      <button
                        onClick={() => handleAddComment(isSharedPost ? post.originalPost._id : post._id)}
                        className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md"
                        title="Add Comment"
                      >
                        <FaPaperPlane />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {showEditModal && editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-slate-700 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Edit Your Post
            </h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label
                  htmlFor="editText"
                  className="block text-slate-300 text-sm font-medium mb-2"
                >
                  Post Text:
                </label>
                <textarea
                  id="editText"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-y"
                  rows="4"
                  placeholder="What's on your mind?"
                  required
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="editImage"
                  className="block text-slate-300 text-sm font-medium mb-2"
                >
                  Change Image:
                </label>
                <input
                  type="file"
                  id="editImage"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="w-full text-slate-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-cyan-500 file:to-blue-500 file:text-white hover:file:from-cyan-600 hover:file:to-blue-600 cursor-pointer"
                />
                {previewEditImage && (
                  <div className="mt-4 relative">
                    <img
                      src={previewEditImage}
                      alt="Image Preview"
                      className="w-full h-48 object-cover rounded-lg border border-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewEditImage("")}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                      title="Remove Image"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 font-medium shadow-lg shadow-green-500/25"
              >
                <FaPaperPlane className="mr-2" /> Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm p-6 border border-slate-700 relative text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Confirm Deletion</h2>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-all duration-300 font-medium shadow-lg shadow-red-600/25"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;