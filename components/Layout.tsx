import React from 'react';
import { User, UserRole } from '../types';
import { LogOut, User as UserIcon, Menu, X, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSiteConfig } from '../context/SiteConfigContext';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { config } = useSiteConfig();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      {/* GIGW Top Bar */}
      <div className="bg-slate-100 text-xs py-1 px-4 border-b border-slate-200 flex justify-between items-center hidden md:flex">
        <div className="flex space-x-4">
          <span className="font-semibold">GOVERNMENT OF INDIA</span>
          <span className="text-slate-500">|</span>
          <span className="font-semibold">{config.header.ministryText}</span>
        </div>
        <div className="flex space-x-4 text-slate-600">
          <a href="#" className="hover:underline hover:text-csir-blue">Skip to Main Content</a>
          <a href="#" className="hover:underline hover:text-csir-blue">Screen Reader Access</a>
          <span className="cursor-pointer hover:text-black">A- | A | A+</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50 border-t-4 border-csir-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo Section */}
            <div className="flex items-center cursor-pointer group" onClick={() => navigate('/')}>
              <div className="flex-shrink-0 flex items-center">
                {/* Simulated Official Logo using SVG */}
                <div className="h-14 w-14 relative mr-3 transition-transform group-hover:scale-105">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="48" stroke="#003366" strokeWidth="4" fill="#fff"/>
                    <path d="M50 15 L80 35 L80 70 L50 90 L20 70 L20 35 Z" fill="#e6f0fa" stroke="#003366" strokeWidth="2"/>
                    <text x="50" y="55" fontSize="18" fontWeight="bold" fill="#003366" textAnchor="middle" dominantBaseline="middle">CSIR</text>
                    <text x="50" y="75" fontSize="10" fill="#f59e0b" textAnchor="middle">SERC</text>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-csir-blue font-bold text-xl leading-tight tracking-tight">{config.header.organizationName}</span>
                  <span className="text-slate-600 text-sm font-semibold">{config.header.organizationSubtitle}</span>
                  <span className="text-slate-500 text-xs uppercase tracking-wide">{config.header.parentOrganization}</span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-csir-blue border-b-2 border-csir-blue pb-1' : 'text-slate-600 hover:text-csir-blue'}`}>Home</Link>
              <Link to="/posts" className={`text-sm font-medium transition-colors ${isActive('/posts') ? 'text-csir-blue border-b-2 border-csir-blue pb-1' : 'text-slate-600 hover:text-csir-blue'}`}>Openings</Link>
              
              {user ? (
                <>
                  {user.role === UserRole.ADMIN ? (
                    <Link to="/admin" className={`text-sm font-medium transition-colors ${isActive('/admin') ? 'text-csir-blue border-b-2 border-csir-blue pb-1' : 'text-slate-600 hover:text-csir-blue'}`}>Admin Dashboard</Link>
                  ) : (
                     <Link to="/dashboard" className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-csir-blue border-b-2 border-csir-blue pb-1' : 'text-slate-600 hover:text-csir-blue'}`}>My Applications</Link>
                  )}
                  
                  <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-200">
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                      <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                    </div>
                    <button 
                      onClick={onLogout}
                      className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-red-600 transition-colors"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex space-x-3">
                  <Link to="/login" className="px-5 py-2 text-sm font-medium text-csir-blue hover:bg-csir-light rounded border border-transparent hover:border-csir-blue transition-all">Login</Link>
                  <Link to="/register" className="px-5 py-2 text-sm font-medium text-white bg-csir-blue hover:bg-blue-800 rounded shadow-md transition-all">Register</Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 hover:text-csir-blue p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-2 shadow-lg">
            <div className="px-4 py-2 space-y-1">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Home</Link>
              <Link to="/posts" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Current Openings</Link>
              {user && (
                 <Link to={user.role === UserRole.ADMIN ? "/admin" : "/dashboard"} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Dashboard</Link>
              )}
              {user ? (
                 <button onClick={onLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Link to="/login" className="block text-center px-3 py-2 rounded-md text-base font-medium border border-csir-blue text-csir-blue">Login</Link>
                  <Link to="/register" className="block text-center px-3 py-2 rounded-md text-base font-medium bg-csir-blue text-white">Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-csir-blue text-white py-12 border-t-4 border-csir-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
             <h3 className="font-bold text-lg mb-4 flex items-center">
              <ShieldCheck className="mr-2" /> {config.header.organizationName}
             </h3>
             <p className="text-slate-300 text-sm leading-relaxed">
               {config.footer.aboutText}
             </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-csir-accent uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-white hover:underline">About Us</a></li>
              <li><a href="#" className="hover:text-white hover:underline">RTI</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Tenders</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Contact Us</a></li>
            </ul>
          </div>
           <div>
            <h4 className="font-semibold mb-4 text-csir-accent uppercase tracking-wider text-xs">Support</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-white hover:underline">Recruitment Rules</a></li>
              <li><a href="#" className="hover:text-white hover:underline">FAQ</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Technical Helpdesk</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Sitemap</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-csir-accent uppercase tracking-wider text-xs">Contact</h4>
            <p className="text-sm text-slate-300 whitespace-pre-line">
              {config.footer.address}
              <br/><br/>
              Email: {config.footer.contactEmail}
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-blue-900 text-center text-xs text-slate-400">
          <p>{config.footer.copyrightText}</p>
        </div>
      </footer>
    </div>
  );
};