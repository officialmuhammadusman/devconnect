import { createBrowserRouter } from 'react-router-dom';
import App from '../App'; // Layout with shared Navbar
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import MyProfile from '../Pages/MyProfile';
import EditProfile from '../Pages/EditProfile';
import AllDevelopers from '../Pages/AllDevelopers';
import AllUsers from '../Pages/AllUsers'; // Ensure this import is correct
import Notifications from '../Pages/Notifications';
import Chat from '../Pages/Chat';
import Projects from '../Pages/Projects';
import Jobs from '../Pages/Jobs';
import CreatePost from '../Pages/CreatePost';
import Feed from '../Pages/Feed';
import { useAuth } from '../context/AuthContext'; // For ProtectedRoute
import { Navigate } from 'react-router-dom';

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
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/my-profile/:id", element: <ProtectedRoute><MyProfile /></ProtectedRoute> },
      { path: "/edit-profile", element: <ProtectedRoute><EditProfile /></ProtectedRoute> },
      { path: "/all-developers", element: <AllDevelopers /> },
      { path: "/all-users", element: <ProtectedRoute><AllUsers /></ProtectedRoute> }, // Verify this matches the file structure
      { path: "/notifications", element: <ProtectedRoute><Notifications /></ProtectedRoute> },
      { path: "/chat", element: <ProtectedRoute><Chat /></ProtectedRoute> },
      { path: "/jobs", element: <Jobs /> },
      { path: "/projects", element: <Projects /> },
      { path: "/create-post", element: <ProtectedRoute><CreatePost /></ProtectedRoute> },
      { path: "/feed", element: <ProtectedRoute><Feed /></ProtectedRoute> },
    ],
  },
]);

export default router;