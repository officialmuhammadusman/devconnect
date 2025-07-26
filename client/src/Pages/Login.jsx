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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-md">
            <FaCode className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-800">
            Welcome Back!
          </h1>
          <p className="text-slate-600 text-lg mt-2">
            Sign in to network with developers on DevConnect
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center z-20">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
                      className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-50 text-slate-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="w-full px-4 py-3 pl-10 pr-10 rounded-lg bg-gray-50 text-slate-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
                    <div
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>

                  {/* Remember me */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-slate-600 text-sm">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="mr-2"
                      />
                      Remember me
                    </label>
                    <Link to="/forgot-password" className="text-blue-600 text-sm hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </button>

                  {/* Divider */}
                  <div className="flex items-center justify-center text-slate-600 text-sm">
                    <span className="mx-2">or</span>
                  </div>

                  {/* Social logins */}
                  <div className="flex justify-center space-x-4">
                    <button type="button" className="text-slate-600 hover:text-blue-600 text-xl">
                      <FaGoogle />
                    </button>
                    <button type="button" className="text-slate-600 hover:text-blue-600 text-xl">
                      <FaGithub />
                    </button>
                    <button type="button" className="text-slate-600 hover:text-blue-600 text-xl">
                      <FaLinkedin />
                    </button>
                  </div>

                  {/* Register link */}
                  <div className="text-center text-slate-600 text-sm mt-4">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
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