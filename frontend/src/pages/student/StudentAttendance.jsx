import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, XCircle } from 'lucide-react';

const StudentAttendance = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const studentRes = await api.get(`/students/email/${user.email}`);
        const studentId = studentRes.data.id;
        
        const response = await api.get(`/attendance/student/${studentId}`);
        setAttendanceRecords(response.data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.email) {
      fetchAttendance();
    }
  }, [user]);

  if (loading) return <div className="flex justify-center mt-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/20"></div></div>;

  return (
    <div className="relative z-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">My Attendance History</h1>
        <p className="mt-2 text-sm text-gray-300">View your daily attendance logs across all subjects.</p>
      </div>

      <div className="glass-panel overflow-hidden sm:rounded-2xl border border-white/10 shadow-lg">
        {attendanceRecords.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No attendance records found yet.</div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-white/5 border-b border-white/10 backdrop-blur-md">
                      <th className="px-6 py-4 text-sm font-semibold text-white tracking-wider">Date</th>
                      <th className="px-6 py-4 text-sm font-semibold text-white tracking-wider">Subject</th>
                      <th className="px-6 py-4 text-sm font-semibold text-white tracking-wider">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {attendanceRecords.map((record) => (
                      <tr key={record.id} className="glass-table-row hover:bg-white/5 transition-colors">
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {new Date(record.date).toLocaleDateString(undefined, {
                               weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                            })}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {record.className}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                            {record.status === 'PRESENT' ? (
                               <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Present
                               </span>
                            ) : (
                               <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-300 bg-red-500/10 border border-red-500/20 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                                  <XCircle className="w-3.5 h-3.5 mr-1" /> Absent
                               </span>
                            )}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
