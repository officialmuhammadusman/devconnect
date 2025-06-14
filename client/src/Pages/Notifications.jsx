
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaBell,
  FaCheckCircle,
  FaCircle,
  FaSpinner,
  FaCalendarAlt,
} from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";

dayjs.extend(relativeTime);

const Notifications = () => {
  const {
    loading: authLoading,
    notifications,
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    user,
  } = useAuth();

  const [isLoadingLocal, setIsLoadingLocal] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading) {
      if (user && notifications.length === 0) {
        const fetchInitialNotifications = async () => {
          setIsLoadingLocal(true);
          try {
            const result = await getNotifications();
            if (!result.success) {
              setError(result.message || "Failed to load notifications.");
            }
          } catch (err) {
            setError("Failed to load notifications.");
          }
          setIsLoadingLocal(false);
        };
        fetchInitialNotifications();
      } else {
        setIsLoadingLocal(false);
      }
    }
  }, [authLoading, user, getNotifications, notifications.length]);

  const handleMarkAsRead = async (notificationId) => {
    const notifToMark = notifications.find(notif => notif._id === notificationId);
    if (notifToMark && !notifToMark.isRead) {
      try {
        await markNotificationRead(notificationId);
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsLoadingLocal(true);
    try {
      const result = await markAllNotificationsRead();
      if (!result.success) {
        setError(result.message || "Failed to mark all notifications as read.");
      }
    } catch (err) {
      setError("Failed to mark all notifications as read.");
    }
    setIsLoadingLocal(false);
  };

  if (authLoading || isLoadingLocal) {
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
              Your Notifications
            </h1>
            <p className="text-slate-300 mt-2">
              Stay informed about what's happening
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-xl text-sm border border-red-500/30 mb-6">
            {error}
          </div>
        )}

        {notifications.length > 0 && notifications.some(notif => !notif.isRead) && (
          <div className="flex justify-end mb-6">
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-md shadow-blue-500/25"
              disabled={isLoadingLocal}
            >
              <FaCheckCircle className="mr-2" /> {isLoadingLocal ? "Marking..." : "Mark all as Read"}
            </button>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 text-center border border-slate-700/50 shadow-xl">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBell className="text-slate-400 text-2xl" />
            </div>
            <p className="text-slate-300 mb-4 text-lg">
              You don't have any notifications yet.
            </p>
            <Link
              to="/feed"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-medium shadow-lg shadow-cyan-500/25"
            >
              Explore Feed
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                className={`flex items-start p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  notif.isRead
                    ? "bg-slate-700/20 border-slate-600/30 text-slate-400 hover:bg-slate-700/30"
                    : "bg-purple-700/20 border-purple-600/50 text-white hover:bg-purple-700/30 shadow-md shadow-purple-500/10"
                }`}
              >
                <div className="flex-shrink-0 mr-4 mt-1">
                  {notif.isRead ? (
                    <FaCheckCircle className="text-green-400 text-xl" />
                  ) : (
                    <FaCircle className="text-blue-400 text-xl" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`leading-relaxed ${notif.isRead ? "font-normal" : "font-semibold text-white"}`}>
                    <Link
                      to={`/my-profile/${notif.senderId?._id}`}
                      className="text-cyan-300 hover:text-cyan-200 font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {notif.senderId?.fullName || "A user"}
                    </Link>{" "}
                    {notif.message}
                  </p>
                  <span className="text-sm text-slate-400 mt-1 flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    {dayjs(notif.createdAt).fromNow()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
