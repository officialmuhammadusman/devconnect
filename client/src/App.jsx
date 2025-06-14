import { Outlet } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useCallback, useRef } from 'react';
import { socket, connectSocket, disconnectSocket } from './utils/socket';

const AppContent = () => {
  const { token, loading, user } = useAuth();
  const renderCountRef = useRef(0);

  // Debug: Track renders
  useEffect(() => {
    renderCountRef.current += 1;
    console.log(`AppContent render count: ${renderCountRef.current}`);
  });

  const handleConnect = useCallback(() => {
    console.log("Socket connected, ID:", socket.id);
    if (user?._id) {
      console.log(`Emitting register_user for user ID: ${user._id}`);
      socket.emit('register_user', user._id);
    }
  }, [user?._id]);

  const handleConnectError = useCallback((error) => {
    console.error("Socket connection error:", error);
    toast.error('Real-time connection failed. Please refresh.');
  }, []);

  const handleNotification = useCallback((notification) => {
    console.log("Received notification:", notification);
    let message = '';
    switch (notification.type) {
      case 'like':
        message = `${notification.sender.fullName} liked your post!`;
        break;
      case 'comment':
        message = `${notification.sender.fullName} commented on your post`;
        break;
      case 'share':
        message = `${notification.sender.fullName} shared your post!`;
        break;
      case 'follow':
        message = `${notification.sender.fullName} started following you!`;
        break;
      default:
        message = `New activity: ${notification.message}`;
    }
    toast.info(message);
  }, []);

  useEffect(() => {
    console.log("AppContent useEffect running");
    console.log("Frontend origin:", window.location.origin);
    console.log("Current token:", token);
    console.log("Loading state:", loading);

    if (!loading && token) {
      socket.auth = { token };
      if (!socket.connected) {
        console.log("Connecting socket...");
        connectSocket();
      } else if (user?._id) {
        console.log(`Emitting register_user for user ID: ${user._id}`);
        socket.emit('register_user', user._id);
      }
    } else if (!loading && !token) {
      console.log("Disconnecting socket due to no token");
      disconnectSocket();
    }

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("receive_notification", handleNotification);

    return () => {
      console.log("Cleaning up AppContent useEffect");
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("receive_notification", handleNotification);
      if (!token) {
        console.log("Disconnecting socket in cleanup");
        disconnectSocket();
      }
    };
  }, [token, loading, user?._id, handleConnect, handleConnectError, handleNotification]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;