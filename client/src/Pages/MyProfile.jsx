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
  FaRegHeart, // For unliked state
  FaComment,
  FaShare,
  FaEnvelope,
  FaTimes, // For close button in modals
  FaPaperPlane, // For send/save comment/post
  FaTrashAlt, // For delete icon
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
    loading: authLoading, // Renamed to avoid conflict with local isLoading
    getUserProfile,
    getUserPosts,
    initiateChat,
    followUser, // Added followUser from AuthContext
    unfollowUser, // Added unfollowUser from AuthContext
    likePost, // Added likePost from AuthContext
    commentOnPost, // Added commentOnPost from AuthContext
    sharePost, // Added sharePost from AuthContext
    editPost, // Added editPost from AuthContext
    deletePost, // Added deletePost from AuthContext
  } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // For profile and posts data
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // For follow/unfollow actions

  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null); // Stores the post being edited
  const [editText, setEditText] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [previewEditImage, setPreviewEditImage] = useState(""); // For image preview in edit modal

  // State for delete confirmation modal
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);

  // State for new comment text, mapped by postId for multiple comment inputs
  const [newCommentTexts, setNewCommentTexts] = useState({});

  useEffect(() => {
    if (!token || authLoading) { // Check authLoading instead of user
      if (!authLoading) { // Only navigate if authLoading is false and no token
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

        const profileResult = await getUserProfile(targetUserId); // GET /api/user/profile/:id
        if (!profileResult?.success) {
          throw new Error(profileResult?.message || "Failed to load profile");
        }
        const userProfile = profileResult?.user || {};
        setProfile({
          ...userProfile,
          followersCount: userProfile?.followers?.length || 0,
          followingCount: userProfile?.following?.length || 0,
        });
        // Check if the authenticated user is following this profile
        setIsFollowing(userProfile?.followers?.includes(user?._id) || false);

        const postsResult = await getUserPosts(targetUserId); // GET /api/posts/user/:id
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
      // initiateChat already handles toast messages
      const result = await initiateChat(profile._id); // POST /api/chats/initiate/:targetUserId
      if (result.success) {
        navigate("/chat", { state: { targetChatId: result.chat._id, targetUserId: profile._id } });
      }
    } catch (err) {
      // Error handled by AuthContext interceptor
    }
  };

  const handleFollowToggle = async () => {
    if (isProcessing || !profile?._id || !user?._id) return;
    setIsProcessing(true);
    try {
      const result = isFollowing
        ? await unfollowUser(profile._id) // Call unfollowUser from AuthContext
        : await followUser(profile._id); // Call followUser from AuthContext

      if (result.success) {
        setProfile((prev) => ({
          ...prev,
          followersCount: isFollowing
            ? (prev?.followersCount || 0) - 1
            : (prev?.followersCount || 0) + 1,
          // Note: The backend typically updates the 'followers' array on the user model,
          // so fetching profile data again after a successful follow/unfollow might be
          // necessary for the `isFollowing` state to accurately reflect the change.
          // For now, optimistic update based on `followersCount` is sufficient,
          // but if `followers` array is displayed, it might need to be refetched or updated.
        }));
        setIsFollowing(!isFollowing);
        // Toast messages handled by AuthContext
      } else {
        // Error message handled by AuthContext interceptor
      }
    } catch (err) {
      // Error handled by AuthContext interceptor
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle post like/unlike
  const handleLikePost = async (postId) => {
    if (!user) {
      toast.warn("Please log in to like posts.");
      return;
    }

    const result = await likePost(postId); // POST /api/posts/like/:id

    if (result.success) {
      // Update the local state with the new likes array returned by the API
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: result.likes } // Use the likes array from the API response
            : post
        )
      );
    }
    // Error messages are handled by authAxios interceptor in AuthContext
  };

  // Handle new comment input change
  const handleCommentChange = (postId, text) => {
    setNewCommentTexts(prev => ({ ...prev, [postId]: text }));
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

    const result = await commentOnPost(postId, { text: commentText }); // POST /api/posts/comment/:id

    if (result.success) {
      // Update the local state with the new comments array from the API response
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: result.comment.comments } // Backend returns the full updated post with comments
            : post
        )
      );
      setNewCommentTexts(prev => ({ ...prev, [postId]: "" })); // Clear comment input
    }
    // Error messages are handled by authAxios interceptor in AuthContext
  };

  // Handle post sharing
  const handleSharePost = async (postId) => {
    if (!user) {
      toast.warn("Please log in to share posts.");
      return;
    }

    const result = await sharePost(postId); // POST /api/posts/share/:id

    if (result.success) {
      // For shared posts, we typically show them on the sharer's feed/profile.
      // Refetching the user's own posts to display the newly shared post.
      const updatedUserPosts = await getUserPosts(user._id);
      if (updatedUserPosts.success) {
          setPosts(updatedUserPosts.posts);
      }
      // Toast message is already handled in AuthContext
    }
  };

  // Open edit modal
  const openEditModal = (post) => {
    setEditingPost(post);
    setEditText(post.text);
    setPreviewEditImage(post.image || ""); // Set existing image for preview
    setEditImageFile(null); // Reset image file input
    setShowEditModal(true);
  };

  // Handle image file change in edit modal
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditImageFile(file);
    if (file) {
      setPreviewEditImage(URL.createObjectURL(file));
    } else {
      setPreviewEditImage(editingPost.image || ""); // Keep current image if no new file selected
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
      // If user cleared the image and original post had one, signal backend to remove it
      // NOTE: The backend 'editPost' controller currently only handles `req.file` for new images
      // and doesn't explicitly handle a `removeImage` flag. If a user clears an image
      // without uploading a new one, the old image will persist on the backend.
      // A backend update would be needed to fully support image removal via this flag.
      formData.append("removeImage", "true");
    }

    const result = await editPost(editingPost._id, formData); // PUT /api/posts/:id

    if (result.success) {
      // Update the local state with the edited post data
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
    // Error messages are handled by authAxios interceptor
  };

  // Open delete confirmation modal
  const openDeleteConfirmModal = (postId) => {
    setDeletingPostId(postId);
    setShowDeleteConfirmModal(true);
  };

  // Confirm and delete post
  const handleConfirmDelete = async () => {
    if (!deletingPostId) return;

    const result = await deletePost(deletingPostId); // DELETE /api/posts/:id

    if (result.success) {
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== deletingPostId)
      );
      setShowDeleteConfirmModal(false); // Close modal only if deletion was successful
      setDeletingPostId(null);
    }
    // Error messages are handled by authAxios interceptor
  };

  const getCategoryIcon = (category) => {
    const icons = {
      frontend: "🎨",
      backend: "⚙️",
      fullstack: "�",
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

  if (isLoading || authLoading) { // Check both isLoading and authLoading
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <FaSpinner className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 text-center border border-slate-700/50">
          <p className="text-red-400 text-lg">{error || "User not found"}</p>
          <Link
            to="/"
            className="mt-4 inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-4 rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?._id === profile?._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              {profile.fullName || "Developer"}'s Profile
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Showcasing {profile.fullName || "Developer"}'s skills and
              contributions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <aside className="w-full lg:w-1/3 xl:w-1/4 space-y-6">
            {/* Profile Card */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 sticky top-24">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={`${profile.fullName || "User"}'s profile`}
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-gradient-to-r from-cyan-500 to-purple-500 shadow-2xl"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/128x128/64748b/ffffff?text=${
                          profile.fullName?.[0] || "?"
                        }`;
                      }}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-2xl">
                      <FaUserCircle className="w-20 h-20 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-800 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  {profile.fullName || "Anonymous"}
                </h2>
                <p className="text-slate-300 mb-4 text-sm">
                  {profile.headline || "No headline provided"}
                </p>

                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${getCategoryColor(
                    profile.category
                  )} text-white text-sm font-medium mb-6 shadow-lg`}
                >
                  <span className="mr-2 text-lg">
                    {getCategoryIcon(profile.category)}
                  </span>
                  {profile.category
                    ? profile.category.charAt(0).toUpperCase() +
                      profile.category.slice(1)
                    : "Developer"}
                </div>

                <div className="space-y-8">
                  {" "}
                  {/* Increased spacing to 8 for clearer separation */}
                  {!isOwnProfile && (
                    <>
                      <button
                        onClick={handleFollowToggle}
                        disabled={isProcessing}
                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${
                          isFollowing
                            ? "bg-slate-700 text-cyan-400 border-2 border-cyan-400/30 hover:bg-slate-600"
                            : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-cyan-500/25"
                        } ${
                          isProcessing ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        title={isFollowing ? "Unfollow user" : "Follow user"}
                        aria-label={
                          isFollowing ? "Unfollow user" : "Follow user"
                        }
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
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-purple-500/25"
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
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-purple-500/25"
                        title="Edit your profile"
                        aria-label="Edit Profile"
                      >
                        <FaEdit className="inline mr-2" /> Edit Profile
                      </Link>
                      <Link
                        to="/create-post"
                        className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-green-500/25"
                        title="Create a new post"
                        aria-label="Create Post"
                      >
                        <FaRegCommentDots className="inline mr-2" /> Create Post
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FaUsers className="mr-2 text-cyan-400" /> Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center">
                    <FaUsers className="mr-2 text-cyan-400" /> Followers
                  </span>
                  <span className="text-white font-bold text-lg">
                    {profile.followersCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center">
                    <FaHeart className="mr-2 text-red-400" /> Following
                  </span>
                  <span className="text-white font-bold text-lg">
                    {profile.followingCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center">
                    <FaRegCommentDots className="mr-2 text-green-400" /> Posts
                  </span>
                  <span className="text-white font-bold text-lg">
                    {posts.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-400" /> Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-slate-100">
                  <FaMapMarkerAlt className="mr-3 text-blue-400" />
                  <span>{profile.location || "Not specified"}</span>
                </div>
                <div className="flex items-center text-slate-100">
                  <FaCalendarAlt className="mr-3 text-purple-500" />
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

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            {/* Bio */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/30">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <FaUserCircle className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-white">About</h2>
              </div>
              <p className="text-slate-300 leading-relaxed text-lg">
                {profile.bio || "No bio provided. Add one to share your story!"}
              </p>
            </div>

            {/* Skills */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/30">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <FaCode className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-white">Skills</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {profile.skills?.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-slate-700/50 text-cyan-300 rounded-full text-sm font-medium border border-slate-600/30 hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-lg"
                    >
                      #{skill}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-400">No skills listed yet.</p>
                )}
              </div>
            </div>

            {/* Posts */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                    <FaRegCommentDots className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Posts</h2>
                </div>
                <span className="text-slate-400 text-sm">
                  {posts.length} {posts.length === 1 ? "post" : "posts"}
                </span>
              </div>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <article
                    key={post?._id || post?.id}
                    className="bg-slate-700/20 rounded-xl p-6 border border-slate-600/20 hover:bg-slate-700/30 transition-all duration-300 mb-6"
                  >
                    <div className="flex items-center mb-4">
                      {post?.user?.profileImage ? (
                        <img
                          src={post.user.profileImage}
                          alt={post?.user?.fullName || "User"}
                          className="w-12 h-12 rounded-full border-2 border-slate-600 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/48x48/64748b/ffffff?text=${
                              post?.user?.fullName?.[0] || "?"
                            }`;
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                          <FaUserCircle className="text-white text-lg" />
                        </div>
                      )}
                      <div className="ml-4 flex-1">
                        <Link
                          to={`/my-profile/${post?.user?._id}`}
                          className="text-white font-semibold hover:text-blue-400 transition-colors duration-300"
                        >
                          {post?.user?.fullName || "Anonymous"}
                        </Link>
                        <div className="flex items-center text-gray-400 text-sm mt-1">
                          <FaCalendarAlt className="mr-1" />
                          <span>
                            {post?.createdAt
                              ? dayjs(post.createdAt).fromNow()
                              : "Unknown"}
                          </span>
                        </div>
                      </div>
                      {/* Edit and Delete Buttons (Conditionally Rendered for own posts) */}
                      {user && post.user._id === user._id && (
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
                    <p className="text-gray-200 leading-relaxed mb-4">
                      {post?.text || "No content"}
                    </p>
                    {post?.image && (
                      <div className="rounded-lg overflow-hidden border border-gray-600 mb-4">
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
                    <div className="flex items-center space-x-6 text-gray-400 text-sm border-t border-gray-600/20 mt-4 pt-4">
                      <button
                        onClick={() => handleLikePost(post._id)}
                        className={`flex items-center transition-colors duration-200 ${
                          user && post.likes?.includes(user._id)
                            ? "text-red-500 hover:text-red-600"
                            : "hover:text-red-400"
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
                        className="flex items-center hover:text-blue-400 transition-colors duration-200"
                        // No direct action for comments here, as input field is below
                      >
                        <FaComment className="mr-2" />{" "}
                        {post.comments?.length || 0} Comment
                      </button>
                      {user && post.user._id !== user._id && ( // Only show share button if not own post
                        <button
                          onClick={() => handleSharePost(post._id)}
                          className="flex items-center hover:text-green-500 transition-colors duration-300"
                        >
                          <FaShare className="mr-2" /> Share
                        </button>
                      )}
                    </div>

                    {/* Comments Section */}
                    <div className="mt-6 border-t border-slate-600/50 pt-4">
                      <h3 className="text-lg font-semibold text-white mb-3">Comments</h3>
                      {post.comments && post.comments.length > 0 ? (
                        <div className="space-y-3">
                          {post.comments.map((comment) => (
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

                      {/* Add Comment Input */}
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
                          className="flex-1 p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none h-auto overflow-hidden"
                          placeholder="Add a comment..."
                          rows="1"
                        ></textarea>
                        <button
                          onClick={() => handleAddComment(post._id)}
                          className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md"
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
                  <div className="w-16 h-16 bg-gray-200/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaRegCommentDots className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-400">
                    {isOwnProfile ? (
                      <Link
                        to="/create-post"
                        className="text-blue-500 hover:text-blue-400"
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

            {/* Network */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/30">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                  <FaUsers className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-white">Network</h2>
              </div>
              <p className="text-slate-300 mb-6 text-sm">
                Connect with other talented developers in the community.
              </p>
              <Link
                to="/all-developers"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition-colors duration-300 shadow-lg"
                title="Explore developer community"
              >
                <FaUsers className="mr-2" /> Explore Developers
              </Link>
            </div>
          </main>
        </div>
      </div>

      {/* Edit Post Modal */}
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
                      onClick={() => setPreviewEditImage("")} // Clear image
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

      {/* Delete Confirmation Modal */}
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

export default MyProfile;
