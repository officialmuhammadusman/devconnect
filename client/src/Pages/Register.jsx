import React, { useState } from 'react';
import { Formik, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
  FaUser, FaBriefcase, FaMapMarkerAlt, FaEnvelope, FaLock, FaImage, FaEye, FaEyeSlash, FaCode
} from 'react-icons/fa';
import { MdAdd, MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';

const validationSchema = Yup.object({
  fullName: Yup.string().required('Full Name is required'),
  headline: Yup.string().required('Headline is required'),
  skills: Yup.array().of(Yup.string().required('Skill cannot be empty')).min(1, 'At least one skill required'),
  location: Yup.string().required('Location is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm your password'),
});

const Register = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg">
            <FaCode className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Our Developer Community</h1>
          <p className="text-gray-600 text-lg">Create your profile and showcase your skills</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-blue-600 px-8 py-6">
            <h2 className="text-xl font-semibold text-white">Registration Form</h2>
            <p className="text-blue-100 mt-1">Fill in your details to get started</p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <Formik
              initialValues={{
                fullName: '',
                headline: '',
                skills: [''],
                location: '',
                email: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                console.log({ ...values, profileImage });
                alert('Form submitted successfully!');
                setSubmitting(false);
              }}
            >
              {({ values, setFieldValue, isSubmitting, handleSubmit }) => (
                <div className="space-y-6" onSubmit={handleSubmit}>
                  {/* Personal Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-2 h-6 bg-blue-600 rounded-full mr-3"></div>
                      Personal Information
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <div className="relative">
                          <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                          <Field
                            name="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            className="pl-10 w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-blue-500 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                          />
                        </div>
                        <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Headline */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Headline</label>
                        <div className="relative">
                          <FaBriefcase className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                          <Field
                            name="headline"
                            type="text"
                            placeholder="e.g., Full Stack Developer"
                            className="pl-10 w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-blue-500 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                          />
                        </div>
                        <ErrorMessage name="headline" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      {/* Location */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <div className="relative">
                          <FaMapMarkerAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                          <Field
                            name="location"
                            type="text"
                            placeholder="City, Country"
                            className="pl-10 w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-blue-500 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                          />
                        </div>
                        <ErrorMessage name="location" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                          <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                          <Field
                            name="email"
                            type="email"
                            placeholder="your.email@example.com"
                            className="pl-10 w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-blue-500 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                          />
                        </div>
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-2 h-6 bg-green-500 rounded-full mr-3"></div>
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
                                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-green-500 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                                />
                              </div>
                              {values.skills.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="flex items-center justify-center w-10 h-10 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  aria-label="Remove skill"
                                >
                                  <MdDelete size={20} />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => push('')}
                            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                          >
                            <MdAdd size={18} />
                            Add Another Skill
                          </button>
                        </div>
                      )}
                    </FieldArray>
                    <ErrorMessage name="skills" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Security Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-2 h-6 bg-purple-500 rounded-full mr-3"></div>
                      Account Security
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Password */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                          <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                          <Field
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a strong password"
                            className="pl-10 pr-10 w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-purple-500 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                          />
                          <button
                            type="button"
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Confirm Password */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <div className="relative">
                          <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                          <Field
                            name="confirmPassword"
                            type={showConfirm ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            className="pl-10 pr-10 w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-purple-500 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                          />
                          <button
                            type="button"
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                            onClick={() => setShowConfirm(!showConfirm)}
                            aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                          >
                            {showConfirm ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  </div>

                  {/* Profile Image Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-2 h-6 bg-orange-500 rounded-full mr-3"></div>
                      Profile Picture
                    </h3>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors">
                      <label className="cursor-pointer">
                        <FaImage className="mx-auto text-gray-400 text-3xl mb-3" />
                        <div className="text-gray-600 mb-2">
                          <span className="font-medium text-orange-600">Click to upload</span> or drag and drop
                        </div>
                        <div className="text-sm text-gray-500">PNG, JPG or GIF (max. 5MB)</div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setProfileImage(e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                      {profileImage && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-700 font-medium">✓ {profileImage.name}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating Account...
                        </div>
                      ) : (
                        'Create Developer Account'
                      )}
                    </button>
                  </div>

                  {/* Footer Text */}
                  <Link to={'/login'}>
                  <div className="text-center text-sm text-gray-500 pt-4">
                    Already have an account? 
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium ml-1">Sign in here</a>
                  </div>
                  </Link>
                </div>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;