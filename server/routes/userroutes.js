import express from 'express';
import upload from '../middlewares/multer.js';
import {
  registerUser,
  loginUser,
  getUserProfile,
  getUserProfileById,
  editUserProfile,
  getAllDevelopers,
  followUser,
  unfollowUser,
} from '../controllers/authController.js';
import verifyToken from '../middlewares/verifytoken.js';

const userrouter = express.Router();

userrouter.post('/register', upload.single('profileImage'), registerUser);
userrouter.post('/login', loginUser);
userrouter.get('/profile', verifyToken, getUserProfile);
userrouter.get('/profile/:id', verifyToken, getUserProfileById);
userrouter.put('/profile', verifyToken, upload.single('profileImage'), editUserProfile);
userrouter.get('/developers', getAllDevelopers);
userrouter.post('/follow/:id', verifyToken, followUser);
userrouter.post('/unfollow/:id', verifyToken, unfollowUser);

export default userrouter;