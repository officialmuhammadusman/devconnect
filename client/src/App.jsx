import { Outlet } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify'; // ✅ import ToastContainer
import 'react-toastify/dist/ReactToastify.css';  // ✅ import default CSS

const App = () => {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false} 
          newestOnTop={false} 
          closeOnClick 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover 
          theme="colored"
        />
      </div>
    </AuthProvider>
  );
};

export default App;
