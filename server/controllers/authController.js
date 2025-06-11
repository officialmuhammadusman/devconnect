import User from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// ........................ Register User......................
export const registerUser = async (req, res) => {
  try {
    const { fullName, headline, skills, location, email, password, category } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address"
      });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password is not strong enough"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profileImageUrl = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'devconnect/profileImages',
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
      });
      profileImageUrl = result.secure_url;

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
    }

    // Calculate experience based on current date
    const registrationDate = new Date();
    const yearsOfExperience = Math.floor((new Date() - registrationDate) / (1000 * 60 * 60 * 24 * 365));
    const experience = `${yearsOfExperience} years`;

    const newUser = new User({
      fullName,
      headline,
      skills: skills.split(',').map(s => s.trim()),
      location,
      email,
      password: hashedPassword,
      profileImage: profileImageUrl,
      category: category || 'other',
      experience
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profileImage: newUser.profileImage,
          category: newUser.category,
          experience: newUser.experience,
          location: newUser.location
        }
      }
    });
  } catch (error) {
    console.error('Register Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

//....................... Login User............................
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          profileImage: user.profileImage,
          category: user.category,
          experience: user.experience,
          location: user.location
        }
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later."
    });
  }
};

// ......................get user Profile..................
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while fetching" });
  }
};

// .....................get User Profile by ID..................
export const getUserProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the authenticated user is following this user
    const currentUserId = req.user.userId;
    const isFollowing = await User.findById(currentUserId).select("following -_id");
    const following = isFollowing ? isFollowing.following : [];
    const followingCount = following.length;
    const followersCount = user.followers ? user.followers.length : 0;

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: {
        ...user.toObject(),
        isFollowing: following.includes(id),
        followersCount,
        followingCount,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while fetching" });
  }
};

// .....................Edit Profile........................
export const editUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, headline, skills, location, email, category, experience } = req.body;

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already registered"
        });
      }
    }

    const updateData = {};
    if (fullName) {
      updateData.fullName = fullName;
    }
    if (headline) {
      updateData.headline = headline;
    }
    if (skills) {
      updateData.skills = skills.split(',').map(s => s.trim());
    }
    if (location) {
      updateData.location = location;
    }
    if (email) {
      updateData.email = email;
    }
    if (category) {
      updateData.category = category;
    }
    if (experience) {
      updateData.experience = experience;
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'devconnect/profileImages',
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
      });
      updateData.profileImage = result.secure_url;
      
      fs.unlinkSync(req.file.path);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        headline: updatedUser.headline,
        skills: updatedUser.skills,
        location: updatedUser.location,
        profileImage: updatedUser.profileImage,
        category: updatedUser.category,
        experience: updatedUser.experience
      }
    });
  } catch (error) {
    console.error("Edit Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later."
    });
  }
};

// .................. Get All Developers ..................
export const getAllDevelopers = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category && category !== "all") {
      query.category = category;
    }

    const developers = await User.find(query).select("-password -__v");
    const currentUserId = req.user?.userId; // Optional chaining in case no user is logged in

    const usersWithFollowing = developers.map(user => {
      const isFollowing = currentUserId ? user.followers.includes(currentUserId) : false;
      return {
        ...user.toObject(),
        isFollowing,
        followersCount: user.followers ? user.followers.length : 0,
        followingCount: user.following ? user.following.length : 0,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Developers fetched successfully",
      data: usersWithFollowing,
    });
  } catch (error) {
    console.error("Get Developers Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching developers",
    });
  }
};

// .................. Follow User ..................
export const followUser = async (req, res) => {
  try {
    const userId = req.user.userId; // Current user
    const { id } = req.params; // Target user to follow

    if (userId === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself"
      });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User to follow not found"
      });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found"
      });
    }

    // Check if already following
    if (currentUser.following.includes(id)) {
      return res.status(400).json({
        success: false,
        message: "You are already following this user"
      });
    }

    // Update current user's following and target user's followers
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { following: id } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      id,
      { $addToSet: { followers: userId } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully followed user"
    });
  } catch (error) {
    console.error("Follow User Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later."
    });
  }
};

// .................. Unfollow User ..................
export const unfollowUser = async (req, res) => {
  try {
    const userId = req.user.userId; // Current user
    const { id } = req.params; // Target user to unfollow

    if (userId === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot unfollow yourself"
      });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User to unfollow not found"
      });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found"
      });
    }

    // Check if not following
    if (!currentUser.following.includes(id)) {
      return res.status(400).json({
        success: false,
        message: "You are not following this user"
      });
    }

    // Update current user's following and target user's followers
    await User.findByIdAndUpdate(
      userId,
      { $pull: { following: id } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      id,
      { $pull: { followers: userId } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully unfollowed user"
    });
  } catch (error) {
    console.error("Unfollow User Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later."
    });
  }
};