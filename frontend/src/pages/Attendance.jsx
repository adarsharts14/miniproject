import { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, Save } from 'lucide-react';

const Attendance = () => {
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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="mt-2 text-sm text-gray-700">Select a class and date to take attendance.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
            >
              <option value="">-- Select Class --</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.subjectName} (Section {cls.section})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
             <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                />
              </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : selectedClassDetails ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-100">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Students List - Section {selectedClassDetails.section}
            </h3>
            {message && <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">{message}</span>}
          </div>
          
          {students.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No students found for this section.</div>
          ) : (
            <>
              <ul className="divide-y divide-gray-200">
                {students.map((student) => (
                  <li key={student.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">Roll No: {student.rollNumber}</p>
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                      <button
                        onClick={() => handleStatusChange(student.id, 'PRESENT')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          attendance[student.id] === 'PRESENT'
                            ? 'bg-green-500 text-white shadow-sm'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(student.id, 'ABSENT')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          attendance[student.id] === 'ABSENT'
                            ? 'bg-red-500 text-white shadow-sm'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-4 bg-gray-50 border-t border-gray-200 sm:px-6 flex justify-end">
                <button
                  onClick={handleSaveAttendance}
                  disabled={submitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {submitting ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
         <div className="text-center text-gray-500 mt-10">Select a class to mark attendance</div>
      )}
    </div>
  );
};

export default Attendance;
