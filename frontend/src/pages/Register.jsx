import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TEACHER'); // 'TEACHER' or 'STUDENT'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, registerStudent } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (role === 'TEACHER') {
        await register(name, email, password);
      } else {
        await registerStudent(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative z-10">
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-float-slow">
        <div className="flex justify-center">
          <div className="rounded-full bg-white/10 p-4 shadow-[0_0_15px_rgba(255,255,255,0.2)] border border-white/20 backdrop-blur-md">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          Join AttendancePro
        </h2>
        <p className="mt-2 text-center text-sm text-gray-300">
          Create an account to access the system
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md transition-all duration-500 hover:translate-y-[-4px]">
        <div className="glass-panel py-8 px-4 sm:rounded-2xl sm:px-10">
          
          {/* Role Toggle */}
          <div className="flex bg-black/20 p-1 rounded-xl mb-6 relative">
             <div className="absolute inset-y-1 left-1 w-[calc(50%-4px)] bg-white/10 rounded-lg shadow-sm transition-transform duration-300 pointer-events-none" style={{ transform: role === 'STUDENT' ? 'translateX(100%)' : 'translateX(0)' }}></div>
             <button
               type="button"
               className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${role === 'TEACHER' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
               onClick={() => setRole('TEACHER')}
             >
               Teacher
             </button>
             <button
               type="button"
               className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${role === 'STUDENT' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
               onClick={() => setRole('STUDENT')}
             >
               Student
             </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border-l-4 border-red-500 p-4 rounded-md backdrop-blur-sm">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input block w-full pl-10"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input block w-full pl-10"
                  placeholder="teacher@school.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input block w-full pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium glass-button-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Creating Account...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-400 backdrop-blur-md">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-3 px-4 border border-white/10 rounded-lg text-sm font-medium text-white hover:bg-white/5 transition-colors backdrop-blur-sm"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
