import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  FaUserCircle,
  FaCode,
  FaMapMarkerAlt,
  FaUsers,
  FaUserPlus,
  FaUserMinus,
  FaEdit,
  FaSpinner,
  FaRegCommentDots,
  FaCalendarAlt,
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShare,
  FaEnvelope,
  FaTimes,
  FaPaperPlane,
  FaTrashAlt,
} from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const MyProfile = () => {
  const { id: profileId } = useParams();
  const navigate = useNavigate();
  const {
    user,
    token,
    loading: authLoading,
    getUserProfile,
    getUserPosts,
    initiateChat,
    followUser,
    unfollowUser,
    likePost,
    commentOnPost,
    sharePost,
    editPost,
    deletePost,
  } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editText, setEditText] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [previewEditImage, setPreviewEditImage] = useState("");

  // State for delete confirmation modal
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);

  // State for new comment text
  const [newCommentTexts, setNewCommentTexts] = useState({});

  useEffect(() => {
    if (!token || authLoading) {
      if (!authLoading) {
        navigate("/login", { state: { redirect: `/my-profile/${profileId}` } });
      }
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const targetUserId = profileId || user?._id;
        if (!targetUserId) {
          throw new Error("User ID not available.");
        }

        const profileResult = await getUserProfile(targetUserId);
        if (!profileResult?.success) {
          throw new Error(profileResult?.message || "Failed to load profile");
        }
        const userProfile = profileResult?.user || {};
        setProfile({
          ...userProfile,
          followersCount: userProfile?.followers?.length || 0,
          followingCount: userProfile?.following?.length || 0,
        });
        setIsFollowing(userProfile?.followers?.includes(user?._id) || false);

        const postsResult = await getUserPosts(targetUserId);
        if (!postsResult?.success) {
          throw new Error(postsResult?.message || "Failed to load posts");
        }
        setPosts(postsResult?.posts || []);
      } catch (err) {
        const errorMessage = err.message || "Failed to load profile data";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [profileId, user, token, navigate, getUserProfile, getUserPosts, authLoading]);

  const handleMessageUser = async () => {
    if (!user) {
      toast.info("Please login to start chatting.");
      return;
    }
    if (!profile) {
      toast.error("Profile data not available to start chat.");
      return;
    }
    if (user._id === profile._id) {
      toast.info("You cannot chat with yourself.");
      return;
    }
    try {
      const result = await initiateChat(profile._id);
      if (result.success) {
        navigate("/chat", { state: { targetChatId: result.chat._id, targetUserId: profile._id } });
      }
    } catch (err) {
      // Error handled by AuthContext
    }
  };

  const handleFollowToggle = async () => {
    if (isProcessing || !profile?._id || !user?._id) return;
    setIsProcessing(true);
    try {
      const result = isFollowing
        ? await unfollowUser(profile._id)
        : await followUser(profile._id);

      if (result.success) {
        setProfile((prev) => ({
          ...prev,
          followersCount: isFollowing
            ? (prev?.followersCount || 0) - 1
            : (prev?.followersCount || 0) + 1,
        }));
        setIsFollowing(!isFollowing);
      }
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setIsProcessing(false);
    }
  };

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

  const handleCommentChange = (postId, text) => {
    setNewCommentTexts(prev => ({ ...prev, [postId]: text }));
  };

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
      setNewCommentTexts(prev => ({ ...prev, [postId]: "" }));
    }
  };

  const handleSharePost = async (postId) => {
    if (!user) {
      toast.warn("Please log in to share posts.");
      return;
    }

    const result = await sharePost(postId);
    if (result.success) {
      const updatedUserPosts = await getUserPosts(user._id);
      if (updatedUserPosts.success) {
        setPosts(updatedUserPosts.posts);
      }
    }
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setEditText(post.text);
    setPreviewEditImage(post.image || "");
    setEditImageFile(null);
    setShowEditModal(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditImageFile(file);
    if (file) {
      setPreviewEditImage(URL.createObjectURL(file));
    } else {
      setPreviewEditImage(editingPost.image || "");
    }
  };

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

  const openDeleteConfirmModal = (postId) => {
    setDeletingPostId(postId);
    setShowDeleteConfirmModal(true);
  };

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

  const getCategoryIcon = (category) => {
    const icons = {
      frontend: "🎨",
      backend: "⚙️",
      fullstack: "🤖",
      ai: "🤖",
      mobile: "📱",
      other: "💻",
    };
    return icons[category?.toLowerCase()] || icons.other;
  };

  const getCategoryColor = (category) => {
    const colors = {
      frontend: "from-pink-500 to-violet-500",
      backend: "from-green-500 to-teal-500",
      fullstack: "from-blue-500 to-indigo-500",
      ai: "from-purple-500 to-pink-500",
      mobile: "from-orange-500 to-red-500",
      other: "from-gray-500 to-slate-500",
    };
    return colors[category?.toLowerCase()] || colors.other;
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
          <p className="text-red-600 text-lg">{error || "User not found"}</p>
          <Link
            to="/"
            className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?._id === profile?._id;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            {profile.fullName || "Developer"}'s Profile
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Showcasing {profile.fullName || "Developer"}'s skills and
            contributions
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-1/3 xl:w-1/4 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-24">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={`${profile.fullName || "User"}'s profile`}
                      className="w-32 h-32 rounded-xl object-cover border-4 border-blue-600 shadow-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/128x128/64748b/ffffff?text=${
                          profile.fullName?.[0] || "?"
                        }`;
                      }}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                      <FaUserCircle className="w-20 h-20 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-600 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {profile.fullName || "Anonymous"}
                </h2>
                <p className="text-slate-600 mb-4 text-sm">
                  {getCategoryIcon(profile.category)}{" "}
                  <span className="text-blue-600">
                    {profile.category
                      ? profile.category.charAt(0).toUpperCase() +
                        profile.category.slice(1)
                      : "Developer"}
                  </span>
                </p>
              </div>
              <div className="space-y-8">
                {!isOwnProfile && (
                  <>
                    <button
                      onClick={handleFollowToggle}
                      disabled={isProcessing}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-md ${
                        isFollowing
                          ? "bg-gray-200 text-blue-600 border-2 border-blue-600/30 hover:bg-gray-300"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/25"
                      } ${
                        isProcessing ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      title={isFollowing ? "Unfollow user" : "Follow user"}
                      aria-label={isFollowing ? "Unfollow user" : "Follow user"}
                    >
                      {isProcessing ? (
                        <FaSpinner className="w-5 h-5 animate-spin mx-auto" />
                      ) : isFollowing ? (
                        <span className="flex items-center justify-center">
                          <FaUserMinus className="mr-2" /> Unfollow
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <FaUserPlus className="mr-2" /> Follow
                        </span>
                      )}
                    </button>
                    <button
                      onClick={handleMessageUser}
                      className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md shadow-blue-600/25"
                      title={`Message ${profile.fullName || "this user"}`}
                      aria-label="Message User"
                    >
                      <FaEnvelope className="inline mr-2" /> Message
                    </button>
                  </>
                )}
                {isOwnProfile && (
                  <div className="flex flex-col gap-4">
                    <Link
                      to="/edit-profile"
                      className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md shadow-blue-600/25"
                      title="Edit your profile"
                      aria-label="Edit Profile"
                    >
                      <FaEdit className="inline mr-2" /> Edit Profile
                    </Link>
                    <Link
                      to="/create-post"
                      className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md shadow-blue-600/25"
                      title="Create a new post"
                      aria-label="Create Post"
                    >
                      <FaRegCommentDots className="inline mr-2" /> Create Post
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <FaUsers className="mr-2 text-blue-600" /> Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center">
                    <FaUsers className="mr-2 text-blue-600" /> Followers
                  </span>
                  <span className="text-slate-800 font-bold text-lg">
                    {profile.followersCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center">
                    <FaHeart className="mr-2 text-red-600" /> Following
                  </span>
                  <span className="text-slate-800 font-bold text-lg">
                    {profile.followingCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center">
                    <FaRegCommentDots className="mr-2 text-green-600" /> Posts
                  </span>
                  <span className="text-slate-800 font-bold text-lg">
                    {posts.length || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-600" /> Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-slate-600">
                  <FaMapMarkerAlt className="mr-3 text-blue-600" />
                  <span>{profile.location || "Not specified"}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <FaCalendarAlt className="mr-3 text-blue-600" />
                  <span>
                    Joined{" "}
                    {profile.createdAt
                      ? dayjs(profile.createdAt).format("MMMM YYYY")
                      : "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 space-y-8">
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <FaUserCircle className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">About</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg">
                {profile.bio || "No bio provided. Add one to share your story!"}
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <FaCode className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Skills</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {profile.skills?.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-100 text-blue-600 rounded-full text-sm font-medium border border-gray-200 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md"
                    >
                      #{skill}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-600">No skills listed yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                    <FaRegCommentDots className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Posts</h2>
                </div>
                <span className="text-slate-600 text-sm">
                  {posts.length} {posts.length === 1 ? "post" : "posts"}
                </span>
              </div>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <article
                    key={post?._id || post?.id}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:bg-gray-100 transition-all duration-300 mb-6"
                  >
                    <div className="flex items-center mb-4">
                      {post?.user?.profileImage ? (
                        <img
                          src={post.user.profileImage}
                          alt={post?.user?.fullName || "User"}
                          className="w-12 h-12 rounded-full border-2 border-gray-300 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/48x48/64748b/ffffff?text=${
                              post?.user?.fullName?.[0] || "?"
                            }`;
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                          <FaUserCircle className="text-white text-lg" />
                        </div>
                      )}
                      <div className="ml-4 flex-1">
                        <Link
                          to={`/my-profile/${post?.user?._id}`}
                          className="text-slate-800 font-semibold hover:text-blue-600 transition-colors duration-300"
                        >
                          {post?.user?.fullName || "Anonymous"}
                        </Link>
                        <div className="flex items-center text-slate-600 text-sm mt-1">
                          <FaCalendarAlt className="mr-1" />
                          <span>
                            {post?.createdAt
                              ? dayjs(post.createdAt).fromNow()
                              : "Unknown"}
                          </span>
                        </div>
                      </div>
                      {user && post.user._id === user._id && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(post)}
                            className="p-2 rounded-full text-slate-600 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
                            title="Edit Post"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => openDeleteConfirmModal(post._id)}
                            className="p-2 rounded-full text-slate-600 hover:text-red-600 hover:bg-gray-100 transition-colors duration-200"
                            title="Delete Post"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-slate-800 leading-relaxed mb-4">
                      {post?.text || "No content"}
                    </p>
                    {post?.image && (
                      <div className="rounded-lg overflow-hidden border border-gray-300 mb-4">
                        <img
                          src={post.image}
                          alt="Post content"
                          className="w-full h-auto max-h-96 object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/600x400/334155/ffffff?text=Image+Not+Available";
                          }}
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-6 text-slate-600 text-sm border-t border-gray-200 mt-4 pt-4">
                      <button
                        onClick={() => handleLikePost(post._id)}
                        className={`flex items-center transition-colors duration-200 ${
                          user && post.likes?.includes(user._id)
                            ? "text-red-600 hover:text-red-700"
                            : "hover:text-red-600"
                        }`}
                      >
                        {user && post.likes?.includes(user._id) ? (
                          <FaHeart className="mr-2" />
                        ) : (
                          <FaRegHeart className="mr-2" />
                        )}
                        {post.likes?.length || 0} Like
                      </button>
                      <button
                        className="flex items-center hover:text-blue-600 transition-colors duration-200"
                      >
                        <FaComment className="mr-2" />
                        {post.comments?.length || 0} Comment
                      </button>
                      {user && post.user._id !== user._id && (
                        <button
                          onClick={() => handleSharePost(post._id)}
                          className="flex items-center hover:text-green-600 transition-colors duration-300"
                        >
                          <FaShare className="mr-2" /> Share
                        </button>
                      )}
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <h3 className="text-lg font-semibold text-slate-800 mb-3">Comments</h3>
                      {post.comments && post.comments.length > 0 ? (
                        <div className="space-y-3">
                          {post.comments.map((comment) => (
                            <div key={comment._id} className="flex items-start">
                              {comment.user?.profileImage ? (
                                <img
                                  src={comment.user.profileImage}
                                  alt={comment.user.fullName}
                                  className="w-8 h-8 rounded-full object-cover border border-gray-300 flex-shrink-0"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://placehold.co/32x32/64748b/ffffff?text=${comment.user.fullName?.[0] || '?'}`;
                                  }}
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                                  <FaUserCircle className="text-slate-600 text-sm" />
                                </div>
                              )}
                              <div className="ml-3 bg-gray-100 p-3 rounded-lg flex-1">
                                <div className="flex items-center justify-between">
                                  <Link
                                    to={`/my-profile/${comment.user?._id}`}
                                    className="text-slate-800 font-semibold text-sm hover:text-blue-600"
                                  >
                                    {comment.user?.fullName || "Anonymous"}
                                  </Link>
                                  <span className="text-slate-600 text-xs">
                                    {dayjs(comment.createdAt).fromNow()}
                                  </span>
                                </div>
                                <p className="text-slate-800 text-sm mt-1">
                                  {comment.text}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-600 text-sm">No comments yet. Be the first to comment!</p>
                      )}

                      <div className="mt-4 flex items-center space-x-3">
                        <textarea
                          value={newCommentTexts[post._id] || ""}
                          onChange={(e) => handleCommentChange(post._id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleAddComment(post._id);
                            }
                          }}
                          className="flex-1 p-3 rounded-lg bg-white text-slate-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none h-auto overflow-hidden"
                          placeholder="Add a comment..."
                          rows="1"
                        ></textarea>
                        <button
                          onClick={() => handleAddComment(post._id)}
                          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md"
                          title="Add Comment"
                        >
                          <FaPaperPlane />
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaRegCommentDots className="text-slate-600 text-2xl" />
                  </div>
                  <h3 className="text-slate-800 font-semibold mb-2">
                    No posts yet
                  </h3>
                  <p className="text-slate-600">
                    {isOwnProfile ? (
                      <Link
                        to="/create-post"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Share your first post!
                      </Link>
                    ) : (
                      "Check back later!"
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <FaUsers className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Network</h2>
              </div>
              <p className="text-slate-600 mb-6 text-sm">
                Connect with other talented developers in the community.
              </p>
              <Link
                to="/all-developers"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
                title="Explore developer community"
              >
                <FaUsers className="mr-2" /> Explore Developers
              </Link>
            </div>
          </main>
        </div>
      </div>

      {showEditModal && editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-gray-200 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Edit Post</h2>
            <form onSubmit={handleSaveEdit}>
              <div className="mb-4">
                <label className="block text-slate-700 font-semibold mb-2">
                  Post Content
                </label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 resize-none h-32"
                />
              </div>
              <div className="mb-4">
                <label className="block text-slate-700 font-semibold mb-2">
                  Image
                </label>
                <input
                  type="file"
                  onChange={handleEditImageChange}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                  "
                />
              </div>
              {previewEditImage && (
                <div className="mb-4">
                  <img
                    src={previewEditImage}
                    alt="Preview"
                    className="w-full h-auto max-h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewEditImage("");
                      setEditImageFile(null);
                    }}
                    className="mt-2 text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove Image
                  </button>
                </div>
              )}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 border border-gray-200 relative text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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

export default MyProfile;