import { NavLink } from 'react-router-dom';
import { Home, Users, BookOpen, CheckSquare, FileText, Settings } from 'lucide-react';

const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Classes', href: '/classes', icon: BookOpen },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Attendance', href: '/attendance', icon: CheckSquare },
    { name: 'Reports', href: '/reports', icon: FileText },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0 z-20">
      <div className="flex flex-col w-64 glass-panel border-r border-white/10 rounded-none shadow-xl">
        <div className="flex flex-col h-0 flex-1">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-sm">
                AttendancePro
              </span>
            </div>
            <nav className="mt-2 flex-1 px-3 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-white/10 text-white border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                          : 'text-gray-300 hover:text-white hover:bg-white/5 hover:translate-x-1 border border-transparent'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`flex-shrink-0 mr-3 h-5 w-5 transition-colors ${
                            isActive ? 'text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]' : 'text-gray-400 group-hover:text-gray-300'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="truncate tracking-wide">{item.name}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
