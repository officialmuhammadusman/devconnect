import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    headline: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    skills: [{ type: String }],
    profileImage: { type: String, trim: true }, // stores Cloudinary URL or filename
    category: { type: String, enum: ['frontend', 'backend', 'fullstack', 'ai', 'mobile', 'other'], default: 'other' },
    experience: { type: String, default: '0 years' } // Will be calculated based on registration time
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;