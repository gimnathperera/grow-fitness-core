export interface User {
  name: string;
  role: 'parent' | 'coach';
 kids?: Student[]
}

export interface Student {
  id: number;
  name: string;
  age: number;
  progress: number;
  lastSession: string;
  status: 'active' | 'inactive';
  location?: string;
  contactNumber?: string;
  sessions?: Session[];
}

export interface Session {
  id: number;
  name: string;
  time: string;
  studentsCount: number;
  status: 'next' | 'upcoming' | 'later';
  type?: 'individual' | 'group';
  location?: string;
  students?: string[];
  dates?: string[];
  coach?: string;
  messages?: Message[];
}

export interface Message {
  id: number;
  senderName: string;
  senderInitials: string;
  content: string;
  timestamp: string;
  isUnread?: boolean;
}

export interface DashboardStats {
  totalStudents?: number;
  totalChildren?: number;
  todaySessions?: number;
  upcomingSessions?: number;
  monthlyHours?: number;
  weeklyProgress?: number;
  avgProgress?: number;
}
