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
  });

  const handleConnect = useCallback(() => {
    if (user?._id) {
      socket.emit('register_user', user._id);
    }
  }, [user?._id]);

  const handleConnectError = useCallback((error) => {
    toast.error('Real-time connection failed. Please refresh.');
  }, []);

  const handleNotification = useCallback((notification) => {
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
    if (!loading && token) {
      socket.auth = { token };
      if (!socket.connected) {
        connectSocket();
      } else if (user?._id) {
        socket.emit('register_user', user._id);
      }
    } else if (!loading && !token) {
      disconnectSocket();
    }

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("receive_notification", handleNotification);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("receive_notification", handleNotification);
      if (!token) {
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