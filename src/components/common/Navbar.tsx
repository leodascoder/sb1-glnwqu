import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Bell, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">InsureAI</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
            </button>

            <div className="relative">
              <button className="flex items-center space-x-2 text-sm focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <span className="hidden md:block font-medium text-gray-700">
                  {user?.name || 'User'}
                </span>
              </button>
            </div>

            <button
              onClick={logout}
              className="text-sm font-medium text-gray-700 hover:text-gray-800"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;