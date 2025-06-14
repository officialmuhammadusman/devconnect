import express from 'express';
import upload from '../middlewares/multer.js';
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  deletePost,
  likePost,
  commentPost,
  editPost, // Import the new editPost controller
  sharePost, // Import the new sharePost controller
} from '../controllers/postController.js';
import verifyToken from '../middlewares/verifytoken.js';

const postRouter = express.Router();

// Existing Routes
postRouter.post('/', verifyToken, upload.single('image'), createPost);
postRouter.get('/feed', verifyToken, getFeedPosts);
postRouter.get('/user/:id', verifyToken, getUserPosts);
postRouter.delete('/:id', verifyToken, deletePost);
postRouter.post('/like/:id', verifyToken, likePost);
postRouter.post('/comment/:id', verifyToken, commentPost);

// New API Functionalities


postRouter.put('/:id', verifyToken, upload.single('image'), editPost);


postRouter.post('/share/:id', verifyToken, sharePost);

export default postRouter;
