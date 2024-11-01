import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, MessageSquare } from 'lucide-react';

function CustomerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/book-appointment"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Book Appointment</p>
              <p className="text-sm text-gray-500">Schedule a meeting with an agent</p>
            </div>
          </div>
        </Link>

        <Link
          to="/insurance"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My Insurance</p>
              <p className="text-sm text-gray-500">View your insurance details</p>
            </div>
          </div>
        </Link>

        <Link
          to="/support"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Support</p>
              <p className="text-sm text-gray-500">Get help and support</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Upcoming Appointments</h2>
        {/* Appointment list component will be added here */}
      </div>
    </div>
  );
}

export default CustomerDashboard;