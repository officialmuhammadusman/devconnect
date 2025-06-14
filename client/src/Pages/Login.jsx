import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
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
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && user._id) {
      navigate(`/my-profile/${user._id}`, { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
      console.log("🔐 Attempting login with:", values);

      const res = await login(values.email, values.password, rememberMe);

      console.log("📦 Login response:", res);

      if (res.success && res.user) {
        const token = localStorage.getItem("token");
        console.log("🪙 JWT token from storage:", token);

        const decoded = jwtDecode(token);
        console.log("📜 Decoded JWT:", decoded);

        const userId = res.user._id || decoded?.userId;
        console.log("👤 Resolved userId:", userId);

        if (!userId) {
          throw new Error("Unable to determine user ID from login response or token");
        }

        toast.success("✅ Login successful!");
        resetForm();

        // ✅ Try-catch safe navigation
        setTimeout(() => navigate(`/my-profile/${userId}`, { replace: true }), 0);
      } else {
        toast.error(`❌ ${res.message || "Invalid email or password"}`);
      }
    } catch (error) {
      toast.error("❌ Login failed. Check credentials or try again.");
      console.error("🚨 Login error:", error);
    } finally {
      setSubmitting(false);
    }
  }}
>

              {({ isSubmitting }) => (
                <Form className="space-y-5">

                  {/* Email */}
                  <div className="relative">
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="w-full px-4 py-3 pl-10 rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="w-full px-4 py-3 pl-10 pr-10 rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" />
                    <div
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  {/* Remember me */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-slate-300 text-sm">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="mr-2"
                      />
                      Remember me
                    </label>
                    <Link to="/forgot-password" className="text-cyan-400 text-sm hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-300"
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </button>

                  {/* Divider */}
                  <div className="flex items-center justify-center text-slate-400 text-sm">
                    <span className="mx-2">or</span>
                  </div>

                  {/* Social logins */}
                  <div className="flex justify-center space-x-4">
                    <button type="button" className="text-white hover:text-cyan-400 text-xl">
                      <FaGoogle />
                    </button>
                    <button type="button" className="text-white hover:text-cyan-400 text-xl">
                      <FaGithub />
                    </button>
                    <button type="button" className="text-white hover:text-cyan-400 text-xl">
                      <FaLinkedin />
                    </button>
                  </div>

                  {/* Register link */}
                  <div className="text-center text-slate-300 text-sm mt-4">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-cyan-400 hover:underline">
                      Register
                    </Link>
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
