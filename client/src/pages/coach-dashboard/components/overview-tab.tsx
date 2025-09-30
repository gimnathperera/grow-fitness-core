import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import type { Session, User } from '@/types/dashboard';
import { coachQuickActions, parentQuickActions } from '@/constants/dashboard';
import { recentActivities } from '@/data/coach/recent-activities';
import SessionDetailsModal from '@/components/session-details-modal';

interface OverviewTabProps {
  user: User;
  sessions: Session[];
}

type SessionStatus = 'next' | 'upcoming' | 'later';

export function OverviewTab({ user, sessions }: OverviewTabProps) {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const quickActions =
    user.role === 'coach' ? coachQuickActions : parentQuickActions;

  const getStatusBadge = (status: SessionStatus) => {
    const badges = {
      next: <Badge className="bg-[#23B685] text-white">Next</Badge>,
      upcoming: <Badge variant="outline">Upcoming</Badge>,
      later: <Badge variant="outline">Later</Badge>,
    };
    return badges[status];
  };

  const ActivityItem = ({
    color,
    text,
    time,
  }: {
    color: string;
    text: string;
    time: string;
  }) => (
    <div className="flex items-center space-x-3">
      <div
        className={`w-2 h-2 rounded-full`}
        style={{ backgroundColor: color }}
      />
      <div className="flex-1">
        <p className="text-sm font-medium text-[#243E36]">{text}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );

  const SessionItem = ({ session }: { session: Session }) => (
    <div
      onClick={() => setSelectedSession(session)}
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
        session.status === 'next'
          ? 'bg-[#23B685]/5 hover:bg-[#23B685]/10'
          : 'border border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div>
        <h3 className="font-semibold text-[#243E36]">{session.name}</h3>
        <p className="text-sm text-gray-600">{session.time}</p>
        <p className="text-xs text-gray-500">
          {session.studentsCount}{' '}
          {user.role === 'coach' ? 'students enrolled' : 'spots available'}
        </p>
      </div>
      {getStatusBadge(session.status)}
    </div>
  );

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-[#23B685]/20">
          <CardHeader>
            <CardTitle className="text-[#243E36] flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              {user.role === 'coach' ? "Today's Schedule" : 'Upcoming Sessions'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.map(session => (
              <SessionItem key={session.id} session={session} />
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#23B685]/20">
          <CardHeader>
            <CardTitle className="text-[#243E36]">
              {user.role === 'coach' ? 'Recent Activity' : 'Recent Progress'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities(user.role).map(act => (
              <ActivityItem key={`${act.text}-${act.time}`} {...act} />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#23B685]/20">
        <CardHeader>
          <CardTitle className="text-[#243E36]">Quick Actions</CardTitle>
          <CardDescription>
            {user.role === 'coach'
              ? 'Common tasks to help you manage your coaching activities'
              : "Quick actions to manage your child's fitness journey"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                className={`flex flex-col h-auto py-4 ${
                  action.primary
                    ? '!bg-primary hover:!bg-primary/90 text-white'
                    : '!border-primary text-primary hover:bg-white/90 hover:text-primary !bg-white'
                }`}
                variant={action.primary ? 'default' : 'outline'}
              >
                <action.icon className="h-6 w-6 mb-2" />
                <h6>{action.label}</h6>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <SessionDetailsModal
        session={selectedSession}
        open={!!selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    </div>
  );
}
