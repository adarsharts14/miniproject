import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import FloatingOrbs from './components/FloatingOrbs';
import LoginChoice from './pages/LoginChoice';
import TeacherLogin from './pages/TeacherLogin';
import StudentLogin from './pages/StudentLogin';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <FloatingOrbs />
      <Routes>
        <Route path="/login" element={<LoginChoice />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/students" element={<Students />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
