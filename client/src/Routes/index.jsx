import { createBrowserRouter } from 'react-router-dom';
import App from '../App'; // Layout with shared Navbar
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import MyProfile from '../Pages/MyProfile';
import EditProfile from '../Pages/EditProfile';
import AllDevelopers from '../Pages/AllDevelopers';
import Notifications from '../Pages/Notifications'; // ✅ Newly added
import Chat from '../Pages/Chat'; // ✅ Newly added
import About from '../Pages/Projects'; // ✅ Newly added
import Projects from '../Pages/Projects';
import Jobs from '../Pages/Jobs';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/my-profile/:id", element:<MyProfile />},
      { path: "/edit-profile", element: <EditProfile /> },
      { path: "/all-developers", element: <AllDevelopers /> },
      { path: "/notifications", element: <Notifications /> }, // ✅
      { path: "/chat", element: <Chat /> }, // ✅
      { path: "/jobs", element: <Jobs/> }, // ✅
      { path: "/projects", element: <Projects/> }, // ✅
    ],
  },
]);

export default router;
