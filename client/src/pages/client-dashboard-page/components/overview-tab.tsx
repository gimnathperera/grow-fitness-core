import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface OverviewTabProps {
  childData: {
    name: string;
    age: number;
    coach: string;
  };
}

export function OverviewTab({ childData }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Child Profile */}
        <Card className="border-[#23B685]/20">
          <CardHeader>
            <CardTitle className="text-[#243E36] flex items-center">
              <User className="mr-2 h-5 w-5" />
              Child Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-[#23B685]/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-[#23B685]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#243E36]">
                    {childData.name}
                  </h3>
                  <p className="text-gray-600">{childData.age} years old</p>
                  <Badge
                    variant="secondary"
                    className="bg-[#23B685]/10 text-[#23B685]"
                  >
                    Active Member
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Coach:</span>
                  <span className="text-sm font-medium text-[#243E36]">
                    {childData.coach}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Program:</span>
                  <span className="text-sm font-medium text-[#243E36]">
                    Kids Fitness Fun
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Member Since:</span>
                  <span className="text-sm font-medium text-[#243E36]">
                    January 2024
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-[#23B685]/20">
          <CardHeader>
            <CardTitle className="text-[#243E36]">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#23B685] rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#243E36]">
                    Completed obstacle course challenge
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#FFFD77] rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#243E36]">
                    Earned "Team Player" badge
                  </p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#23B685] rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#243E36]">
                    Attended group fitness session
                  </p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
