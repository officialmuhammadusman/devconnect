import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCode,
  FaGoogle,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  // Redirect authenticated users to their profile
  useEffect(() => {
    if (!loading && user) {
      navigate(`/my-profile/${user._id}`, { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/5 backdrop-blur-sm"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-4 shadow-lg shadow-cyan-500/25">
            <FaCode className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome Back!
          </h1>
          <p className="text-slate-300 text-lg mt-2">
            Sign in to network with developers on DevConnect
          </p>
        </div>

        <div className="bg-slate-700/30 backdrop-blur-lg rounded-2xl border border-slate-600/30 shadow-xl overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 bg-slate-800/50 flex items-center justify-center z-20">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <div className="p-6 sm:p-8">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  const res = await login(values.email, values.password, rememberMe);

                  if (res.success && res.data?.user) {
                    toast.success("✅ Login successful!");
                    resetForm();
                    navigate(`/my-profile/${res.data.user._id}`, { replace: true });
                  } else {
                    toast.error(`❌ ${res.message || "Invalid email or password"}`);
                  }
                } catch (error) {
                  toast.error("❌ Invalid email or password. Please try again.");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        className="pl-10 w-full bg-slate-800/50 border border-slate-600/50 rounded-xl py-3 px-4 text-slate-300 placeholder-slate-500 outline-none focus:border-cyan-400 focus:bg-slate-800 transition-all duration-300"
                      />
                    </div>
                    <ErrorMessage name="email" component="div" className="text-red-400 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 w-full bg-slate-800/50 border border-slate-600/50 rounded-xl py-3 px-4 text-slate-300 placeholder-slate-500 outline-none focus:border-cyan-400 focus:bg-slate-800 transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-400 text-sm mt-1" />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-cyan-400 bg-slate-800/50 border-slate-600/50 rounded focus:ring-2 focus:ring-cyan-400 focus:ring-offset-0"
                      />
                      <span className="text-sm text-slate-400">Remember me</span>
                    </label>
                    <Link to="#" className="text-sm text-cyan-500 hover:text-cyan-400 font-medium transition-colors duration-300">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing In...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-600/50"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-slate-700/30 text-slate-400 backdrop-blur-lg">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl hover:border-cyan-400/50 transition-all duration-300"
                      title="Sign in with Google"
                    >
                      <FaGoogle className="text-red-500 text-lg" />
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl hover:border-cyan-400/50 transition-all duration-300"
                      title="Sign in with GitHub"
                    >
                      <FaGithub className="text-white text-lg" />
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl hover:border-cyan-400/50 transition-all duration-300"
                      title="Sign in with LinkedIn"
                    >
                      <FaLinkedin className="text-blue-500 text-lg" />
                    </button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-sm text-slate-400">
                      Don’t have an account?{" "}
                      <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-300">
                        Create one
                      </Link>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;