import { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, Save, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StudentAttendance from './student/StudentAttendance';

const Attendance = () => {
  const { user } = useAuth();
  
  if (user?.role === 'STUDENT') {
    return <StudentAttendance />;
  }

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get('/classes');
        setClasses(response.data);
        if (response.data.length > 0) {
          setSelectedClass(response.data[0].id.toString());
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchStudentsAndAttendance = async () => {
      if (!selectedClass || !date) return;
      
      setLoading(true);
      setMessage('');
      try {
        const cls = classes.find(c => c.id.toString() === selectedClass);
        if (!cls) {
          setLoading(false);
          return;
        }

        const [studentsRes, attendanceRes] = await Promise.all([
          api.get('/students'), 
          api.get(`/attendance/class/${selectedClass}?date=${date}`)
        ]);

        const filteredStudents = studentsRes.data.filter(s => s.section === cls.section);
        setStudents(filteredStudents);

        const attendanceMap = {};
        
        filteredStudents.forEach(st => {
           attendanceMap[st.id] = 'PRESENT'; // default to present
        });
        
        if (attendanceRes.data && attendanceRes.data.length > 0) {
          attendanceRes.data.forEach(att => {
            attendanceMap[att.studentId] = att.status;
          });
        }
        
        setAttendance(attendanceMap);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (classes.length > 0) {
      fetchStudentsAndAttendance();
    }
  }, [selectedClass, date, classes]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass || !date || students.length === 0) return;
    
    setSubmitting(true);
    setMessage('');

    const payload = {
      classId: parseInt(selectedClass),
      date,
      attendances: Object.entries(attendance).map(([studentId, status]) => ({
        studentId: parseInt(studentId),
        status
      }))
    };

    try {
      await api.post('/attendance/mark', payload);
      setMessage('Attendance saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedClassDetails = classes.find(c => c.id.toString() === selectedClass);

  return (
    <div className="relative z-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">Mark Attendance</h1>
        <p className="mt-2 text-sm text-gray-300">Select a class and date to take attendance.</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/10 mb-8 backdrop-blur-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-white">Select Class</label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="glass-input block w-full pl-3 pr-10 py-3 text-base appearance-none cursor-pointer"
              >
                <option value="" className="bg-neutral-900 text-white">-- Select Class --</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id} className="bg-neutral-900 text-white">
                    {cls.subjectName} (Section {cls.section})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-white">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-white">Select Date</label>
             <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="glass-input block w-full pl-10 py-3 relative"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/20"></div></div>
      ) : selectedClassDetails ? (
        <div className="glass-panel overflow-hidden sm:rounded-2xl border border-white/10 shadow-lg">
          <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md">
            <h3 className="text-lg leading-6 font-semibold text-white">
              Students List - Section {selectedClassDetails.section}
            </h3>
            {message && <span className="text-sm font-medium text-green-300 bg-green-500/20 border border-green-500/30 px-4 py-1.5 rounded-full animate-fade-in shadow-[0_0_10px_rgba(16,185,129,0.2)]">{message}</span>}
          </div>
          
          {students.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No students found for this section.</div>
          ) : (
            <>
              <ul className="divide-y divide-white/5">
                {students.map((student) => (
                  <li key={student.id} className="px-6 py-4 glass-table-row flex items-center justify-between group">
                    <div>
                      <p className="text-base font-medium text-white group-hover:text-blue-200 transition-colors">{student.name}</p>
                      <p className="text-sm text-gray-400 mt-1">Roll No: {student.rollNumber}</p>
                    </div>
                    <div className="flex bg-black/20 p-1 rounded-xl border border-white/10 backdrop-blur-sm">
                      <button
                        onClick={() => handleStatusChange(student.id, 'PRESENT')}
                        className={`px-5 py-2 text-sm font-medium rounded-lg transition-all flex items-center ${
                          attendance[student.id] === 'PRESENT'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                        }`}
                      >
                        {attendance[student.id] === 'PRESENT' && <CheckCircle2 className="w-4 h-4 mr-1.5" />}
                        Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(student.id, 'ABSENT')}
                        className={`px-5 py-2 text-sm font-medium rounded-lg transition-all flex items-center ${
                          attendance[student.id] === 'ABSENT'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                        }`}
                      >
                        {attendance[student.id] === 'ABSENT' && <XCircle className="w-4 h-4 mr-1.5" />}
                        Absent
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-6 py-5 bg-black/20 border-t border-white/10 flex justify-end">
                <button
                  onClick={handleSaveAttendance}
                  disabled={submitting}
                  className="glass-button-primary inline-flex items-center px-6 py-2.5 shadow-lg text-sm font-medium rounded-xl hover:-translate-y-0.5"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {submitting ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
         <div className="glass-panel text-center text-gray-400 mt-10 p-10 rounded-2xl border border-white/5">Select a class to mark attendance</div>
      )}
    </div>
  );
};

export default Attendance;
