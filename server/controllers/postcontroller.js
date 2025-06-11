import Post from "../models/postmodel.js";
import User from "../models/usermodel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.userId;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "devconnect/posts",
        transformation: [{ width: 800, height: 600, crop: "limit" }],
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // Clean up local file
    }

    const newPost = new Post({
      user: userId,
      text,
      image: imageUrl,
    });

    await newPost.save();

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: {
        id: newPost._id,
        user: newPost.user,
        text: newPost.text,
        image: newPost.image,
        date: newPost.date,
      },
    });
  } catch (error) {
    console.error("Create Post Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Get posts for feed (self + following)
export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find user and their following list
    const user = await User.findById(userId).select("following");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get posts from self and following users
    const posts = await Post.find({
      user: { $in: [userId, ...(user.following || [])] },
    })
      .populate("user", "fullName profileImage")
      .sort({ date: -1 })
      .select("-__v");

    return res.status(200).json({
      success: true,
      message: "Feed posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    console.error("Get Feed Posts Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Get posts by specific user
export const getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await Post.find({ user: id })
      .populate("user", "fullName profileImage")
      .sort({ date: -1 })
      .select("-__v");

    if (!posts.length) {
      return res.status(404).json({
        success: false,
        message: "No posts found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    console.error("Get User Posts Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this post",
      });
    }

    if (post.image) {
      const publicId = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`devconnect/posts/${publicId}`);
    }

    await Post.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete Post Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};