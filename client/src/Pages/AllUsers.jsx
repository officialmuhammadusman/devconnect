import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaSpinner, FaUserPlus, FaUserMinus, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";

const AllUsers = () => {
  const { getAllDevelopers, followUser, unfollowUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getAllDevelopers("all");
        if (!res.success) throw new Error(res.message || "Failed to fetch users");
        // Ensure res.developers is an array before mapping
        const developers = Array.isArray(res.developers) ? res.developers : [];
        setUsers(developers.map(user => ({
          ...user,
          followersCount: user.followers?.length || 0,
          followingCount: user.following?.length || 0
        })));
      } catch (err) {
        setError(err.message || "Failed to fetch users");
        toast.error(err.message || "Failed to fetch users");
        setUsers([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [getAllDevelopers]);

  const handleFollowToggle = async (userId, isFollowing) => {
    if (isProcessing[userId] || !userId) {
      toast.error("Invalid user ID. Please try again.");
      return;
    }
    setIsProcessing(prev => ({ ...prev, [userId]: true }));
    const action = isFollowing ? unfollowUser : followUser;

    try {
      const res = await action(userId);
      if (res.success) {
        setUsers(users.map(user =>
          (user.id === userId || user._id === userId)
            ? { ...user, followersCount: isFollowing ? (user.followersCount || 0) - 1 : (user.followersCount || 0) + 1, isFollowing: !isFollowing }
            : user
        ));
        toast.success(isFollowing ? "Unfollowed user" : "Followed user");
      } else {
        throw new Error(res.message || "Failed to update follow status");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update follow status");
    } finally {
      setIsProcessing(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <FaSpinner className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 text-center border border-slate-700/50">
          <p className="text-red-400 text-lg">{error}</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-3xl"></div>
          <div className="relative text-center py-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Explore Developers
            </h1>
            <p className="text-slate-300 mt-2">Connect with talented developers in the community</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => {
            const userId = user.id || user._id;
            return (
              <div
                key={userId}
                className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center space-x-4 mb-4">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.fullName}
                      className="w-16 h-16 rounded-full object-cover border-4 border-gradient-to-r from-cyan-500 to-purple-500 shadow-2xl"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-2xl">
                      <FaUserCircle className="text-white text-3xl" />
                    </div>
                  )}
                  <div>
                    <Link
                      to={`/my-profile/${userId}`}
                      className="text-xl font-semibold text-white hover:text-cyan-400 transition duration-300"
                    >
                      {user.fullName || "Anonymous"}
                    </Link>
                    <p className="text-sm text-slate-300">{user.headline || "No headline"}</p>
                    <p className="text-xs text-slate-400">
                      Followers: {user.followersCount || 0} | Following: {user.followingCount || 0}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleFollowToggle(userId, user.isFollowing || false)}
                  disabled={isProcessing[userId]}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${
                    user.isFollowing
                      ? "bg-slate-700 text-cyan-400 border-2 border-cyan-400/30 hover:bg-slate-600"
                      : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-cyan-500/25"
                  } ${isProcessing[userId] ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isProcessing[userId] ? (
                    <FaSpinner className="w-5 h-5 animate-spin inline" />
                  ) : user.isFollowing ? (
                    <span className="flex items-center justify-center">
                      <FaUserMinus className="mr-2" /> Unfollow
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <FaUserPlus className="mr-2" /> Follow
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;