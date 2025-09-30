import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';

import type {
  Coach,
  BookSessionData,
  AvailabilityData,
  TimeSlot,
} from '@/types/session-booking';
import { fetchCoaches, fetchAvailability } from '@/services/sessionsApi';
import { Button } from '@/components/ui/button';

interface BookSessionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: BookSessionData) => void;
}

export default function BookSessionModal({
  open,
  onClose,
  onConfirm,
}: BookSessionModalProps) {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [availability, setAvailability] = useState<AvailabilityData | null>(
    null,
  );

  const [coach, setCoach] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [time, setTime] = useState('');

  // Fetch coaches on mount
  useEffect(() => {
    fetchCoaches().then(setCoaches);
  }, []);

  // Fetch availability when coach or type changes
  useEffect(() => {
    if (coach && type) {
      fetchAvailability(coach, type).then(data => {
        setAvailability(data);
        setDate(undefined);
        setTime('');
        setTimeSlots([]);
      });
    }
  }, [coach, type]);

  // Update time slots when date changes
  useEffect(() => {
    if (date && availability) {
      const selectedDate = availability.available_dates.find(
        d => new Date(d.date).toDateString() === date.toDateString(),
      );
      setTimeSlots(
        selectedDate?.time_slots.filter(slot => slot.available) || [],
      );
      setTime('');
    }
  }, [date, availability]);

  const handleConfirm = () => {
    onConfirm({ coach, type, date, time });
    onClose();
  };

  const isDateAvailable = (currentDate: Date) =>
    !!availability?.available_dates.find(
      d => new Date(d.date).toDateString() === currentDate.toDateString(),
    );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-[95vh] max-h-[95vh] sm:h-auto sm:max-h-[90vh] overflow-hidden p-0 rounded-lg sm:rounded-xl flex flex-col z-1000">
        {/* Header */}
        <div className="flex-shrink-0 sticky top-0 bg-white z-20 border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 line-clamp-1">
              Book a Session
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-gray-600 mt-1 line-clamp-2">
              Choose your preferences to reserve a spot.
            </DialogDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex-shrink-0 h-8 w-8 p-0 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"
          >
            ✕
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 space-y-6">
          {/* Coach Selection */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-medium text-gray-700 block">
              Coach
            </Label>
            <Select value={coach} onValueChange={setCoach}>
              <SelectTrigger className="w-full h-11 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                <SelectValue placeholder="Select a coach" />
              </SelectTrigger>
              <SelectContent className="text-sm sm:text-base z-[1050] max-h-60">
                {coaches.map(c => (
                  <SelectItem
                    key={c.id}
                    value={c.id}
                    className="py-2.5 sm:py-3"
                  >
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Session Type */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-medium text-gray-700 block">
              Session Type
            </Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full h-11 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="text-sm sm:text-base z-[1050] max-h-60">
                <SelectItem value="group" className="py-2.5 sm:py-3">
                  Group Session
                </SelectItem>
                <SelectItem value="individual" className="py-2.5 sm:py-3">
                  Individual Session
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-medium text-gray-700 block">
              Date
            </Label>
            <div className="rounded-lg border border-gray-300 p-2 sm:p-3 bg-white overflow-hidden">
              <Calendar
                className="w-full [&_table]:w-full [&_td]:p-1 sm:[&_td]:p-1.5 [&_button]:h-8 sm:[&_button]:h-10 [&_button]:w-8 sm:[&_button]:w-10 [&_button]:text-xs sm:[&_button]:text-sm [&_.rdp-head_cell]:text-xs sm:[&_.rdp-head_cell]:text-sm [&_.rdp-caption]:text-sm sm:[&_.rdp-caption]:text-base [&_.rdp-nav_button]:h-8 sm:[&_.rdp-nav_button]:h-9 [&_.rdp-nav_button]:w-8 sm:[&_.rdp-nav_button]:w-9"
                mode="single"
                selected={date}
                onSelect={d => d && isDateAvailable(d) && setDate(d)}
                disabled={d => !isDateAvailable(d)}
              />
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-3">
            <Label className="text-sm sm:text-base font-medium text-gray-700 block">
              Time Slot
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              {timeSlots.map(t => (
                <Button
                  key={t.id}
                  variant={time === t.time ? 'default' : 'outline'}
                  size="sm"
                  className={`h-11 sm:h-12 text-sm font-medium transition-all duration-200 ${time === t.time ? '!bg-primary hover:!bg-primary/90 shadow-sm' : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'}`}
                  onClick={() => setTime(t.time)}
                >
                  {t.time}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-4 sm:px-6 sm:py-6">
          <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto sm:min-w-[100px] h-11 sm:h-12 text-sm sm:text-base font-medium border-gray-300 hover:bg-gray-50 order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto sm:min-w-[140px] h-11 sm:h-12 text-sm sm:text-base font-medium disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm order-1 sm:order-2 !bg-primary hover:!bg-primary/90 shadow-lg"
              disabled={!coach || !type || !date || !time}
              onClick={handleConfirm}
            >
              Confirm Booking
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
