import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { ApplicationForm } from './pages/ApplicationForm';
import { AdminDashboard } from './pages/AdminDashboard';
import { User, UserRole } from './types';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { ShieldCheck, UserPlus, LogIn } from 'lucide-react';

// Initial Mock Data
const MOCK_ADMIN: User = { 
  id: 'admin1', 
  name: 'Dr. Admin Officer', 
  email: 'admin@serc.res.in', 
  mobile: '9999999999',
  aadhaar: '111111111111',
  role: UserRole.ADMIN 
};

const MOCK_APPLICANT: User = { 
  id: 'user1', 
  name: 'Priya Engineer', 
  email: 'priya@example.com', 
  mobile: '9876543210',
  aadhaar: '123412341234',
  role: UserRole.APPLICANT 
};

// Internal Components for Login/Register to use Navigation
const Login: React.FC<{ onLogin: (u: User) => void, users: User[] }> = ({ onLogin, users }) => {
  const [aadhaar, setAadhaar] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^\d{12}$/.test(aadhaar)) {
      setError('Please enter a valid 12-digit Aadhaar Number.');
      return;
    }

    const user = users.find(u => u.aadhaar === aadhaar);
    if (user) {
      onLogin(user);
      navigate(user.role === UserRole.ADMIN ? '/admin' : '/dashboard');
    } else {
      setError('User not found. Please check Aadhaar number or register.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
           <div className="bg-csir-light p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
             <ShieldCheck className="text-csir-blue w-8 h-8" />
           </div>
           <h2 className="text-2xl font-bold text-slate-800">Portal Login</h2>
           <p className="text-slate-500 text-sm mt-2">Enter your Aadhaar Number to access the portal. (Local Authentication Only)</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Aadhaar Number <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              placeholder="12-digit Aadhaar Number" 
              maxLength={12}
              className="w-full p-3 border border-slate-300 rounded focus:border-csir-blue focus:ring-1 focus:ring-csir-blue outline-none transition"
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}
          <button type="submit" className="w-full py-3 bg-csir-blue text-white rounded font-semibold hover:bg-blue-900 transition flex items-center justify-center">
             <LogIn size={18} className="mr-2"/> Login
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
           <p className="text-slate-600">Don't have an account? <span onClick={() => navigate('/register')} className="text-csir-blue font-bold cursor-pointer hover:underline">Register Here</span></p>
           <div className="mt-4 pt-4 border-t text-xs text-slate-400">
             <p>Admin Login: Use Aadhaar 111111111111</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const Register: React.FC<{ users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>> }> = ({ users, setUsers }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', aadhaar: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     // Basic input sanitization for numbers
     if ((name === 'mobile' || name === 'aadhaar') && !/^\d*$/.test(value)) return;
     setFormData({ ...formData, [name]: value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.aadhaar.length !== 12) {
      setError('Aadhaar number must be exactly 12 digits.');
      return;
    }
    if (formData.mobile.length !== 10) {
      setError('Mobile number must be exactly 10 digits.');
      return;
    }

    // Duplicate Check
    if (users.some(u => u.aadhaar === formData.aadhaar)) {
      setError('This Aadhaar Number is already registered. Please login.');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      aadhaar: formData.aadhaar,
      role: UserRole.APPLICANT
    };

    setUsers([...users, newUser]);
    alert('Registration Successful! Please login with your Aadhaar number.');
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
           <div className="bg-green-50 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
             <UserPlus className="text-green-600 w-8 h-8" />
           </div>
           <h2 className="text-2xl font-bold text-slate-800">Applicant Registration</h2>
           <p className="text-slate-500 text-sm mt-2">Create an account to apply for positions.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address <span className="text-red-500">*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mobile <span className="text-red-500">*</span></label>
              <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} maxLength={10} className="w-full p-2 border rounded" required placeholder="10 digits" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Aadhaar <span className="text-red-500">*</span></label>
              <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} maxLength={12} className="w-full p-2 border rounded" required placeholder="12 digits" />
            </div>
          </div>
          
          {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}
          
          <button type="submit" className="w-full py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition">
             Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
           Already registered? <span onClick={() => navigate('/login')} className="text-csir-blue font-bold cursor-pointer hover:underline">Login here</span>
        </p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([MOCK_ADMIN, MOCK_APPLICANT]);

  const handleLogout = () => setUser(null);

  return (
    <SiteConfigProvider>
      <Router>
        <Layout user={user} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/posts" element={<LandingPage />} />
            
            <Route path="/login" element={<Login onLogin={setUser} users={users} />} />
            <Route path="/register" element={<Register users={users} setUsers={setUsers} />} />

            {/* Protected Applicant Routes */}
            <Route path="/apply/:postId" element={user ? <ApplicationForm /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={
              user ? (
                <div className="max-w-4xl mx-auto py-10 px-4">
                  <h1 className="text-2xl font-bold mb-6">My Applications</h1>
                  <div className="bg-white p-6 rounded shadow border">
                     <div className="flex items-center space-x-4 mb-4">
                        <div className="h-12 w-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{user.name}</h3>
                          <p className="text-sm text-slate-500">Aadhaar: {user.aadhaar} | Mobile: {user.mobile}</p>
                        </div>
                     </div>
                    <p className="text-slate-500">No active applications found. Check <a href="#/posts" className="text-csir-blue underline">Openings</a> to start a new application.</p>
                  </div>
                </div>
              ) : <Navigate to="/login" />
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={user?.role === UserRole.ADMIN ? <AdminDashboard /> : <Navigate to="/login" />} />
          </Routes>
        </Layout>
      </Router>
    </SiteConfigProvider>
  );
};

export default App;