'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import type { Session } from '@/types/dashboard';
import SessionDetailsModal from '@/components/session-details-modal';
import BookSessionModal from './book-session-modal';

interface DaySchedule {
  day: string;
  sessions: Session[];
}

const weeklySchedule: DaySchedule[] = [
  {
    day: 'Monday',
    sessions: [
      {
        id: 1,
        name: 'Kids Fitness Fun',
        time: '3:00 PM - 4:00 PM',
        studentsCount: 3,
        status: 'next',
        type: 'group',
        location: 'Gym A',
        students: ['Alice', 'Bob', 'Charlie'],
        dates: ['2025-09-01', '2025-09-08'],
      },
      {
        id: 3,
        name: 'Teen Strength',
        time: '6:00 PM - 7:00 PM',
        studentsCount: 3,
        status: 'next',
        type: 'group',
        location: 'Gym B',
        students: ['David', 'Eva', 'Frank'],
        dates: ['2025-09-02', '2025-09-09'],
      },
    ],
  },
  {
    day: 'Wednesday',
    sessions: [
      {
        id: 2,
        name: 'Obstacle Course',
        time: '4:30 PM - 5:30 PM',
        studentsCount: 3,
        status: 'next',
        type: 'individual',
        location: 'Outdoor Arena',
        students: ['George'],
        dates: ['2025-09-03', '2025-09-10'],
      },
    ],
  },
];

const SessionCard = ({
  session,
  onClick,
}: {
  session: Session;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="p-3 bg-[#23B685]/5 rounded-lg cursor-pointer hover:bg-[#23B685]/10 transition-colors"
  >
    <p className="text-sm font-medium">{session.name}</p>
    <p className="text-xs text-gray-600">{session.time}</p>
  </div>
);

export default function ScheduleTab() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [openBooking, setOpenBooking] = useState(false);

  const handleBookingConfirm = (data: {
    coach: string;
    type: string;
    date: Date | undefined;
    time: string;
  }) => {
    console.log('Booking confirmed:', {
      session: selectedSession,
      ...data,
    });
    // TODO: send booking request to backend
  };

  return (
    <>
      <Card className="border-[#23B685]/20">
        <CardHeader>
          <CardTitle className="text-[#243E36] flex items-center justify-between">
            <span className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Weekly Schedule
            </span>
            <Button
              size="sm"
              className="!bg-primary hover:!bg-primary/90 text-white"
              onClick={() => setOpenBooking(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Session
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeklySchedule.map(({ day, sessions }) => (
              <div key={day} className="space-y-3">
                <h3 className="font-semibold text-[#243E36]">{day}</h3>
                {sessions.map(session => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onClick={() => setSelectedSession(session)}
                  />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session Details Modal */}
      <SessionDetailsModal
        session={selectedSession}
        open={!!selectedSession}
        onClose={() => setSelectedSession(null)}
      />

      {/* Book Session button shown only if a session is selected */}
      {selectedSession && (
        <div className="fixed bottom-6 right-6 flex justify-end">
          <Button
            className="!bg-primary hover:!bg-primary/90 shadow-lg"
            onClick={() => {
              setOpenBooking(true);
              setSelectedSession(null);
            }}
          >
            Book Session
          </Button>
        </div>
      )}

      {/* Booking Modal */}
      <BookSessionModal
        open={openBooking}
        onClose={() => setOpenBooking(false)}
        onConfirm={handleBookingConfirm}
      />
    </>
  );
}
