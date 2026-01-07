import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to ComplaintHub
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your trusted platform for managing complaints efficiently
        </p>
        <Link
          to="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to ComplaintHub
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        A comprehensive complaint management system with secure authentication
      </p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md text-lg font-medium"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;