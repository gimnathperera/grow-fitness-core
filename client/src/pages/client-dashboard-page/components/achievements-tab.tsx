import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Heart, Trophy } from 'lucide-react';
import { BadgeMap } from './tressure-map';

export function AchievementsTab() {
  return (
    <div className="space-y-6">
      <Card className="border-[#23B685]/20">
        <CardHeader>
          <CardTitle className="text-[#243E36] flex items-center">
            <Trophy className="mr-2 h-5 w-5" />
            Achievements & Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-[#23B685]/20 rounded-lg">
              <div className="w-16 h-16 bg-[#FFFD77] rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="h-8 w-8 text-[#243E36]" />
              </div>
              <h3 className="font-semibold text-[#243E36] text-sm">
                First Session
              </h3>
              <p className="text-xs text-gray-600">Completed first workout</p>
            </div>

            <div className="text-center p-4 border border-[#23B685]/20 rounded-lg">
              <div className="w-16 h-16 bg-[#23B685] rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-[#243E36] text-sm">
                Team Player
              </h3>
              <p className="text-xs text-gray-600">Great teamwork skills</p>
            </div>

            <div className="text-center p-4 border border-[#23B685]/20 rounded-lg">
              <div className="w-16 h-16 bg-[#FFFD77] rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="h-8 w-8 text-[#243E36]" />
              </div>
              <h3 className="font-semibold text-[#243E36] text-sm">
                10 Sessions
              </h3>
              <p className="text-xs text-gray-600">Consistency champion</p>
            </div>
          </div> */}
          <BadgeMap/>
        </CardContent>
      </Card>
    </div>
  );
}
