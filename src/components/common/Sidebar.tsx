import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Calendar,
  Users,
  FileText,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const customerLinks = [
    { name: 'Dashboard', icon: Home, path: '/customer/dashboard' },
    { name: 'Book Appointment', icon: Calendar, path: '/book-appointment' },
    { name: 'My Insurance', icon: FileText, path: '/insurance' },
    { name: 'Support', icon: HelpCircle, path: '/support' },
  ];

  const agentLinks = [
    { name: 'Dashboard', icon: Home, path: '/agent/dashboard' },
    { name: 'Appointments', icon: Calendar, path: '/agent/appointments' },
    { name: 'Customers', icon: Users, path: '/agent/customers' },
    { name: 'Settings', icon: Settings, path: '/agent/settings' },
  ];

  const links = user?.role === 'agent' ? agentLinks : customerLinks;

  return (
    <div className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)]">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.name}
                to={link.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {link.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;