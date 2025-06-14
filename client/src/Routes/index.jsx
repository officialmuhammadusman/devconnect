import { createBrowserRouter } from 'react-router-dom';
import App from '../App'; // Adjusted path to src/App.jsx
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import MyProfile from '../Pages/MyProfile';
import EditProfile from '../Pages/EditProfile';
import AllDevelopers from '../Pages/AllDevelopers';
import AllUsers from '../Pages/AllUsers';
import Notifications from '../Pages/Notifications';
import Chat from '../Pages/Chat';
import Projects from '../Pages/Projects';
import Jobs from '../Pages/Jobs';
import CreatePost from '../Pages/CreatePost';
import Feed from '../Pages/Feed';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ErrorBoundary from '../Components/ErrorBoundary';

// ProtectedRoute component to restrict access
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (!loading && !token) return <Navigate to="/login" replace />;
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { 
        path: "/my-profile/:id", 
        element: <ProtectedRoute><MyProfile /></ProtectedRoute>,
        errorElement: <ErrorBoundary />
      },
      { 
        path: "/edit-profile", 
        element: <ProtectedRoute><EditProfile /></ProtectedRoute>,
        errorElement: <ErrorBoundary />
      },
      { path: "/all-developers", element: <AllDevelopers /> },
      { 
        path: "/all-users", 
        element: <ProtectedRoute><AllUsers /></ProtectedRoute>,
        errorElement: <ErrorBoundary />
      },
      { 
        path: "/notifications", 
        element: <ProtectedRoute><Notifications /></ProtectedRoute>,
        errorElement: <ErrorBoundary />
      },
      // IMPORTANT FIX: Add this route to handle dynamic chat IDs
      { 
        path: "/chat/:chatId", // This path now expects a dynamic parameter
        element: <ProtectedRoute><Chat /></ProtectedRoute>,
        errorElement: <ErrorBoundary />
      },
      { 
        path: "/chat", // Keep this for the base /chat route without a specific ID
        element: <ProtectedRoute><Chat /></ProtectedRoute>,
        errorElement: <ErrorBoundary />
      },
      { path: "/jobs", element: <Jobs /> },
      { path: "/projects", element: <Projects /> },
      { 
        path: "/create-post", 
        element: <ProtectedRoute><CreatePost /></ProtectedRoute>,
        errorElement: <ErrorBoundary />
      },
      { 
        path: "/feed", 
        element: <ProtectedRoute><Feed /></ProtectedRoute>,
        errorElement: <ErrorBoundary />
      },
    ],
  },
]);

export default router;
