import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', rollNumber: '', section: '', email: '' });
  const [editing, setEditing] = useState(false);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openModal = (student = null) => {
    if (student) {
      setFormData(student);
      setEditing(true);
    } else {
      setFormData({ id: null, name: '', rollNumber: '', section: '', email: '' });
      setEditing(false);
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/students/${formData.id}`, formData);
      } else {
        await api.post('/students', formData);
      }
      fetchStudents();
      closeModal();
    } catch (error) {
      console.error('Error saving student:', error);
      alert(error.response?.data?.error || 'Error saving student');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/students/${id}`);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  if (loading) return <div className="flex justify-center mt-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/20"></div></div>;

  return (
    <div className="relative z-10 animate-fade-in">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">Students</h1>
          <p className="mt-2 text-sm text-gray-300">Manage all students enrolled in your classes.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => openModal()}
            className="inline-flex items-center justify-center rounded-xl glass-button-primary px-4 py-2 hover:-translate-y-0.5"
          >
            <Plus className="mr-2 -ml-1 h-5 w-5" />
            Add Student
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden sm:rounded-2xl">
        <ul className="divide-y divide-white/10">
          {students.length === 0 ? (
            <li className="p-8 text-center text-gray-400">No students found. Add one to get started.</li>
          ) : (
             <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-white/10 text-left">
                 <thead className="bg-white/5 border-b border-white/10">
                   <tr>
                     <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Name & Roll No</th>
                     <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Section</th>
                     <th scope="col" className="px-6 py-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Email</th>
                     <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5 bg-transparent">
                   {students.map((student) => (
                     <tr key={student.id} className="glass-table-row group">
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center">
                           <div>
                             <div className="text-sm font-medium text-white group-hover:text-blue-200 transition-colors">{student.name}</div>
                             <div className="text-xs text-gray-400 mt-0.5">Roll: {student.rollNumber}</div>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                           {student.section}
                         </span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                         {student.email}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <div className="flex justify-end space-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => openModal(student)} className="p-2 text-gray-300 hover:text-blue-300 rounded-full hover:bg-white/10 transition-colors">
                             <Edit2 className="h-4 w-4" />
                           </button>
                           <button onClick={() => handleDelete(student.id)} className="p-2 text-gray-300 hover:text-red-400 rounded-full hover:bg-white/10 transition-colors">
                             <Trash2 className="h-4 w-4" />
                           </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          )}
        </ul>
      </div>

      {showModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom glass-panel border border-white/20 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-white/10">
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-xl leading-6 font-semibold text-white">
                    {editing ? 'Edit Student' : 'Add New Student'}
                  </h3>
                  <div className="mt-6">
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="glass-input w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Roll Number</label>
                        <input type="text" value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} className="glass-input w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Section</label>
                        <input type="text" value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} className="glass-input w-full" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="glass-input w-full" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-black/20 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-2xl">
                <button type="button" onClick={handleSubmit} className="w-full inline-flex justify-center glass-button-primary px-4 py-2 rounded-xl text-base font-medium sm:ml-3 sm:w-auto sm:text-sm">
                  Save
                </button>
                <button type="button" onClick={closeModal} className="mt-3 w-full inline-flex justify-center glass-button px-4 py-2 border-transparent rounded-xl text-base font-medium sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
