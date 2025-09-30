import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export function ProgressTab() {
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
          <div className="text-center">
            <div className="text-4xl font-bold text-[#23B685] mb-2">75%</div>
            <p className="text-gray-600">Great job!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
