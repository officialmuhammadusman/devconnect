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
  FaComment,
  FaShare,
} from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const MyProfile = () => {
  const { user: currentUser, getUserProfile, getUserPosts, followUser, unfollowUser, getAllDevelopers } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { state: { redirect: `/my-profile/${id}` } });
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const userId = id || currentUser._id;
        if (!userId) throw new Error("Invalid user ID");

        const profileRes = await getUserProfile(userId);
        if (!profileRes.success) throw new Error(profileRes.message);
        setProfile({
          ...profileRes.data.user,
          followersCount: profileRes.data.user.followers?.length || 0,
          followingCount: profileRes.data.user.following?.length || 0,
        });
        setIsFollowing(profileRes.data.user.followers?.includes(currentUser._id) || false);

        const postsRes = await getUserPosts(userId);
        if (!postsRes.success) throw new Error(postsRes.message);
        setPosts(postsRes.data.posts);

        const usersRes = await getAllDevelopers("all");
        if (!usersRes.success) throw new Error(usersRes.message);
        setAllUsers(usersRes.data.developers);
      } catch (err) {
        setError(err.message || "Failed to load profile data");
        toast.error(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser, navigate, getUserProfile, getUserPosts, getAllDevelopers]);

  const handleFollowToggle = async (userId, isFollowing) => {
    if (isProcessing || !userId) return;
    setIsProcessing(true);
    const action = isFollowing ? unfollowUser : followUser;

    try {
      const res = await action(userId);
      if (res.success) {
        setProfile((prev) => ({
          ...prev,
          followersCount: isFollowing ? (prev.followersCount || 0) - 1 : (prev.followersCount || 0) + 1,
          followers: isFollowing
            ? prev.followers?.filter((f) => f !== currentUser._id)
            : [...(prev.followers || []), currentUser._id],
        }));
        setIsFollowing(!isFollowing);
        setAllUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  followersCount: isFollowing ? (user.followersCount || 0) - 1 : (user.followersCount || 0) + 1,
                  followers: isFollowing
                    ? user.followers?.filter((f) => f !== currentUser._id)
                    : [...(user.followers || []), currentUser._id],
                }
              : user
          )
        );
        toast.success(isFollowing ? "Unfollowed successfully!" : "Followed successfully!");
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to update follow status");
    } finally {
      setIsProcessing(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      frontend: "🎨",
      backend: "⚙️",
      fullstack: "🚀",
      ai: "🤖",
      mobile: "📱",
      other: "💻",
    };
    return icons[category] || icons.other;
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
    return colors[category] || colors.other;
  };

  if (!currentUser) return null;

  if (loading) {
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

  const isOwnProfile = currentUser._id === profile._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              {profile.fullName}'s Profile
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Showcasing {profile.fullName}'s skills and contributions
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
                      alt={`${profile.fullName}'s profile`}
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-gradient-to-r from-cyan-500 to-purple-500 shadow-2xl"
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

                <h2 className="text-2xl font-bold text-white mb-2">{profile.fullName || "Anonymous"}</h2>
                <p className="text-slate-300 mb-4 text-sm">{profile.headline || "No headline provided"}</p>

                <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${getCategoryColor(profile.category)} text-white text-sm font-medium mb-6 shadow-lg`}>
                  <span className="mr-2 text-lg">{getCategoryIcon(profile.category)}</span>
                  {profile.category ? profile.category.charAt(0).toUpperCase() + profile.category.slice(1) : "Developer"}
                </div>

                <div className="space-y-3">
                  {!isOwnProfile && (
                    <button
                      onClick={() => handleFollowToggle(profile._id, isFollowing)}
                      disabled={isProcessing}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${
                        isFollowing
                          ? "bg-slate-700 text-cyan-400 border-2 border-cyan-400/30 hover:bg-slate-600"
                          : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-cyan-500/25"
                      } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
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
                  )}
                  {isOwnProfile && (
                    <Link
                      to="/edit-profile"
                      className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-purple-500/25"
                      title="Edit your profile"
                      aria-label="Edit Profile"
                    >
                      <FaEdit className="inline mr-2" /> Edit Profile
                    </Link>
                  )}
                  {isOwnProfile && (
                    <Link
                      to="/create-post"
                      className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-green-500/25"
                      title="Create a new post"
                      aria-label="Create Post"
                    >
                      <FaRegCommentDots className="inline mr-2" /> Create Post
                    </Link>
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
                  <span className="text-white font-bold text-lg">{profile.followersCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center">
                    <FaHeart className="mr-2 text-red-400" /> Following
                  </span>
                  <span className="text-white font-bold text-lg">{profile.followingCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center">
                    <FaRegCommentDots className="mr-2 text-green-400" /> Posts
                  </span>
                  <span className="text-white font-bold text-lg">{posts.length || 0}</span>
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
                  <span>Joined {dayjs(profile.createdAt).format("MMMM YYYY")}</span>
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
                <span className="text-slate-400 text-sm">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
              </div>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <article
                    key={post._id || post.id}
                    className="bg-slate-700/20 rounded-xl p-6 border border-slate-600/20 hover:bg-slate-700/30 transition-all duration-300 mb-6"
                  >
                    <div className="flex items-center mb-4">
                      {post.user?.profileImage ? (
                        <img
                          src={post.user.profileImage}
                          alt={post.user.fullName || 'User'}
                          className="w-12 h-12 rounded-full border-2 border-slate-600 object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                          <FaUserCircle className="text-white text-lg" />
                        </div>
                      )}
                      <div className="ml-4 flex-1">
                        <Link
                          to={`/profile/${post.user._id}`}
                          className="text-white font-semibold hover:text-blue-400 transition-colors duration-300"
                        >
                          {post.user.fullName || "Anonymous"}
                        </Link>
                        <div className="flex items-center text-gray-400 text-sm mt-1">
                          <FaCalendarAlt className="mr-1" />
                          <span>{dayjs(post.createdAt).fromNow()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-200 leading-relaxed mb-4">{post.text}</p>
                    {post.image && (
                      <div className="rounded-lg overflow-hidden border border-gray-600">
                        <img
                          src={post.image}
                          alt="Post content"
                          className="w-full h-auto max-h-96 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-6 text-gray-400 text-sm border-t border-gray-600/20 mt-4 pt-4">
                      <button className="flex items-center hover:text-red-400 transition-colors duration-300" disabled title="Like feature coming soon">
                        <FaHeart className="mr-2" /> Like
                      </button>
                      <button className="flex items-center hover:text-blue-400 transition-colors duration-300" disabled title="Comment feature coming soon">
                        <FaComment className="mr-2" /> Comment
                      </button>
                      <button className="flex items-center hover:text-green-500 transition-colors duration-300" disabled title="Share feature coming soon">
                        <FaShare className="mr-2" /> Share
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaRegCommentDots className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">No posts yet</h3>
                  <p className="text-gray-400">
                    {isOwnProfile ? (
                      <Link to="/create-post" className="text-blue-500 hover:text-blue-400">
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
    </div>
  );
};

export default MyProfile;