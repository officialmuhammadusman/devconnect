import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  FaUserCircle,
  FaCode,
  FaMapMarkerAlt,
  FaBriefcase,
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
  const { id } = useParams() || { id: currentUser?.id };
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
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const profileRes = await getUserProfile(id || currentUser.id);
        if (!profileRes.success) throw new Error(profileRes.message);
        setProfile({ ...profileRes.user, followersCount: profileRes.user.followers?.length || 0, followingCount: profileRes.user.following?.length || 0 });
        setIsFollowing(profileRes.user.isFollowing || false);

        const postsRes = await getUserPosts(id || currentUser.id);
        if (!postsRes.success) throw new Error(postsRes.message);
        setPosts(postsRes.posts);

        const usersRes = await getAllDevelopers("all");
        if (!usersRes.success) throw new Error(usersRes.message);
        setAllUsers(usersRes.developers);
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
        setProfile(prev => ({
          ...prev,
          followersCount: isFollowing ? (prev.followersCount || 0) - 1 : (prev.followersCount || 0) + 1,
          isFollowing: !isFollowing,
        }));
        setAllUsers(allUsers.map(user =>
          user.id === userId
            ? { ...user, followersCount: isFollowing ? (user.followersCount || 0) - 1 : (user.followersCount || 0) + 1, isFollowing: !isFollowing }
            : user
        ));
        toast.success(isFollowing ? "Unfollowed user" : "Followed user");
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
      other: "💻"
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
      other: "from-gray-500 to-slate-500"
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

  const isOwnProfile = currentUser.id === profile.id;

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
                      alt="Profile"
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
                  {profile.category || 'Developer'}
                </div>

                <div className="space-y-3">
                  {!isOwnProfile && (
                    <button
                      onClick={() => handleFollowToggle(profile.id, isFollowing)}
                      disabled={isProcessing}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${
                        isFollowing
                          ? "bg-slate-700 text-cyan-400 border-2 border-cyan-400/30 hover:bg-slate-600"
                          : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-cyan-500/25"
                      } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
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
                      aria-label="Edit Profile"
                    >
                      <FaEdit className="inline mr-2" /> Edit Profile
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
                <FaMapMarkerAlt className="mr-2 text-red-400" /> Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-slate-300">
                  <FaMapMarkerAlt className="mr-3 text-red-400" />
                  <span>{profile.location || "Not specified"}</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <FaCalendarAlt className="mr-3 text-purple-400" />
                  <span>Joined {dayjs(profile.createdAt).format("MMMM YYYY")}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            {/* Bio */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <FaUserCircle className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-white">About</h2>
              </div>
              <p className="text-slate-300 leading-relaxed text-lg">
                {profile.bio || "No bio provided. Add one to share your story!"}
              </p>
            </div>

            {/* Skills */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                  <FaCode className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-white">Skills</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {profile.skills?.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-600 text-cyan-300 rounded-full text-sm font-medium border border-slate-600 hover:from-cyan-500 hover:to-blue-500 hover:text-white transition-all duration-300 shadow-lg"
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
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-4">
                    <FaRegCommentDots className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Posts</h2>
                </div>
                <span className="text-slate-400 text-sm">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
              </div>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-300"
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
                          to={`/my-profile/${post.user.id}`}
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
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaRegCommentDots className="text-slate-400 text-2xl" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">No posts yet</h3>
                  <p className="text-slate-400">
                    {isOwnProfile ? "Share your first post!" : "Check back later!"}
                  </p>
                </div>
              )}
            </div>

            {/* Network */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-4">
                  <FaUsers className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-white">Network</h2>
              </div>
              <p className="text-slate-300 mb-6">
                Connect with other talented developers in the community.
              </p>
              <Link
                to="/all-users"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium shadow-lg shadow-cyan-500/25"
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