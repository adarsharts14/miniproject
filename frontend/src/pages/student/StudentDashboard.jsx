import { useState, useEffect } from 'react';
import { Calendar, CheckSquare, Clock } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClassesScheduled: 0,
    attendanceRate: 0,
    present: 0,
    absent: 0
  });
  
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentRes = await api.get(`/students/email/${user.email}`);
        const studentId = studentRes.data.id;
        const section = studentRes.data.section;
        
        const [classesRes, attendanceRes] = await Promise.all([
          api.get(`/classes/section/${section}`),
          api.get(`/attendance/student/${studentId}`)
        ]);

        const classes = classesRes.data;
        const attendances = attendanceRes.data;

        let present = 0;
        let absent = 0;
        attendances.forEach(att => {
           if (att.status === 'PRESENT') present++;
           if (att.status === 'ABSENT') absent++;
        });

        const total = present + absent;
        const rate = total > 0 ? Math.round((present / total) * 100) : 100;

        setStats({
          totalClassesScheduled: classes.length,
          attendanceRate: rate,
          present,
          absent
        });
      } catch (error) {
        console.error('Error fetching student dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user && user.email) {
       fetchStudentData();
    }
  }, [user]);

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20"></div></div>;

  return (
    <div className="space-y-6 relative z-10 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">My Dashboard</h1>
         <div className="text-sm font-medium text-gray-300 glass-panel px-4 py-1.5 rounded-full border border-white/10">
          Welcome back, {user?.name.split(' ')[0]}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative glass-panel pt-5 px-4 pb-12 sm:pt-6 sm:px-6 rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
           <dt>
             <div className="absolute rounded-xl p-3 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-black/20">
               <Calendar className="h-6 w-6 text-white" />
             </div>
             <p className="ml-16 text-sm font-medium text-gray-400 truncate">Scheduled Classes</p>
           </dt>
           <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
             <p className="text-3xl font-bold text-white drop-shadow-sm">{stats.totalClassesScheduled}</p>
           </dd>
        </div>

        <div className="relative glass-panel pt-5 px-4 pb-12 sm:pt-6 sm:px-6 rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
           <dt>
             <div className="absolute rounded-xl p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-black/20">
               <CheckSquare className="h-6 w-6 text-white" />
             </div>
             <p className="ml-16 text-sm font-medium text-gray-400 truncate">Overall Attendance</p>
           </dt>
           <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
             <p className="text-3xl font-bold text-white drop-shadow-sm">{stats.attendanceRate}%</p>
           </dd>
        </div>

        <div className="relative glass-panel pt-5 px-4 pb-12 sm:pt-6 sm:px-6 rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
           <dt>
             <div className="absolute rounded-xl p-3 bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-black/20">
               <Clock className="h-6 w-6 text-white" />
             </div>
             <p className="ml-16 text-sm font-medium text-gray-400 truncate">Classes Attended</p>
           </dt>
           <dd className="ml-16 pb-6 flex items-baseline sm:pb-7 text-sm font-medium text-gray-300">
             <span className="text-3xl font-bold text-white drop-shadow-sm mr-2">{stats.present}</span>
             / {stats.present + stats.absent}
           </dd>
        </div>
      </div>

      <div className="mt-8 glass-panel p-8 rounded-2xl border border-white/10 flex justify-between items-center group overflow-hidden relative">
         <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150" />
         <div className="relative z-10 w-full text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Ready for your next class?</h3>
            <p className="text-sm text-gray-400 mb-6">Check your schedule to see upcoming lectures setup for your section.</p>
            <a href="/classes" className="glass-button-primary inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-medium hover:scale-105 transition-transform">
               View My Schedule
            </a>
         </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
