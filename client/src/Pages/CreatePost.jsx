import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaRegCommentDots, FaSpinner } from "react-icons/fa";

const CreatePost = () => {
  const { token, createPost, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "error" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !token) {
      navigate("/login");
    }
  }, [token, authLoading, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setMessage({ text: "Only JPG or PNG images are allowed", type: "error" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: "Image size must be less than 5MB", type: "error" });
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setMessage({ text: "", type: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setMessage({ text: "Post text is required", type: "error" });
      return;
    }
    if (text.length > 255) {
      setMessage({ text: "Post cannot exceed 255 characters", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    const formData = new FormData();
    formData.append("text", text);
    if (image) {
      formData.append("image", image);
    }

    const result = await createPost(formData);

    setIsSubmitting(false);

    if (result.success) {
      setMessage({ text: "Post created successfully!", type: "success" });
      setText("");
      setImage(null);
      setImagePreview(null);
      setTimeout(() => navigate("/feed"), 2000);
    } else {
      setMessage({ text: result.message, type: "error" });
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    document.getElementById("image").value = "";
  };

  if (authLoading && !token) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-start px-4 py-8 pt-24">
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 max-w-lg w-full border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-4">
            <FaRegCommentDots className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Create a Post</h1>
            <p className="text-sm text-slate-300">Share your thoughts with the community</p>
          </div>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-3 rounded-xl text-sm ${
              message.type === "success"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-slate-300">
              Post Content
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              maxLength={255}
              rows={4}
              className="mt-1.5 block w-full bg-slate-700/50 border border-slate-600 rounded-xl p-3 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all sm:text-sm"
            />
            <p className="mt-1 text-xs text-slate-400 text-right">
              {text.length} / 255
            </p>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-slate-300">
              Add an Image (Optional)
            </label>
            <div className="mt-1.5 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-xl bg-slate-700/50">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-all"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-slate-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-slate-300">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer bg-slate-700/50 rounded-xl font-medium text-cyan-400 hover:text-cyan-300"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-400">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium py-3 px-4 rounded-xl hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-300 shadow-lg ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="w-5 h-5 animate-spin mr-2" /> Posting...
              </span>
            ) : (
              "Create Post"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;