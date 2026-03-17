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
        backgroundColor: ['#10B981', '#EF4444'],
        hoverBackgroundColor: ['#059669', '#DC2626'],
        borderWidth: 0,
      },
    ],
  });

  return (
    <div className="flex h-full flex-col md:flex-row gap-6">
      {/* Sidebar for Student Selection */}
      <div className="w-full md:w-1/3 bg-white rounded-lg shadow border border-gray-100 flex flex-col h-[calc(100vh-8rem)]">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Select Student</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 p-2">
          {loading ? (
            <div className="flex justify-center mt-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center text-gray-400 p-4 text-sm">No students found</div>
          ) : (
            <ul className="space-y-1">
              {filteredStudents.map(student => (
                <li key={student.id}>
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center shadow-sm transition-colors ${
                      selectedStudent?.id === student.id 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center mr-3 ${selectedStudent?.id === student.id ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${selectedStudent?.id === student.id ? 'text-blue-900' : 'text-gray-900'}`}>
                        {student.name}
                      </p>
                      <p className={`text-xs ${selectedStudent?.id === student.id ? 'text-blue-700' : 'text-gray-500'}`}>
                        Roll No: {student.rollNumber} | Sec: {student.section}
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
      <div className="w-full md:w-2/3 flex flex-col h-[calc(100vh-8rem)]">
        {!selectedStudent ? (
           <div className="bg-white rounded-lg shadow border border-gray-100 flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No Student Selected</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm">Select a student from the list on the left to view their detailed attendance report.</p>
           </div>
        ) : fetchingReport ? (
           <div className="bg-white rounded-lg shadow border border-gray-100 flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
           </div>
        ) : reportData ? (
           <div className="bg-white rounded-lg shadow border border-gray-100 flex-1 overflow-y-auto">
             
              {/* Header Profile */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 rounded-t-lg">
                 <div className="flex items-center">
                    <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-inner">
                      <UserIcon className="h-10 w-10" />
                    </div>
                    <div className="ml-6 text-white">
                      <h2 className="text-2xl font-bold">{reportData.student.name}</h2>
                      <div className="mt-1 flex flex-wrap gap-4 text-sm opacity-90">
                        <span>Roll Number: {reportData.student.rollNumber}</span>
                        <span>Section: {reportData.student.section}</span>
                        <span>Email: {reportData.student.email}</span>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Stats Cards */}
              <div className="p-6">
                 <h3 className="text-lg font-medium text-gray-900 mb-6">Attendance Overview</h3>
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                   <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                     <p className="text-sm text-gray-500 font-medium">Total Classes</p>
                     <p className="text-3xl font-bold text-gray-900 mt-1">{reportData.totalClasses}</p>
                   </div>
                   <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                     <p className="text-sm text-green-700 font-medium">Days Present</p>
                     <p className="text-3xl font-bold text-green-700 mt-1">{reportData.presentCount}</p>
                   </div>
                   <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
                     <p className="text-sm text-red-700 font-medium">Days Absent</p>
                     <p className="text-3xl font-bold text-red-700 mt-1">{reportData.absentCount}</p>
                   </div>
                   <div className={`p-4 rounded-lg border text-center ${reportData.attendancePercentage >= 75 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
                     <p className={`text-sm font-medium ${reportData.attendancePercentage >= 75 ? 'text-blue-700' : 'text-orange-700'}`}>Percentage</p>
                     <p className={`text-3xl font-bold mt-1 ${reportData.attendancePercentage >= 75 ? 'text-blue-700' : 'text-orange-700'}`}>
                       {reportData.attendancePercentage.toFixed(1)}%
                     </p>
                   </div>
                 </div>

                 {/* Chart and Details */}
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="col-span-1 lg:col-span-1 flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-600 mb-4 w-full text-center">Attendance Distribution</h4>
                      <div className="w-full max-w-[200px] aspect-square">
                        {reportData.totalClasses > 0 ? (
                          <Doughnut 
                            data={getDoughnutData(reportData.presentCount, reportData.absentCount)} 
                            options={{ maintainAspectRatio: true, plugins: { legend: { position: 'bottom' } } }} 
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-sm text-gray-400">
                            No data available
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-span-1 lg:col-span-2">
                       <h4 className="text-sm font-medium text-gray-900 mb-4">Detailed History</h4>
                       <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-64 overflow-y-auto">
                         {reportData.history.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500 mt-10">No attendance history found.</div>
                         ) : (
                           <ul className="divide-y divide-gray-200">
                             {reportData.history
                               .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort newest first
                               .map((record, idx) => (
                               <li key={idx} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                                 <div className="flex items-center">
                                   <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                   <span className="text-sm font-medium text-gray-900">{record.date}</span>
                                 </div>
                                 <div className="flex items-center">
                                    <span className="text-xs text-gray-500 mr-4">Class ID: {record.classId}</span>
                                    {record.status === 'PRESENT' ? (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Present
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        <XCircle className="h-3.5 w-3.5 mr-1" /> Absent
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
