import { Link } from 'react-router-dom';
import { User, Users } from 'lucide-react';

const LoginChoice = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative z-10 animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl text-center">
        <h2 className="mt-6 text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
          Welcome to AttendancePro
        </h2>
        <p className="mt-4 text-lg text-gray-300">
          Please select your role to continue
        </p>
      </div>

      <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-4xl px-4 flex flex-col sm:flex-row justify-center gap-8">
        
        {/* Teacher Card */}
        <Link 
          to="/teacher-login"
          className="relative group glass-panel flex-1 rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-white/10 hover:border-blue-500/50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center mb-6 shadow-inner border border-blue-500/30 group-hover:scale-110 transition-transform duration-500">
              <User className="h-10 w-10 text-blue-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Teacher Portal</h3>
            <p className="text-gray-400 text-sm">Sign in to manage classes, take attendance, and view reports.</p>
          </div>
        </Link>

        {/* Student Card */}
        <Link 
          to="/student-login"
          className="relative group glass-panel flex-1 rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-white/10 hover:border-emerald-500/50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 shadow-inner border border-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
              <Users className="h-10 w-10 text-emerald-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Student Portal</h3>
            <p className="text-gray-400 text-sm">Sign in to view your schedule, track your attendance, and more.</p>
          </div>
        </Link>
        
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500">
          New here? <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginChoice;
