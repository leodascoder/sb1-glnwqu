import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { Clock } from 'lucide-react';
import axios from '../../lib/axios';
import toast from 'react-hot-toast';

interface TimeSlot {
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface DayAvailability {
  day: string;
  slots: TimeSlot[];
}

const timeSlots = [
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '11:00' },
  { start: '11:00', end: '12:00' },
  { start: '13:00', end: '14:00' },
  { start: '14:00', end: '15:00' },
  { start: '15:00', end: '16:00' },
  { start: '16:00', end: '17:00' },
];

function AvailabilityCalendar() {
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await axios.get('/agents/availability');
      setAvailability(response.data.availability);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const updateSlot = async (dayIndex: number, slotIndex: number, isAvailable: boolean) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].slots[slotIndex].isBooked = !isAvailable;

    try {
      await axios.put('/agents/availability', { availability: newAvailability });
      setAvailability(newAvailability);
      toast.success('Availability updated successfully');
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const startDate = startOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Clock className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            {weekDays.map((day) => (
              <th
                key={day.toString()}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {format(day, 'EEE dd/MM')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {timeSlots.map((slot, slotIndex) => (
            <tr key={slot.start}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {slot.start} - {slot.end}
              </td>
              {weekDays.map((day, dayIndex) => {
                const isAvailable = !availability[dayIndex]?.slots[slotIndex]?.isBooked;
                return (
                  <td
                    key={`${day}-${slot.start}`}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    <button
                      onClick={() => updateSlot(dayIndex, slotIndex, isAvailable)}
                      className={`w-full py-2 px-4 rounded-md text-sm font-medium ${
                        isAvailable
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AvailabilityCalendar;