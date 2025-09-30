import type { User } from '@/types/dashboard';

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const roleConfig = {
    parent: {
      badge: { bg: 'bg-[#FFFD77]', text: 'text-[#243E36]', label: 'Parent' },
      greeting: `Welcome Back!, ${user.name}! 👋`,
      subtitle: "Track your child's fitness journey",
    },
    coach: {
      badge: { bg: 'bg-[#FFFD77]', text: 'text-[#243E36]', label: 'Coach' },
      greeting: `Welcome Back!, Coach ${user.name}! 👋`,
      subtitle: 'Ready to inspire young athletes today?',
    },
  };

  const config = roleConfig[user.role];

  return (
    <>
      {/* Navigation */}
      {/* <nav className="bg-white shadow-sm border-b border-[#23B685]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#23B685] rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-white"></div>
              </div>
              <span className="text-2xl font-bold text-[#243E36]">GROW</span>
              <Badge className={`${config.badge.bg} ${config.badge.text} ml-2`}>{config.badge.label}</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="default" size="sm" className="
                    w-full md:w-auto px-3 py-1 text-xs md:px-8 md:py-2 md:text-lg rounded-full font-[Insaniburger_with_Cheese] font-extrabold shadow-lg inline-flex items-center justify-center transition-transform duration-300 hover:scale-105 !bg-primary hover:bg-[#1e9c70] !text-white">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
            {config.greeting}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {config.subtitle}
          </p>
        </div>
      </div>
    </>
  );
}
