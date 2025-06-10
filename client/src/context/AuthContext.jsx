import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

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
          logout();
        }
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        logout();
      }

      setLoading(false);
    };

    fetchProfile();
  }, [token]); // Re-run when token changes

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
      return { success: true, user: newUser };
    } catch (error) {
      console.error("Register Error:", error.response?.data || error.message);
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

      return { success: true, user: newUser };
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
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

      return { success: true, user: userData };
    } catch (error) {
      console.error("Edit Profile Error:", error.response?.data || error.message);
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
  };

  // ✅ GET ALL DEVELOPERS FUNCTION
  const getAllDevelopers = async (category = "all") => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/developers`, {
        params: { category },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log("✅ Get All Developers API Response:", res.data);

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch developers");
      }

      return { success: true, developers: res.data.data };
    } catch (error) {
      console.error("Get All Developers Error:", error.response?.data || error.message);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch developers",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, user, loading, registerUser, login, editProfile, logout, getAllDevelopers }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);