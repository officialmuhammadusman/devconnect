import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile on token change or app load
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setUser(res.data.data);
        } else {
          console.warn("Profile fetch failed:", res.data.message);
          logout();
        }
      } catch (error) {
        console.error("Profile Fetch Error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        logout();
      }

      setLoading(false);
    };

    fetchProfile();
  }, [token]);

  // 🔐 REGISTER FUNCTION
  const registerUser = async (formData) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/user/register`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { token: newToken, user: newUser } = res.data.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);
      toast.success("Registration successful!");
      return { success: true, user: newUser };
    } catch (error) {
      console.error("Register Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Registration failed!");
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed!",
      };
    }
  };

  // 🔐 LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/user/login`, {
        email,
        password,
      });

      const { token: newToken, user: newUser } = response.data.data;

      if (!newToken || !newUser) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);
      toast.success("Login successful!");
      return { success: true, user: newUser };
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again.",
      };
    }
  };

  // ✏️ EDIT PROFILE FUNCTION
  const editProfile = async (formData) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/user/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      const userData = res.data.data;

      if (!userData || !userData.id) {
        throw new Error("Invalid edit profile response");
      }

      setUser(userData);
      toast.success("Profile updated successfully!");
      return { success: true, user: userData };
    } catch (error) {
      console.error("Edit Profile Error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Profile update failed. Please try again."
      );
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Profile update failed. Please try again.",
      };
    }
  };

  // 🚪 LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    toast.success("Logged out successfully!");
  };

  // ✅ GET ALL DEVELOPERS FUNCTION
  const getAllDevelopers = async (category = "all") => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/developers`, {
        params: { category },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch developers");
      }

      toast.success("Developers fetched successfully!");
      return { success: true, developers: res.data.data };
    } catch (error) {
      console.error("Get All Developers Error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch developers"
      );
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch developers",
      };
    }
  };

  // 📝 CREATE POST FUNCTION
  const createPost = async (formData) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/post/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to create post");
      }

      toast.success("Post created successfully!");
      return { success: true, post: res.data.data };
    } catch (error) {
      console.error("Create Post Error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create post. Please try again."
      );
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to create post. Please try again.",
      };
    }
  };

  // 📄 GET FEED POSTS FUNCTION
  const getFeedPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/post/feed`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch feed posts");
      }

      toast.success("Feed posts fetched successfully!");
      return { success: true, posts: res.data.data };
    } catch (error) {
      console.error("Get Feed Posts Error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch feed posts. Please try again."
      );
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch feed posts. Please try again.",
      };
    }
  };

  // 👤 GET USER PROFILE FUNCTION
  const getUserProfile = async (userId) => {
    try {
      console.log(`Attempting to fetch profile for userId: ${userId}`);
      console.log(`Request URL: ${API_BASE_URL}/api/user/profile/${userId}`);
      const res = await axios.get(`${API_BASE_URL}/api/user/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Profile API Response:", res.data);

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch user profile");
      }

      toast.success("User profile fetched successfully!");
      return { success: true, user: res.data.data };
    } catch (error) {
      console.error("Get User Profile Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch user profile. Please try again."
      );
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch user profile. Please try again.",
      };
    }
  };

  // 📄 GET USER POSTS FUNCTION
  const getUserPosts = async (userId) => {
    try {
      console.log(`Attempting to fetch posts for userId: ${userId}`);
      console.log(`Request URL: ${API_BASE_URL}/api/post/user/${userId}`);
      const res = await axios.get(`${API_BASE_URL}/api/post/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Posts API Response:", res.data);

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch user posts");
      }

      toast.success("User posts fetched successfully!");
      return { success: true, posts: res.data.data };
    } catch (error) {
      console.error("Get User Posts Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch user posts. Please try again."
      );
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch user posts. Please try again.",
      };
    }
  };

  // ➕ FOLLOW USER FUNCTION
  const followUser = async (userId) => {
    try {
      console.log(`Attempting to follow userId: ${userId}`);
      console.log(`Request URL: ${API_BASE_URL}/api/user/follow/${userId}`);
      const res = await axios.post(
        `${API_BASE_URL}/api/user/follow/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Follow API Response:", res.data);

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to follow user");
      }

      toast.success(res.data.message || "Followed user successfully!");
      return { success: true, message: res.data.message };
    } catch (error) {
      console.error("Follow User Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to follow user. Please try again."
      );
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to follow user. Please try again.",
      };
    }
  };

  // ➖ UNFOLLOW USER FUNCTION
  const unfollowUser = async (userId) => {
    try {
      console.log(`Attempting to unfollow userId: ${userId}`);
      console.log(`Request URL: ${API_BASE_URL}/api/user/unfollow/${userId}`);
      const res = await axios.post(
        `${API_BASE_URL}/api/user/unfollow/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Unfollow API Response:", res.data);

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to unfollow user");
      }

      toast.success(res.data.message || "Unfollowed user successfully!");
      return { success: true, message: res.data.message };
    } catch (error) {
      console.error("Unfollow User Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to unfollow user. Please try again."
      );
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to unfollow user. Please try again.",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        registerUser,
        login,
        editProfile,
        logout,
        getAllDevelopers,
        createPost,
        getFeedPosts,
        getUserProfile,
        getUserPosts,
        followUser,
        unfollowUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);