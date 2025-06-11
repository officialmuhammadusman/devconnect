import express from 'express';
import upload from '../middlewares/multer.js';
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  deletePost,
} from '../controllers/postcontroller.js';
import verifyToken from '../middlewares/verifytoken.js';

const postRouter = express.Router();

postRouter.post('/create', verifyToken, upload.single('image'), createPost);
postRouter.get('/feed', verifyToken, getFeedPosts);
postRouter.get('/user/:id', verifyToken, getUserPosts);
postRouter.delete('/:id', verifyToken, deletePost);

export default postRouter;