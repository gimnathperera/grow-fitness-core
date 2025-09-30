import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Clock,
  Calendar,
  Award,
  TrendingUp,
  User,
  MoreHorizontal,
} from 'lucide-react';

const ClientDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center justify-between max-w-sm mx-auto md:max-w-none">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-grow-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-grow-700 font-semibold text-lg">GROW</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-yellow-400 text-yellow-900 font-semibold"
            >
              PARENT
            </Badge>
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-sm mx-auto md:max-w-2xl lg:max-w-4xl px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 font-insanibc">
            Welcome Back! 👋
          </h1>
          <p className="text-gray-600">
            Here's how Emma Johnson is doing in their fitness journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Next Session */}
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Next Session</p>
                  <h3 className="text-2xl font-bold text-gray-800 font-insanibc">
                    Tomorrow
                  </h3>
                  <p className="text-sm text-gray-500">4:00 PM</p>
                </div>
                <Clock className="w-8 h-8 text-grow-500" />
              </div>
            </CardContent>
          </Card>

          {/* Total Sessions */}
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
                  <h3 className="text-2xl font-bold text-gray-800 font-insanibc">
                    24
                  </h3>
                  <p className="text-sm text-grow-600">+3 this month</p>
                </div>
                <Calendar className="w-8 h-8 text-grow-500" />
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Achievements</p>
                  <h3 className="text-2xl font-bold text-gray-800 font-insanibc">
                    5
                  </h3>
                  <p className="text-sm text-grow-600">2 new badges!</p>
                </div>
                <Award className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Progress</p>
                  <h3 className="text-2xl font-bold text-gray-800 font-insanibc">
                    75%
                  </h3>
                  <p className="text-sm text-grow-600">Great job!</p>
                </div>
                <TrendingUp className="w-8 h-8 text-grow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Child Profile */}
        <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-5">
              <h2 className="text-base font-bold text-gray-800 tracking-wide font-insanibc">
                CHILD PROFILE
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-grow-200 flex items-center justify-center flex-shrink-0">
                  <div className="w-12 h-12 bg-grow-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-grow-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 font-insanibc">
                    Emma Johnson
                  </h3>
                  <p className="text-gray-600 text-sm">8 years old</p>
                  <Badge className="bg-grow-100 text-grow-700 border-0 font-medium px-3 rounded-full text-xs">
                    Active Member
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 text-sm pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Coach:</span>
                  <span className="font-medium text-gray-800">Coach Sarah</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Program:</span>
                  <span className="font-medium text-gray-800">
                    Kids Fitness Fun
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since:</span>
                  <span className="font-medium text-gray-800">
                    January 2024
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <CardContent className="p-5 text-left">
            <h2 className="text-base font-bold text-gray-800 tracking-wide mb-5 text-left font-insanibc">
              RECENT ACTIVITY
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>

                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm text-left">
                    Completed obstacle course challenge
                  </p>
                  <p className="text-xs text-gray-500 mt-1 text-left">
                    2 hours ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm text-left">
                    Earned "Team Player" badge
                  </p>
                  <p className="text-xs text-gray-500 mt-1 text-left">
                    Yesterday
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>

                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm text-left">
                    Attended group fitness session
                  </p>
                  <p className="text-xs text-gray-500 mt-1 text-left">
                    3 days ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <CardContent className="p-6 text-left">
            <h2 className="text-lg font-bold text-gray-800 tracking-wide mb-2 font-insanibc">
              MONTHLY PROGRESS
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Emma Johnson's fitness journey this month
            </p>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Overall Fitness
                  </span>
                  <span className="text-sm font-medium text-gray-700">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="flex h-full">
                    <div
                      className="bg-grow-500 h-full"
                      style={{ width: '60%' }}
                    ></div>
                    <div
                      className="bg-yellow-400 h-full"
                      style={{ width: '15%' }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Coordination
                  </span>
                  <span className="text-sm font-medium text-gray-700">82%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="flex h-full">
                    <div
                      className="bg-grow-500 h-full"
                      style={{ width: '70%' }}
                    ></div>
                    <div
                      className="bg-yellow-400 h-full"
                      style={{ width: '12%' }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Strength
                  </span>
                  <span className="text-sm font-medium text-gray-700">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="flex h-full">
                    <div
                      className="bg-grow-500 h-full"
                      style={{ width: '55%' }}
                    ></div>
                    <div
                      className="bg-yellow-400 h-full"
                      style={{ width: '13%' }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Endurance
                  </span>
                  <span className="text-sm font-medium text-gray-700">71%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="flex h-full">
                    <div
                      className="bg-grow-500 h-full"
                      style={{ width: '58%' }}
                    ></div>
                    <div
                      className="bg-yellow-400 h-full"
                      style={{ width: '13%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboardPage;
