import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Clock, User } from 'lucide-react';

const StudentClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const studentRes = await api.get(`/students/email/${user.email}`);
        const section = studentRes.data.section;
        
        const response = await api.get(`/classes/section/${section}`);
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.email) {
      fetchClasses();
    }
  }, [user]);

  if (loading) return <div className="flex justify-center mt-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/20"></div></div>;

  return (
    <div className="relative z-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">My Schedule</h1>
        <p className="mt-2 text-sm text-gray-300">Here are all the classes scheduled for your section.</p>
      </div>

      <div className="glass-panel overflow-hidden sm:rounded-2xl border border-white/10 shadow-lg">
        <ul className="divide-y divide-white/10">
          {classes.length === 0 ? (
            <li className="p-10 text-center text-gray-400">No classes scheduled for your section yet.</li>
          ) : (
            classes.map((cls) => (
              <li key={cls.id} className="glass-table-row hover:bg-white/5 transition-colors group">
                <div className="px-6 py-6 flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-xl font-medium text-white mb-2">{cls.subjectName}</p>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                        <User className="h-4 w-4 mr-2" />
                        Prof. {cls.teacherName}
                      </div>
                      <div className="flex items-center text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                        <Clock className="h-4 w-4 mr-2" />
                        {cls.scheduleTime}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default StudentClasses;
