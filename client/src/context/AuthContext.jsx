
import axios from "axios";
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [chats, setChats] = useState([]);

  const authAxios = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    instance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API Call Error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
        });

        const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred.";

        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error("Session expired or unauthorized. Please log in again.");
          logout();
        } else if (error.response?.status === 404) {
          toast.error(error.response?.data?.message || "Resource not found. Please check the URL or if the item exists.");
        } else {
          toast.error(errorMessage);
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [token]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setNotifications([]);
    setChats([]);
    toast.success("Logged out successfully!");
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await authAxios.get("/api/user/profile");
      if (res.data.success) {
        setUser(res.data.data);
      } else {
        console.warn("Profile fetch failed:", res.data.message);
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  }, [authAxios, token, logout]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const registerUser = useCallback(async (formData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/user/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { token: newToken, user: newUser } = res.data.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);
      toast.success("Registration successful!");
      return { success: true, user: newUser };
    } catch (error) {
      console.error("Register Error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed!",
      };
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/user/login`, { email, password });

      const { token: newToken, user: newUser } = response.data.data;
      if (!newToken || !newUser) {
        throw new Error("Invalid login response: Missing token or user data.");
      }

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);
      toast.success("Login successful!");
      return { success: true, user: newUser };
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Login failed. Please try again.",
      };
    }
  }, []);

  const editProfile = useCallback(async (formData) => {
    try {
      const res = await authAxios.put("/api/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const userData = res.data.data;
      if (!userData || !userData.id) {
        throw new Error("Invalid edit profile response: Missing user ID.");
      }

      setUser(userData);
      toast.success("Profile updated successfully!");
      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Profile update failed.",
      };
    }
  }, [authAxios]);

  const getAllDevelopers = useCallback(async (category = "all") => {
    try {
      const res = await authAxios.get("/api/user/developers", { params: { category } });
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch developers");
      }
      return { success: true, developers: res.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Failed to fetch developers",
      };
    }
  }, [authAxios]);

  const createPost = useCallback(async (formData) => {
    try {
      const res = await authAxios.post("/api/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to create post");
      }
      return { success: true, post: res.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Failed to create post.",
      };
    }
  }, [authAxios]);

  const getFeedPosts = useCallback(async () => {
    try {
      const res = await authAxios.get("/api/post/feed");
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch feed posts");
      }
      return { success: true, posts: res.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Failed to fetch feed posts.",
      };
    }
  }, [authAxios]);

  const getAllPosts = useCallback(async () => {
    try {
      const res = await authAxios.get("/api/post");
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch all posts");
      }
      return { success: true, posts: res.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Failed to fetch all posts.",
      };
    }
  }, [authAxios]);

  const getUserProfile = useCallback(async (userId) => {
    try {
      const res = await authAxios.get(`/api/user/profile/${userId}`);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch user profile");
      }
      return { success: true, user: res.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Failed to fetch user profile.",
      };
    }
  }, [authAxios]);

  const getUserPosts = useCallback(async (userId) => {
    try {
      const res = await authAxios.get(`/api/post/user/${userId}`);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch user posts");
      }
      return { success: true, posts: res.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Failed to fetch user posts.",
      };
    }
  }, [authAxios]);

  const followUser = useCallback(async (userIdToFollow) => {
    try {
      const res = await authAxios.post(`/api/user/follow/${userIdToFollow}`);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to follow user");
      }
      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Failed to follow user.",
      };
    }
  }, [authAxios]);

  const unfollowUser = useCallback(async (userIdToUnfollow) => {
    try {
      const res = await authAxios.post(`/api/user/unfollow/${userIdToUnfollow}`);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to unfollow user");
      }
      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Failed to unfollow user.",
      };
    }
  }, [authAxios]);

  const getNotifications = useCallback(async () => {
    try {
      const res = await authAxios.get("/api/notifications");
      if (res.data.success) {
        setNotifications(res.data.data);
        return { success: true, notifications: res.data.data };
      }
      return { success: false, message: res.data.message || "Failed to fetch notifications." };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch notifications." };
    }
  }, [authAxios]);

  const markNotificationRead = useCallback(async (notificationId) => {
    try {
      const res = await authAxios.patch(`/api/notifications/mark-read/${notificationId}`);
      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((notif) => (notif._id === notificationId ? { ...notif, isRead: true } : notif))
        );
        return { success: true };
      }
      return { success: false, message: res.data.message || "Failed to mark notification as read." };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message || "Failed to mark notification as read." };
    }
  }, [authAxios]);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      const res = await authAxios.patch("/api/notifications/mark-all-read");
      if (res.data.success) {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
        return { success: true };
      }
      return { success: false, message: res.data.message || "Failed to mark all notifications as read." };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message || "Failed to mark all notifications as read." };
    }
  }, [authAxios]);

  const getChats = useCallback(async () => {
    try {
      const res = await authAxios.get("/api/chats");
      if (res.data.success) {
        setChats(res.data.data);
        return { success: true, chats: res.data.data };
      }
      return { success: false, message: res.data.message || "Failed to fetch chats." };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch chats." };
    }
  }, [authAxios]);

  const getChatMessages = useCallback(async (chatId) => {
    try {
      const res = await authAxios.get(`/api/chats/${chatId}/messages`);
      if (res.data.success) {
        return { success: true, messages: res.data.data };
      }
      return { success: false, message: res.data.message || "Failed to fetch chat messages." };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message || "Failed to fetch chat messages." };
    }
  }, [authAxios]);

  const initiateChat = useCallback(async (targetUserId) => {
    try {
      const res = await authAxios.post(`/api/chats/initiate/${targetUserId}`);
      if (res.data.success) {
        getChats();
        return { success: true, chat: res.data.data };
      }
      return { success: false, message: res.data.message || "Failed to initiate chat." };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message || "Failed to initiate chat." };
    }
  }, [authAxios, getChats]);

  const sendChatMessage = useCallback(async (chatId, messagePayload) => {
    try {
      const res = await authAxios.post(`/api/chats/${chatId}/messages`, messagePayload);
      if (res.data.success) {
        return { success: true, message: res.data.data };
      }
      return { success: false, message: res.data.message || "Failed to send message." };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message || "Failed to send message." };
    }
  }, [authAxios]);

  const likePost = useCallback(async (postId) => {
    try {
      const res = await authAxios.post(`/api/post/like/${postId}`);
      if (res.data.success) {
        return { success: true, likes: res.data.data.likes };
      }
      return { success: false, message: res.data.message || "Failed to like post." };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message || "Failed to like post." };
    }
  }, [authAxios]);

  const editPost = useCallback(async (postId, formData) => {
    try {
      const headers = formData instanceof FormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" };
      const res = await authAxios.put(`/api/post/${postId}`, formData, { headers });
      if (res.data.success) {
        return { success: true, post: res.data.data };
      }
      return { success: false, message: res.data.message || "Failed to update post." };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message || "Failed to update post." };
    }
  }, [authAxios]);

  const deletePost = useCallback(async (postId) => {
    try {
      const res = await authAxios.delete(`/api/post/${postId}`);
      if (res.data.success) {
        return { success: true };
      }
      return { success: false, message: res.data.message || "Failed to delete post." };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message || "Failed to delete post." };
    }
  }, [authAxios]);

  const commentOnPost = useCallback(async (postId, commentData) => {
    try {
      console.log("Commenting on postId:", postId, "with data:", commentData);
      const res = await authAxios.post(`${API_BASE_URL}/api/post/comment/${postId}`, commentData, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data.success) {
        return { success: true, comment: res.data.data };
      }
      return { success: false, message: res.data.message || "Failed to add comment." };
    } catch (error) {
      console.error("Comment Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Failed to add comment.",
      };
    }
  }, [authAxios]);

  const sharePost = useCallback(async (postId, shareData = {}) => {
    try {
      console.log("Initiating Share for postId:", postId, "with data:", shareData);
      const res = await authAxios.post(`${API_BASE_URL}/api/post/share/${postId}`, shareData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Share Response Received:", res.data);
      if (res.data.success) {
        return { success: true, sharedPost: res.data.data };
      }
      return { success: false, message: res.data.message || "Failed to share post." };
    } catch (error) {
      console.error("Share Post Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Failed to share post.",
      };
    }
  }, [authAxios]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      notifications,
      chats,
      registerUser,
      login,
      editProfile,
      logout,
      getAllDevelopers,
      createPost,
      getFeedPosts,
      getAllPosts,
      getUserProfile,
      getUserPosts,
      followUser,
      unfollowUser,
      getNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      getChats,
      getChatMessages,
      initiateChat,
      sendChatMessage,
      likePost,
      editPost,
      deletePost,
      commentOnPost,
      sharePost,
    }),
    [
      token,
      user,
      loading,
      notifications,
      chats,
      registerUser,
      login,
      editProfile,
      logout,
      getAllDevelopers,
      createPost,
      getFeedPosts,
      getAllPosts,
      getUserProfile,
      getUserPosts,
      followUser,
      unfollowUser,
      getNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      getChats,
      getChatMessages,
      initiateChat,
      sendChatMessage,
      likePost,
      editPost,
      deletePost,
      commentOnPost,
      sharePost,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
