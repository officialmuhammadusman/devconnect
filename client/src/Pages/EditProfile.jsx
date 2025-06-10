import React, { useState } from "react";
import { Formik, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  FaUser,
  FaBriefcase,
  FaMapMarkerAlt,
  FaEnvelope,
  FaCode,
  FaImage,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdAdd, MdDelete } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const validationSchema = Yup.object({
  fullName: Yup.string().optional(),
  headline: Yup.string().optional(),
  skills: Yup.array().of(Yup.string().optional()).optional(),
  location: Yup.string().optional(),
  email: Yup.string().email("Invalid email format").optional(),
  category: Yup.string()
    .oneOf(
      ["frontend", "backend", "fullstack", "ai", "mobile", "other"],
      "Invalid category"
    )
    .optional(),
  experience: Yup.string().optional(),
  isPublic: Yup.boolean().optional(),
});

const EditProfile = () => {
  const { user, editProfile } = useAuth();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Please log in to edit your profile
          </h2>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Edit Profile
              </h1>
              <p className="text-gray-600 mt-1">Update your developer profile</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {sidebarOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 bg-white/70 backdrop-blur-lg rounded-2xl p-6 h-fit sticky top-24 shadow-lg border border-white/20">
            <div className="flex items-center mb-6">
              <FaUserCircle className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
            </div>
            <nav className="space-y-2">
              <Link
                to={`/my-profile/${user._id}`}
                className="flex items-center p-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 rounded-xl transition-all duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <FaUserCircle className="w-4 h-4 mr-3" />
                View Profile
              </Link>
              <Link
                to="/login"
                className="flex items-center p-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 rounded-xl transition-all duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <FaSignOutAlt className="w-4 h-4 mr-3" />
                Login / Logout
              </Link>
            </nav>
          </aside>

          {/* Mobile Sidebar */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            >
              <aside
                className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                  <button onClick={() => setSidebarOpen(false)}>
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-2">
                  <Link
                    to={`/my-profile/${user._id}`}
                    className="flex items-center p-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 rounded-xl transition-all duration-200"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaUserCircle className="w-4 h-4 mr-3" />
                    View Profile
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center p-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 rounded-xl transition-all duration-200"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-3" />
                    Login / Logout
                  </Link>
                </nav>
              </aside>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
              <Formik
                initialValues={{
                  fullName: user.fullName || user.name || "",
                  headline: user.headline || user.role || "",
                  skills: user.skills || [""],
                  location: user.location || "",
                  email: user.email || "",
                  category: user.category || "other",
                  experience: user.experience || "0 years",
                  isPublic: user.isPublic || false,
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    console.log("Submitting edit profile with values:", values);
                    console.log("isPublic value:", values.isPublic);

                    const formData = new FormData();
                    if (values.fullName) formData.append("fullName", values.fullName);
                    if (values.headline) formData.append("headline", values.headline);
                    if (values.location) formData.append("location", values.location);
                    if (values.email) formData.append("email", values.email);
                    if (values.skills.length > 0)
                      formData.append("skills", values.skills.join(", "));
                    if (values.category) formData.append("category", values.category);
                    if (values.experience)
                      formData.append("experience", values.experience);
                    if (profileImage) formData.append("profileImage", profileImage);
                    formData.append("isPublic", values.isPublic.toString());

                    const res = await editProfile(formData);

                    setSubmitting(false);

                    if (res.success) {
                      toast.success("Profile updated successfully!");
                      navigate(`/my-profile/${user._id}`);
                    } else {
                      toast.error(`❌ Update failed: ${res.message}`);
                    }
                  } catch (err) {
                    setSubmitting(false);
                    toast.error("🚨 Something went wrong during profile update.");
                  }
                }}
              >
                {({ values, setFieldValue, isSubmitting, handleSubmit }) => (
                  <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* Personal Information Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <FaUser className="w-5 h-5 text-blue-600 mr-2" />
                        Personal Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Field
                              name="fullName"
                              type="text"
                              placeholder="Enter your full name"
                              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 bg-white/80"
                            />
                          </div>
                          <ErrorMessage
                            name="fullName"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Professional Headline
                          </label>
                          <div className="relative">
                            <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Field
                              name="headline"
                              type="text"
                              placeholder="e.g., Full Stack Developer"
                              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 bg-white/80"
                            />
                          </div>
                          <ErrorMessage
                            name="headline"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <div className="relative">
                            <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Field
                              name="location"
                              type="text"
                              placeholder="City, Country"
                              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 bg-white/80"
                            />
                          </div>
                          <ErrorMessage
                            name="location"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <div className="relative">
                            <FaCode className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Field
                              as="select"
                              name="category"
                              className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 bg-white/80 appearance-none"
                            >
                              <option value="other">Select Category</option>
                              <option value="frontend">Frontend</option>
                              <option value="backend">Backend</option>
                              <option value="fullstack">Full Stack</option>
                              <option value="ai">AI/ML</option>
                              <option value="mobile">Mobile</option>
                              <option value="other">Other</option>
                            </Field>
                          </div>
                          <ErrorMessage
                            name="category"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Experience
                          </label>
                          <div className="relative">
                            <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Field
                              name="experience"
                              type="text"
                              placeholder="e.g., 5 years"
                              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 bg-white/80"
                            />
                          </div>
                          <ErrorMessage
                            name="experience"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Field
                              name="email"
                              type="email"
                              placeholder="Enter your email"
                              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 bg-white/80"
                            />
                          </div>
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Skills Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <FaCode className="w-5 h-5 text-blue-600 mr-2" />
                        Skills
                      </h3>
                      <FieldArray name="skills">
                        {({ push, remove }) => (
                          <div className="space-y-4">
                            {values.skills.map((_, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <div className="relative flex-1">
                                  <FaCode className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                  <Field
                                    name={`skills[${index}]`}
                                    placeholder="e.g., JavaScript"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 bg-white/80"
                                  />
                                  <ErrorMessage
                                    name={`skills[${index}]`}
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                  />
                                </div>
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-2 text-red-600 hover:text-red-800 transition-all duration-200"
                                  >
                                    <MdDelete className="w-6 h-6" />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => push("")}
                              className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-all duration-200"
                            >
                              <MdAdd className="w-5 h-5 mr-1" /> Add Skill
                            </button>
                          </div>
                        )}
                      </FieldArray>
                      <ErrorMessage
                        name="skills"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    {/* Profile Image Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <FaImage className="w-5 h-5 text-blue-600 mr-2" />
                        Profile Image
                      </h3>
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload New Profile Image
                        </label>
                        <div className="relative">
                          <FaImage className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                              setProfileImage(event.currentTarget.files[0])
                            }
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 bg-white/80"
                          />
                        </div>
                      </div>
                    </div>

                    

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                    >
                      {isSubmitting ? "Updating..." : "Update Profile"}
                    </button>
                  </form>
                )}
              </Formik>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;