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
    <div className="fixed top-0 left-0 right-0 z-10 flex flex-shrink-0 h-16 bg-white border-b border-gray-200 md:left-64 pl-4 pr-4 sm:pr-6 lg:pr-8 shadow-sm">
      <div className="flex-1 flex justify-between px-4 sm:px-0">
        <div className="flex-1 flex items-center">
          <h1 className="text-2xl font-semibold text-gray-900 md:hidden">
            AttendancePro
          </h1>
        </div>
        <div className="ml-4 flex items-center mb:ml-6 space-x-4">
          <button className="p-1 bg-white rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex items-center cursor-pointer">
            <div className="hidden sm:flex flex-col items-end mr-3">
              <span className="text-sm font-medium text-gray-900">{user?.name || 'Teacher'}</span>
              <span className="text-xs text-gray-500">{user?.email || 'teacher@school.com'}</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
              <User className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
