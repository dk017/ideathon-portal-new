
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import UserDashboard from '@/components/dashboard/UserDashboard';
import Hackathons from '@/pages/Hackathons';
import AllIdeas from '@/pages/AllIdeas';
import SkillMatrix from '@/pages/SkillMatrix';
import Analytics from '@/pages/Analytics';

const MainLayout = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
      case 'hackathons':
        return <Hackathons />;
      case 'ideas':
      case 'my-ideas':
      case 'browse-ideas':
        return <AllIdeas />;
      case 'skill-matrix':
        return <SkillMatrix />;
      case 'analytics':
        return <Analytics />;
      case 'users':
        return <div className="p-6">Users Management - Coming Soon</div>;
      case 'create-hackathon':
        return <div className="p-6">Create Hackathon Form - Coming Soon</div>;
      default:
        return user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar onMenuToggle={handleMenuToggle} isMobileMenuOpen={isMobileMenuOpen} />
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block fixed md:relative z-30 h-full bg-white/80 backdrop-blur-md shadow-lg md:shadow-none border-r border-slate-200/50`}>
          <Sidebar 
            activeView={activeView} 
            onViewChange={setActiveView} 
            isOpen={isMobileMenuOpen || true} 
          />
        </div>
        
        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="container max-w-7xl mx-auto p-6">
            <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 shadow-xl p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
