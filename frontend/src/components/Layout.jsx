import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import TeacherChatbot from './TeacherChatbot';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full relative z-10">
        <Navbar />
        <main className="flex-1 overflow-y-auto w-full pt-16 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      
      {/* Globally mounted Chatbot, only visible to Teachers */}
      {user?.role === 'TEACHER' && <TeacherChatbot />}
    </div>
  );
};

export default Layout;
