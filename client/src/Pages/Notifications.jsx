/* eslint-disable no-unused-vars */
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="w-16 h-16 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="relative overflow-hidden mb-8 rounded-xl shadow-md">
          <div className="relative text-center py-6">
            <h1 className="text-4xl font-semibold text-slate-800">
              Your Notifications
            </h1>
            <p className="text-slate-600 mt-2">
              Stay informed about what's happening
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-md text-sm border border-red-200 mb-6">
            {error}
          </div>
        )}

        {notifications.length > 0 && notifications.some(notif => !notif.isComplete) && (
          <div className="flex justify-end mb-6">
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-100 transition-colors duration-200 hover:bg-blue-700 transition-all duration-300 font-medium shadow-md"
              disabled={isLoadingLocal}
            >
              <FaCheckCircle className="mr-2" /> {isLoadingLocal ? "Marking..." : "Mark all as read"}
            </button>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="bg-white text-center space-y-4 rounded-xl py-8 border border-gray-200 shadow-md">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBell className="text-blue-600 text-2xl" />
            </div>
            <p className="text-center text-slate-600 mb-4 text-lg">
              You don't have any notifications yet.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 font-medium shadow-md"
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
                className={`flex items-start p-4 rounded-md border transition-all duration-300 cursor-pointer ${
                  notif.isRead
                    ? "bg-gray-50 border-gray-200 text-slate-600 hover:bg-gray-100"
                    : "bg-blue-50 border-blue-200 text-slate-800 hover:bg-blue-100 shadow-md"
                }`}
              >
                <div className="flex-shrink-0 mr-4 mt-1">
                  {notif.isRead ? (
                    <FaCheckCircle className="text-green-600 text-xl" />
                  ) : (
                    <FaCircle className="text-blue-600 text-xl" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`leading-relaxed ${notif.isRead ? "font-normal" : "font-semibold text-slate-800"}`}>
                    <Link
                      to={`/my-profile/${notif.senderId?._id}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {notif.senderId?.fullName || "A user"}
                    </Link>{" "}
                    {notif.message}
                  </p>
                  <span className="text-sm text-slate-600 mt-1 flex items-center">
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