import React, { useState } from "react";
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
  const { login ,user} = useAuth(); // ❗ don't use user here during login

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg">
            <FaCode className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-600 text-lg">Sign in to your developer account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Sign In</h2>
            <p className="text-blue-100 mt-1">Access your developer dashboard</p>
          </div>

          <div className="p-6">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  console.log({ ...values, rememberMe });
                  const res = await login(values.email, values.password);

                  if (res.success) {
                    toast.success("✅ Login successful!");
                    resetForm();
                   navigate(`/my-profile/${user._id}`);
                  } else {
                    toast.error("❌ " + (res.message || "Login failed!"));
                  }
                } catch (error) {
                  console.error("Login Error:", error);
                  toast.error("❌ Login failed. Please try again.");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        className="pl-10 w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-blue-500 focus:bg-white text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-blue-500 focus:bg-white text-gray-900 placeholder-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50"
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
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button type="button" className="flex items-center justify-center px-4 py-3 border rounded-xl text-sm text-gray-700 bg-white hover:border-gray-400">
                      <FaGoogle className="text-red-500 text-lg" />
                    </button>
                    <button type="button" className="flex items-center justify-center px-4 py-3 border rounded-xl text-sm text-gray-700 bg-white hover:border-gray-400">
                      <FaGithub className="text-gray-800 text-lg" />
                    </button>
                    <button type="button" className="flex items-center justify-center px-4 py-3 border rounded-xl text-sm text-gray-700 bg-white hover:border-gray-400">
                      <FaLinkedin className="text-blue-600 text-lg" />
                    </button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-600">
                      Don’t have an account?{" "}
                      <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
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
