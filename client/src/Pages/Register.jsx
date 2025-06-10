import React, { useState } from "react";
import { Formik, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  FaUser,
  FaBriefcase,
  FaMapMarkerAlt,
  FaEnvelope,
  FaLock,
  FaImage,
  FaEye,
  FaEyeSlash,
  FaCode,
} from "react-icons/fa";
import { MdAdd, MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  headline: Yup.string().required("Headline is required"),
  skills: Yup.array()
    .of(Yup.string().required("Skill cannot be empty"))
    .min(1, "At least one skill required"),
  location: Yup.string().required("Location is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
  category: Yup.string()
    .oneOf(["frontend", "backend", "fullstack", "ai", "mobile", "other"], "Invalid category")
    .required("Category is required"),
  isPublic: Yup.boolean(),
});

const Register = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/5 backdrop-blur-sm"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-4 shadow-lg shadow-cyan-500/25">
            <FaCode className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Join Our Developer Community
          </h1>
          <p className="text-slate-300 text-lg mt-2">
            Create your profile and showcase your skills
          </p>
        </div>

        <div className="bg-slate-700/30 backdrop-blur-lg rounded-2xl border border-slate-600/30 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <Formik
              initialValues={{
                fullName: "",
                headline: "",
                skills: [""],
                location: "",
                email: "",
                password: "",
                confirmPassword: "",
                category: "other",
                isPublic: false,
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const formData = new FormData();
                  formData.append("fullName", values.fullName);
                  formData.append("headline", values.headline);
                  formData.append("location", values.location);
                  formData.append("email", values.email);
                  formData.append("password", values.password);
                  formData.append("skills", JSON.stringify(values.skills));
                  formData.append("category", values.category);
                  formData.append("isPublic", values.isPublic);

                  if (profileImage) {
                    formData.append("profileImage", profileImage);
                  }

                  const res = await registerUser(formData);

                  setSubmitting(false);

                  if (res.success) {
                    toast.success("Registration successful! Redirecting to login...");
                    navigate("/login");
                  } else {
                    toast.error(`❌ Registration failed: ${res.message}`);
                  }
                } catch (err) {
                  setSubmitting(false);
                  toast.error("🚨 Something went wrong during registration.");
                }
              }}
            >
              {({ values, setFieldValue, isSubmitting, handleSubmit }) => (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
                      <div className="w-2 h-6 bg-cyan-400 rounded-full mr-3"></div>
                      Personal Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
                          <Field
                            name="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            className="pl-10 w-full bg-slate-800/50 border border-slate-600/50 rounded-xl py-3 px-4 text-slate-300 placeholder-slate-500 outline-none focus:border-cyan-400 focus:bg-slate-800 transition-all duration-300"
                          />
                        </div>
                        <ErrorMessage
                          name="fullName"
                          component="div"
                          className="text-red-400 text-sm mt-1"
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Professional Headline
                        </label>
                        <div className="relative">
                          <FaBriefcase className="absolute top-1/2 left-3 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
                          <Field
                            name="headline"
                            type="text"
                            placeholder="e.g., Full Stack Developer"
                            className="pl-10 w-full bg-slate-800/50 border border-slate-600/50 rounded-xl py-3 px-4 text-slate-300 placeholder-slate-500 outline-none focus:border-cyan-400 focus:bg-slate-800 transition-all duration-300"
                          />
                        </div>
                        <ErrorMessage
                          name="headline"
                          component="div"
                          className="text-red-400 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Location
                        </label>
                        <div className="relative">
                          <FaMapMarkerAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
                          <Field
                            name="location"
                            type="text"
                            placeholder="City, Country"
                            className="pl-10 w-full bg-slate-800/50 border border-slate-600/50 rounded-xl py-3 px-4 text-slate-300 placeholder-slate-500 outline-none focus:border-cyan-400 focus:bg-slate-800 transition-all duration-300"
                          />
                        </div>
                        <ErrorMessage
                          name="location"
                          component="div"
                          className="text-red-400 text-sm mt-1"
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Category
                        </label>
                        <div className="relative">
                          <FaCode className="absolute top-1/2 left-3 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
                          <Field
                            as="select"
                            name="category"
                            className="pl-10 w-full bg-slate-800/50 border border-slate-600/50 rounded-xl py-3 px-4 text-slate-300 outline-none focus:border-cyan-400 focus:bg-slate-800 transition-all duration-300"
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
                          className="text-red-400 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div className="relative mt-4">
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
                        <Field
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="pl-10 w-full bg-slate-800/50 border border-slate-600/50 rounded-xl py-3 px-4 text-slate-300 placeholder-slate-500 outline-none focus:border-cyan-400 focus:bg-slate-800 transition-all duration-300"
                        />
                      </div>
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-400 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
                      <div className="w-2 h-6 bg-purple-400 rounded-full mr-3"></div>
                      Technical Skills
                    </h3>

                    <FieldArray name="skills">
                      {({ remove, push }) => (
                        <div className="space-y-3">
                          {values.skills.map((_, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="flex-1">
                                <Field
                                  name={`skills[${index}]`}
                                  placeholder={`Skill #${index + 1} (e.g., React, Python, AWS)`}
                                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl py-3 px-4 text-slate-300 placeholder-slate-500 outline-none focus:border-purple-400 focus:bg-slate-800 transition-all duration-300"
                                />
                              </div>
                              {values.skills.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="flex items-center justify-center w-10 h-10 text-red-400 hover:text-red-300 hover:bg-slate-700/50 rounded-lg transition-all duration-300"
                                  aria-label="Remove skill"
                                >
                                  <MdDelete className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => push("")}
                            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300"
                          >
                            <MdAdd className="w-5 h-5" />
                            Add Another Skill
                          </button>
                        </div>
                      )}
                    </FieldArray>
                    <ErrorMessage
                      name="skills"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
                      <div className="w-2 h-6 bg-teal-400 rounded-full mr-3"></div>
                      Account Security
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
                          <Field
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            className="pl-10 pr-10 w-full bg-slate-800/50 border border-slate-600/50 rounded-xl py-3 px-4 text-slate-300 placeholder-slate-500 outline-none focus:border-teal-400 focus:bg-slate-800 transition-all duration-300"
                          />
                          <button
                            type="button"
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-slate-400 hover:text-teal-400 transition-colors duration-300"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                          </button>
                        </div>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-400 text-sm mt-1"
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
                          <Field
                            name="confirmPassword"
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="pl-10 pr-10 w-full bg-slate-800/50 border border-slate-600/50 rounded-xl py-3 px-4 text-slate-300 placeholder-slate-500 outline-none focus:border-teal-400 focus:bg-slate-800 transition-all duration-300"
                          />
                          <button
                            type="button"
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-slate-400 hover:text-teal-400 transition-colors duration-300"
                            onClick={() => setShowConfirm(!showConfirm)}
                            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                          >
                            {showConfirm ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                          </button>
                        </div>
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-red-400 text-sm mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
                      <div className="w-2 h-6 bg-pink-400 rounded-full mr-3"></div>
                      Profile Picture
                    </h3>

                    <div className="border-2 border-dashed border-slate-600/50 rounded-xl p-6 text-center hover:border-cyan-400/50 transition-colors duration-300 bg-slate-800/30 backdrop-blur-sm">
                      <label className="cursor-pointer">
                        <FaImage className="mx-auto text-slate-400 text-3xl mb-3" />
                        <div className="text-slate-300 mb-2">
                          <span className="font-medium text-cyan-400">Click to upload</span> or drag and drop
                        </div>
                        <div className="text-sm text-slate-500">
                          PNG, JPG or GIF (max. 5MB)
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setProfileImage(e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                      {profileImage && (
                        <div className="mt-4 p-3 bg-slate-700/50 border border-cyan-400/50 rounded-lg">
                          <p className="text-cyan-400 font-medium">✓ {profileImage.name}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                      <Field
                        type="checkbox"
                        name="isPublic"
                        className="w-4 h-4 text-cyan-400 bg-slate-800/50 border-slate-600/50 rounded focus:ring-cyan-400 focus:ring-offset-0"
                      />
                      Make my profile public
                    </label>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating Account...
                        </div>
                      ) : (
                        "Create Developer Account"
                      )}
                    </button>
                  </div>

                  <div className="text-center text-sm text-slate-400 pt-4">
                    Already have an account?
                    <Link
                      to="/login"
                      className="text-cyan-400 hover:text-cyan-300 font-medium ml-1"
                    >
                      Sign in here
                    </Link>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;