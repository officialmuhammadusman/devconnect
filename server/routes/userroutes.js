import express from 'express';
import upload from '../middlewares/multer.js';
import {
  registerUser,
  loginUser,
  getUserProfile,
  editUserProfile,
  getAllDevelopers, // ✅ Import the new controller
} from '../controllers/authController.js';
import verifyToken from '../middlewares/verifytoken.js';

const userrouter = express.Router();

userrouter.post('/register', upload.single('profileImage'), registerUser);
userrouter.post('/login', loginUser);
userrouter.get("/profile", verifyToken, getUserProfile);
userrouter.put('/profile', verifyToken, upload.single('profileImage'), editUserProfile);

// ✅ Add this new route to fetch all developers
userrouter.get('/developers', getAllDevelopers);

export default userrouter;
