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
      category: category || 'other', // Default to 'other' if not provided
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
    res.status(500).json({ success: false, message: "Server error while fetching profile" });
  }
};

// .....................Edit Profile........................
export const editUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, headline, skills, location, email, category, experience } = req.body;

    // Validate input
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Check if new email is already in use by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already registered"
        });
      }
    }

    // Prepare update object
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (headline) updateData.headline = headline;
    if (skills) updateData.skills = skills.split(',').map(s => s.trim());
    if (location) updateData.location = location;
    if (email) updateData.email = email;
    if (category) updateData.category = category;
    if (experience) updateData.experience = experience;

    // Handle profile image update
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'devconnect/profileImages',
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
      });
      updateData.profileImage = result.secure_url;
      
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
    }

    // Update user in database
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
// .................. Get All Developers ..................
export const getAllDevelopers = async (req, res) => {
  try {
    const { category } = req.query; // Get category from query parameters
    let query = {};

    if (category && category !== 'all') {
      query.category = category; // Filter by category if provided
    }

    const developers = await User.find(query)
      .select('-password -__v'); // Don't send password or Mongo version field

    return res.status(200).json({
      success: true,
      message: 'Developers fetched successfully',
      data: developers
    });
  } catch (error) {
    console.error("Get Developers Error:", error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching developers'
    });
  }
};