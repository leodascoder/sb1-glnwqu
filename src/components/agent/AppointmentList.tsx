import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, User } from 'lucide-react';
import axios from '../../lib/axios';
import toast from 'react-hot-toast';

interface Appointment {
  _id: string;
  customerId: {
    name: string;
    email: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  purpose: string;
}

function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/appointments/agent');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId: string, status: string) => {
    try {
      await axios.patch(`/appointments/${appointmentId}/status`, { status });
      fetchAppointments();
      toast.success('Appointment status updated');
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Clock className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment._id}
          className="bg-white border rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {appointment.customerId.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {format(new Date(appointment.date), 'MMMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {appointment.startTime} - {appointment.endTime}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={appointment.status}
                onChange={(e) => updateStatus(appointment._id, e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900">Purpose</h4>
            <p className="mt-1 text-sm text-gray-500">{appointment.purpose}</p>
          </div>
        </div>
      ))}

      {appointments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No appointments scheduled</p>
        </div>
      )}
    </div>
  );
}

export default AppointmentList;