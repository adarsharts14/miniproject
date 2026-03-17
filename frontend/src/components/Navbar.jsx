import { useAuth } from '../context/AuthContext';
import { LogOut, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-20 flex flex-shrink-0 h-16 glass-panel border-b border-white/10 rounded-none md:left-64 pl-4 pr-4 sm:pr-6 lg:pr-8">
      <div className="flex-1 flex justify-between px-4 sm:px-0">
        <div className="flex-1 flex items-center">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 md:hidden drop-shadow-sm">
            AttendancePro
          </h1>
        </div>
        <div className="ml-4 flex items-center mb:ml-6 space-x-4">
          <button className="p-2 bg-black/20 border border-white/10 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all focus:outline-none focus:ring-1 focus:ring-white/30 backdrop-blur-sm shadow-sm group">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5 group-hover:animate-[wave_1s_ease-in-out_infinite]" aria-hidden="true" />
          </button>

          <div className="flex items-center cursor-pointer glass-panel py-1 px-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
            <div className="hidden sm:flex flex-col items-end mr-3 pl-2">
              <span className="text-sm font-medium text-white">{user?.name || 'Teacher'}</span>
              <span className="text-xs text-gray-400">{user?.email || 'teacher@school.com'}</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-white/20 shadow-inner">
              <User className="h-5 w-5 text-blue-300 drop-shadow-md" />
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 border border-white/10 text-sm font-medium rounded-lg text-red-400 bg-black/20 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 transition-all shadow-sm backdrop-blur-sm"
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
