import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Users } from 'lucide-react';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await login(email, password);
      if (user.role !== 'STUDENT') {
         logout(); // force logout if wrong role
         setError('Access Denied: This portal is for Students only.');
         setLoading(false);
         return;
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
    } finally {
      if(!error) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative z-10 animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-float-slow">
        <div className="flex justify-center">
          <div className="rounded-full bg-emerald-500/20 p-4 shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-500/30 backdrop-blur-md">
            <Users className="h-8 w-8 text-emerald-400" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          Student Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-300">
          Sign in to view your academic dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md transition-all duration-500 hover:translate-y-[-4px]">
        <div className="glass-panel py-8 px-4 sm:rounded-2xl sm:px-10 border-t-4 border-t-emerald-500/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border-l-4 border-red-500 p-4 rounded-md backdrop-blur-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input block w-full pl-10 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="student@school.edu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input block w-full pl-10 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 bg-black/20 border-white/20 rounded focus:ring-emerald-500 focus:ring-offset-0 focus:ring-1 text-emerald-500" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium glass-button-primary bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500/50 shadow-[0_4px_15px_rgba(16,185,129,0.3)] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Signing in...' : 'Sign in as Student'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
             <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors flex justify-center items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to role selection
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
