import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { InProgressTab } from './prograss';

type Task = {
  id: string;
  name: string;
  category: "Fitness" | "Wellness" | "Nutrition";
  completed: boolean;
  assignedByCoach: boolean; // added flag
};

export function ProgressTab() {
  const tasks: Task[] = [
    { id: "1", name: "Morning Run", category: "Fitness", completed: false, assignedByCoach: true },
    { id: "2", name: "Meditation", category: "Wellness", completed: false, assignedByCoach: true },
    { id: "3", name: "Track Calories", category: "Nutrition", completed: false, assignedByCoach: true },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-[#23B685]/20">
        <CardHeader>
          <CardTitle className="text-[#243E36] flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-[#23B685]">75%</div>
            <p className="text-gray-600">Great job!</p>
          </div>

          {/* InProgressTab now handles Fitness/Wellness/Nutrition tasks with coach logic */}
          <InProgressTab tasks={tasks} isCoach={false} />
        </CardContent>
      </Card>
    </div>
  );
}
