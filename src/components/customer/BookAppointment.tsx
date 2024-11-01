import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, User } from 'lucide-react';
import axios from '../../lib/axios';
import toast from 'react-hot-toast';

interface Agent {
  _id: string;
  userId: {
    name: string;
  };
  specialization: string;
  experience: number;
  rating: number;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

function BookAppointment() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axios.get('/agents');
      setAgents(response.data);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async (agentId: string, date: string) => {
    try {
      const response = await axios.get(`/agents/availability/${agentId}?date=${date}`);
      setAvailableSlots(response.data.availability[0].slots);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load availability');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await axios.post('/appointments', {
        agentId: selectedAgent,
        date: selectedDate,
        startTime: selectedSlot,
        endTime: selectedSlot, // You might want to calculate this based on duration
        purpose
      });
      
      toast.success('Appointment booked successfully');
      // Reset form or redirect
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment');
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
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Book an Appointment</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Agent</label>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Choose an agent</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.userId.name} - {agent.specialization}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              if (selectedAgent) {
                fetchAvailability(selectedAgent, e.target.value);
              }
            }}
            min={format(new Date(), 'yyyy-MM-dd')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          />
        </div>

        {availableSlots.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Time</label>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot.startTime}
                  type="button"
                  onClick={() => setSelectedSlot(slot.startTime)}
                  disabled={slot.isBooked}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    selectedSlot === slot.startTime
                      ? 'bg-blue-600 text-white'
                      : slot.isBooked
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {slot.startTime}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Purpose</label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            placeholder="Please describe the reason for your appointment"
          />
        </div>

        <button
          type="submit"
          disabled={!selectedAgent || !selectedDate || !selectedSlot || !purpose}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
}

export default BookAppointment;