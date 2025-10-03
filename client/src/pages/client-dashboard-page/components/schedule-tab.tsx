'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import SessionDetailsModal from '@/components/session-details-modal';
import BookSessionModal from './book-session-modal';
import { useGetSessionsQuery, useCreateSessionMutation } from '@/services/sessionsRtkApi';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useGetKidQuery } from '@/services/kidsApi';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const SessionTile = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="p-2 bg-[#23B685]/5 rounded-lg text-center">
    <p className="text-sm font-medium">{title}</p>
    <p className="text-xs text-gray-600">{subtitle}</p>
  </div>
);

export default function ScheduleTab() {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [openBooking, setOpenBooking] = useState(false);

  // Month filter input (yyyy-mm)
  const [month, setMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const selectedKidId = useSelector((state: RootState) => state.auth.selectedKidId);
  const { data: kidResp } = useGetKidQuery(selectedKidId as string, { skip: !selectedKidId });
  const coachId: string | undefined =
    (kidResp?.data as any)?.coach?.id || (kidResp?.data as any)?.coachId;

  // Compute month range (start → end of selected month)
  const [dateFrom, dateTo] = useMemo(() => {
    if (!month) return [undefined, undefined] as const;
    const [yStr, mStr] = month.split('-');
    const y = Number(yStr);
    const m = Number(mStr) - 1;
    const start = new Date(y, m, 1, 0, 0, 0, 0);
    const end = new Date(y, m + 1, 0, 23, 59, 59, 999);
    return [start.toISOString(), end.toISOString()] as const;
  }, [month]);

  // Fetch sessions filtered by month & coach
  const sessionsParams =
    coachId && dateFrom && dateTo ? { coachId, dateFrom, dateTo, page: 1, limit: 50 } : undefined;

  const { data: sessionsResp, isFetching: loadingSessions } = useGetSessionsQuery(
    sessionsParams as any
  );

  const [createSession] = useCreateSessionMutation();
  const sessions = (sessionsResp?.data as any)?.sessions || [];

  // Group by weekdays (Mon–Sat only)
  const groupedByDay: Record<string, any[]> = useMemo(() => {
    const groups: Record<string, any[]> = {};
    for (const day of daysOfWeek) groups[day] = [];

    sessions.forEach((s: any) => {
      if (s?.startsAt) {
        const d = new Date(s.startsAt);
        const weekdayIndex = d.getDay(); // Sunday=0, Monday=1, ... Saturday=6
        if (weekdayIndex >= 1 && weekdayIndex <= 6) {
          const dayName = daysOfWeek[weekdayIndex - 1];
          groups[dayName].push(s);
        }
      }
    });

    // Sort by start time within each day
    for (const day of daysOfWeek) {
      groups[day].sort(
        (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
      );
    }
    return groups;
  }, [sessions]);

  const toTitle = (s: any) => s?.sessionType || s?.name || 'Session';
  const toSubtitle = (s: any) => {
    const starts = s?.startsAt ? new Date(s.startsAt) : null;
    const ends = s?.endsAt ? new Date(s.endsAt) : null;
    if (starts && ends) {
      return `${starts.toLocaleDateString()} ${starts.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })} - ${ends.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (starts) {
      return `${starts.toLocaleDateString()} ${starts.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    }
    return '';
  };

  const handleBookingConfirm = (data: {
    coach: string;
    type: string;
    date: Date | undefined;
    time: string;
  }) => {
    console.log('Booking confirmed:', { session: selectedSession, ...data });
    // TODO: send booking request to backend
  };

  return (
    <>
      <Card className="border-[#23B685]/20">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle className="text-[#243E36] flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Upcoming Sessions
          </CardTitle>

          {/* Month filter */}
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border rounded-md p-2 text-sm"
          />

          <Button
            size="sm"
            className="!bg-primary hover:!bg-primary/90 text-white"
            onClick={() => setOpenBooking(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Extra Session
          </Button>
        </CardHeader>

        <CardContent>
          {/* Horizontal week layout */}
          <div className="grid grid-cols-6 gap-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex flex-col items-center">
                <h3 className="text-sm font-semibold mb-2">{day}</h3>
                {groupedByDay[day]?.length === 0 ? (
                  <p className="text-xs text-gray-500">No sessions</p>
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    {groupedByDay[day].map((s: any, idx: number) => (
                      <SessionTile
                        key={s?._id || idx}
                        title={toTitle(s)}
                        subtitle={toSubtitle(s)}
                      />
                    ))}
                  </div>
                )}
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

      {/* Floating booking button */}
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
