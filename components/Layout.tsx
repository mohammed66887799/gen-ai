
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-emerald-900 text-white sticky top-0 h-screen shadow-xl">
        <div className="p-6 flex items-center space-x-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <i className="fas fa-leaf text-xl"></i>
          </div>
          <span className="text-xl font-bold tracking-tight">AgroDetect AI</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'text-emerald-100 hover:bg-emerald-800'
              }`}
            >
              <span className="w-6 text-center">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-800">
          <div className="flex items-center space-x-3 p-3 text-emerald-100">
            <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold">JD</div>
            <div>
              <p className="text-sm font-semibold">John Doe</p>
              <p className="text-xs opacity-70">Premium Farmer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <header className="md:hidden bg-emerald-900 text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <i className="fas fa-leaf text-emerald-400"></i>
          <span className="font-bold">AgroDetect AI</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-emerald-900 text-white pt-20">
          <nav className="p-6 space-y-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-4 p-4 rounded-2xl text-lg ${
                  location.pathname === item.path ? 'bg-emerald-800' : ''
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (Persistent CTA for Diagnosis) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <Link 
          to="/diagnosis"
          className="bg-emerald-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-4 border-white active:scale-95 transition-transform"
        >
          <i className="fas fa-plus text-2xl"></i>
        </Link>
      </div>
    </div>
  );
};

export default Layout;
