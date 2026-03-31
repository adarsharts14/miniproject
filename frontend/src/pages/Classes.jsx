import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StudentClasses from './student/StudentClasses';

const Classes = () => {
  const { user } = useAuth();
  
  if (user?.role === 'STUDENT') {
    return <StudentClasses />;
  }

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, subjectName: '', section: '', scheduleTime: '' });
  const [editing, setEditing] = useState(false);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const openModal = (cls = null) => {
    if (cls) {
      setFormData(cls);
      setEditing(true);
    } else {
      setFormData({ id: null, subjectName: '', section: '', scheduleTime: '' });
      setEditing(false);
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/classes/${formData.id}`, formData);
      } else {
        await api.post('/classes', formData);
      }
      fetchClasses();
      closeModal();
    } catch (error) {
      console.error('Error saving class:', error);
      alert(error.response?.data?.error || 'Error saving class');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await api.delete(`/classes/${id}`);
        fetchClasses();
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  if (loading) return <div className="flex justify-center mt-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/20"></div></div>;

  return (
    <div className="relative z-10 animate-fade-in">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">Classes</h1>
          <p className="mt-2 text-sm text-gray-300">A list of all the classes you manage.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => openModal()}
            className="inline-flex items-center justify-center rounded-xl glass-button-primary px-4 py-2 hover:-translate-y-0.5"
          >
            <Plus className="mr-2 -ml-1 h-5 w-5" />
            Add Class
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden sm:rounded-2xl">
        <ul className="divide-y divide-white/10">
          {classes.length === 0 ? (
            <li className="p-8 text-center text-gray-400">No classes found. Add one to get started.</li>
          ) : (
            classes.map((cls) => (
              <li key={cls.id} className="glass-table-row">
                <div className="px-4 py-5 flex items-center sm:px-6 justify-between group">
                  <div className="flex flex-col">
                    <p className="text-lg font-medium text-blue-300 truncate group-hover:text-blue-200 transition-colors">{cls.subjectName}</p>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="bg-white/10 px-2 py-0.5 rounded-md text-xs mr-3 border border-white/5">Sec: {cls.section}</span>
                        <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span> {cls.scheduleTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(cls)} className="p-2 text-gray-300 hover:text-blue-300 rounded-full hover:bg-white/10 transition-colors">
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(cls.id)} className="p-2 text-gray-300 hover:text-red-400 rounded-full hover:bg-white/10 transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {showModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={closeModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom glass-panel border border-white/20 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-white/10">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-xl leading-6 font-semibold text-white" id="modal-title">
                      {editing ? 'Edit Class' : 'Add New Class'}
                    </h3>
                    <div className="mt-6">
                      <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        <div>
                          <label htmlFor="subjectName" className="block text-sm font-medium text-gray-300 mb-1">Subject Name</label>
                          <input type="text" id="subjectName" required value={formData.subjectName} onChange={(e) => setFormData({...formData, subjectName: e.target.value})} className="glass-input w-full" placeholder="e.g. Mathematics 101" />
                        </div>
                        <div>
                          <label htmlFor="section" className="block text-sm font-medium text-gray-300 mb-1">Section</label>
                          <input type="text" id="section" required value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} className="glass-input w-full" placeholder="e.g. CS-A" />
                        </div>
                        <div>
                          <label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-300 mb-1">Schedule Time</label>
                          <input type="text" id="scheduleTime" required value={formData.scheduleTime} onChange={(e) => setFormData({...formData, scheduleTime: e.target.value})} className="glass-input w-full" placeholder="e.g. Mon & Wed, 10:00 AM" />
                        </div>
                      </form>
                    </div>
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

export default Classes;
