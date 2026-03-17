import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, User as UserIcon, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingReport, setFetchingReport] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await api.get('/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      if (!selectedStudent) return;
      
      setFetchingReport(true);
      try {
        const response = await api.get(`/reports/student/${selectedStudent.id}`);
        setReportData(response.data);
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setFetchingReport(false);
      }
    };

    fetchReport();
  }, [selectedStudent]);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDoughnutData = (present, absent) => ({
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [present, absent],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        hoverBackgroundColor: ['#10B981', '#EF4444'],
        borderColor: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)'],
        borderWidth: 1,
      },
    ],
  });

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col md:flex-row gap-6 relative z-10">
      {/* Sidebar for Student Selection */}
      <div className="w-full md:w-1/3 glass-panel rounded-2xl border border-white/10 flex flex-col shadow-lg overflow-hidden">
        <div className="p-5 border-b border-white/10 bg-black/20">
          <h2 className="text-lg font-semibold text-white mb-4">Select Student</h2>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by name or roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input block w-full pl-10 pr-3 py-2.5"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 p-3">
          {loading ? (
            <div className="flex justify-center mt-6"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/20"></div></div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center text-gray-400 p-6 text-sm">No students found</div>
          ) : (
            <ul className="space-y-2">
              {filteredStudents.map(student => (
                <li key={student.id}>
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition-all ${
                      selectedStudent?.id === student.id 
                        ? 'bg-blue-500/20 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center mr-4 border ${selectedStudent?.id === student.id ? 'bg-blue-500/30 text-blue-200 border-blue-400/30' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${selectedStudent?.id === student.id ? 'text-white' : 'text-gray-300'}`}>
                        {student.name}
                      </p>
                      <p className={`text-xs mt-0.5 ${selectedStudent?.id === student.id ? 'text-blue-200' : 'text-gray-500'}`}>
                        Roll: {student.rollNumber} • Sec: {student.section}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Content Area for Report */}
      <div className="w-full md:w-2/3 flex flex-col">
        {!selectedStudent ? (
           <div className="glass-panel rounded-2xl border border-white/10 flex-1 flex flex-col items-center justify-center p-8 text-center shadow-lg">
              <div className="bg-white/5 p-5 rounded-full mb-6 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] animate-pulse-glow">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">No Student Selected</h3>
              <p className="mt-3 text-sm text-gray-400 max-w-sm">Select a student from the list on the left to view their detailed attendance report and history.</p>
           </div>
        ) : fetchingReport ? (
           <div className="glass-panel rounded-2xl border border-white/10 flex-1 flex items-center justify-center shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20"></div>
           </div>
        ) : reportData ? (
           <div className="glass-panel rounded-2xl border border-white/10 flex-1 overflow-y-auto shadow-lg animate-fade-in relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
             
              {/* Header Profile */}
              <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 px-8 py-8 rounded-t-2xl border-b border-white/10 relative overflow-hidden backdrop-blur-md">
                 <div className="flex items-center relative z-10">
                    <div className="h-20 w-20 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white shadow-inner backdrop-blur-sm">
                      <UserIcon className="h-10 w-10" />
                    </div>
                    <div className="ml-6 text-white">
                      <h2 className="text-3xl font-bold tracking-tight">{reportData.student.name}</h2>
                      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-100/80">
                        <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span> Roll No: {reportData.student.rollNumber}</span>
                        <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2"></span> Section: {reportData.student.section}</span>
                        <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"></span> {reportData.student.email}</span>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Stats Cards */}
              <div className="p-8">
                 <h3 className="text-lg font-semibold text-white mb-6">Attendance Overview</h3>
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                   <div className="bg-black/20 p-5 rounded-2xl border border-white/10 text-center backdrop-blur-sm shadow-inner transition-transform hover:-translate-y-1">
                     <p className="text-sm text-gray-400 font-medium">Total Classes</p>
                     <p className="text-3xl font-bold text-white mt-2 drop-shadow-sm">{reportData.totalClasses}</p>
                   </div>
                   <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 text-center backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.05)] transition-transform hover:-translate-y-1">
                     <p className="text-sm text-emerald-400 font-medium">Days Present</p>
                     <p className="text-3xl font-bold text-emerald-300 mt-2 drop-shadow-sm">{reportData.presentCount}</p>
                   </div>
                   <div className="bg-red-500/10 p-5 rounded-2xl border border-red-500/20 text-center backdrop-blur-sm shadow-[0_0_15px_rgba(239,68,68,0.05)] transition-transform hover:-translate-y-1">
                     <p className="text-sm text-red-400 font-medium">Days Absent</p>
                     <p className="text-3xl font-bold text-red-300 mt-2 drop-shadow-sm">{reportData.absentCount}</p>
                   </div>
                   <div className={`p-5 rounded-2xl border text-center backdrop-blur-sm transition-transform hover:-translate-y-1 ${reportData.attendancePercentage >= 75 ? 'bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.05)]' : 'bg-orange-500/10 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)]'}`}>
                     <p className={`text-sm font-medium ${reportData.attendancePercentage >= 75 ? 'text-blue-400' : 'text-orange-400'}`}>Percentage</p>
                     <p className={`text-3xl font-bold mt-2 drop-shadow-sm ${reportData.attendancePercentage >= 75 ? 'text-blue-300' : 'text-orange-300'}`}>
                       {reportData.attendancePercentage.toFixed(1)}%
                     </p>
                   </div>
                 </div>

                 {/* Chart and Details */}
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="col-span-1 lg:col-span-1 flex flex-col items-center justify-center p-6 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-sm">
                      <h4 className="text-sm font-medium text-gray-300 mb-6 w-full text-center">Attendance Distribution</h4>
                      <div className="w-full max-w-[200px] aspect-square relative">
                        {reportData.totalClasses > 0 ? (
                          <>
                            <Doughnut 
                              data={getDoughnutData(reportData.presentCount, reportData.absentCount)} 
                              options={{ 
                                maintainAspectRatio: true, 
                                cutout: '75%',
                                plugins: { 
                                  legend: { 
                                    position: 'bottom',
                                    labels: { color: 'rgba(255,255,255,0.7)', padding: 20 }
                                  } 
                                } 
                              }} 
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8 text-white font-bold text-xl">
                              {reportData.attendancePercentage.toFixed(0)}%
                            </div>
                          </>
                        ) : (
                          <div className="h-full flex items-center justify-center text-sm text-gray-500 border border-dashed border-white/10 rounded-full">
                            No data available
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-span-1 lg:col-span-2 flex flex-col rounded-2xl border border-white/10 bg-black/20 overflow-hidden backdrop-blur-sm">
                       <div className="p-4 border-b border-white/10 bg-white/5">
                         <h4 className="text-sm font-medium text-white">Detailed History</h4>
                       </div>
                       <div className="overflow-y-auto max-h-64 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                         {reportData.history.length === 0 ? (
                            <div className="p-8 text-center text-sm text-gray-500">No attendance history found.</div>
                         ) : (
                           <ul className="divide-y divide-white/5">
                             {reportData.history
                               .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort newest first
                               .map((record, idx) => (
                               <li key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                 <div className="flex items-center">
                                   <div className="p-2 bg-white/5 rounded-lg mr-4 border border-white/5">
                                     <Calendar className="h-4 w-4 text-gray-400" />
                                   </div>
                                   <span className="text-sm font-medium text-gray-200">{record.date}</span>
                                 </div>
                                 <div className="flex items-center">
                                    <span className="text-xs text-gray-500 mr-6 font-mono bg-black/30 px-2 py-1 rounded">cls-{record.classId}</span>
                                    {record.status === 'PRESENT' ? (
                                      <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Present
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/20">
                                        <XCircle className="h-3.5 w-3.5 mr-1.5" /> Absent
                                      </span>
                                    )}
                                 </div>
                               </li>
                             ))}
                           </ul>
                         )}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        ) : null}
      </div>
    </div>
  );
};

export default Reports;
