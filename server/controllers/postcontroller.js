import Post from "../models/postmodel.js";
import User from "../models/usermodel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import Notification from "../models/Notification.js";

// Utility function to extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const publicIdWithExtension = parts[parts.length - 1];
  return publicIdWithExtension.split(".")[0];
};

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
    const userId = req.user.userId; // Find user and their following list

    const user = await User.findById(userId).select("following");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } // Get posts from self and following users

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

    return res.status(200).json({
      success: true,
      message:
        posts.length > 0
          ? "User posts fetched successfully"
          : "No posts found for this user",
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
      const publicId = getPublicIdFromUrl(post.image);
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

// Like a post
export const likePost = async (req, res) => {
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

    if (post.likes.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Post already liked",
      });
    }

    post.likes.push(userId);
    await post.save(); // Create notification

    if (post.user.toString() !== userId) {
      const sender = await User.findById(userId).select("fullName");
      const notification = new Notification({
        userId: post.user,
        senderId: userId,
        type: "like",
        postId: id,
        message: `${sender.fullName} liked your post`,
      });
      await notification.save(); // Emit notification via Socket.IO (assuming req.io is available)

      if (req.io) {
        req.io.to(post.user.toString()).emit("notification", notification);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Post liked successfully",
      data: { likes: post.likes },
    });
  } catch (error) {
    console.error("Like Post Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Comment on a post
export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = {
      user: userId,
      text,
      createdAt: new Date(),
    };
    post.comments.push(comment);
    await post.save(); // Create notification

    if (post.user.toString() !== userId) {
      const sender = await User.findById(userId).select("fullName");
      const notification = new Notification({
        userId: post.user,
        senderId: userId,
        type: "comment",
        postId: id,
        message: `${sender.fullName} commented on your post`,
      });
      await notification.save(); // Emit notification via Socket.IO (assuming req.io is available)

      if (req.io) {
        req.io.to(post.user.toString()).emit("notification", notification);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      data: { comments: post.comments },
    });
  } catch (error) {
    console.error("Comment Post Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @route PUT /api/posts/:id
 * @description Allows the owner to edit a post's text and/or replace its image.
 * @access Private (only post owner)
 */
export const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    } // Check if the current user is the owner of the post

    if (post.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to edit this post",
      });
    } // Update post text if provided

    if (text !== undefined) {
      // Allow empty string text
      post.text = text;
    } // Handle image replacement

    if (req.file) {
      // If there's an old image, delete it from Cloudinary
      if (post.image) {
        const publicId = getPublicIdFromUrl(post.image);
        try {
          await cloudinary.uploader.destroy(`devconnect/posts/${publicId}`);
        } catch (cloudinaryErr) {
          console.warn(
            `Cloudinary deletion warning: Could not delete old image for post ${id}, publicId: ${publicId}. Error: ${cloudinaryErr.message}`
          ); // Continue with update even if old image deletion fails
        }
      } // Upload the new image

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "devconnect/posts",
        transformation: [{ width: 800, height: 600, crop: "limit" }],
      });
      post.image = result.secure_url;
      fs.unlinkSync(req.file.path); // Clean up local file
    }

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: {
        id: post._id,
        user: post.user,
        text: post.text,
        image: post.image,
        date: post.date,
      },
    });
  } catch (error) {
    console.error("Edit Post Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

/**
 * @route POST /api/posts/share/:id
 * @description Clones a post and creates a new one for the current user.
 * @access Private
 */
export const sharePost = async (req, res) => {
  try {
    console.log("Share Post Request Received:", {
      params: req.params,
      user: req.user,
      body: req.body,
    });

    const { id } = req.params;
    if (!req.user || !req.user.userId) {
      console.log("Authentication Error: User not found in request");
      return res.status(401).json({
        success: false,
        message: "Authentication error: User not found",
      });
    }
    const userId = req.user.userId;
    console.log("User ID extracted:", userId);

    const originalPost = await Post.findById(id).populate("user", "fullName");
    console.log("Original Post Query Result:", originalPost);
    if (!originalPost) {
      console.log("Original post not found for ID:", id);
      return res.status(404).json({
        success: false,
        message: "Original post not found",
      });
    }

    let sharedText = originalPost.text;
    if (originalPost.user && originalPost.user.fullName) {
      sharedText = `Shared from ${originalPost.user.fullName}:\n\n${originalPost.text}`;
    }
    console.log("Shared Text Prepared:", sharedText);

    const newSharedPost = new Post({
      user: userId,
      text: sharedText,
      image: originalPost.image || "", // Keep the same image if it exists
      likes: [],
      comments: [],
    });
    console.log("New Shared Post Object:", newSharedPost);
    await newSharedPost.save();
    console.log("New shared post saved successfully, ID:", newSharedPost._id);

    if (originalPost.user.toString() !== userId) {
      const sender = await User.findById(userId).select("fullName");
      console.log("Sender Query Result:", sender);
      if (!sender) {
        console.log("Sender not found for userId:", userId);
        throw new Error("Sender user not found");
      }
      const notification = new Notification({
        userId: originalPost.user, // The original post author is the recipient
        senderId: userId, // The current user (sharer) is the sender
        type: "share",
        postId: originalPost._id, // Reference to the original post
        message: `${sender.fullName} shared your post`,
      });
      console.log("Notification Object:", notification);
      await notification.save();
      console.log("Notification saved successfully, ID:", notification._id);

      if (req.io) {
        req.io.to(originalPost.user.toString()).emit("notification", notification);
        console.log("Notification emitted to user:", originalPost.user.toString());
      } else {
        console.warn("req.io is undefined, notification not emitted");
      }
    }

    return res.status(201).json({
      success: true,
      message: "Post shared successfully",
      data: {
        id: newSharedPost._id,
        user: newSharedPost.user,
        text: newSharedPost.text,
        image: newSharedPost.image,
        date: newSharedPost.date,
      },
    });
  } catch (error) {
    console.error("Share Post Error:", {
      message: error.message,
      stack: error.stack,
      params: req.params,
      user: req.user,
    });
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
