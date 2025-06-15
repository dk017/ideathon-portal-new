
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import UserDashboard from '@/components/dashboard/UserDashboard';

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
        return <div className="p-6">Hackathons View - Coming Soon</div>;
      case 'ideas':
      case 'my-ideas':
      case 'browse-ideas':
        return <div className="p-6">Ideas View - Coming Soon</div>;
      case 'skill-matrix':
        return <div className="p-6">Skill Matrix View - Coming Soon</div>;
      case 'analytics':
        return <div className="p-6">Analytics View - Coming Soon</div>;
      case 'users':
        return <div className="p-6">Users Management - Coming Soon</div>;
      case 'create-hackathon':
        return <div className="p-6">Create Hackathon Form - Coming Soon</div>;
      default:
        return user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuToggle={handleMenuToggle} isMobileMenuOpen={isMobileMenuOpen} />
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block fixed md:relative z-30 h-full bg-white shadow-lg md:shadow-none`}>
          <Sidebar 
            activeView={activeView} 
            onViewChange={setActiveView} 
            isOpen={isMobileMenuOpen || true} 
          />
        </div>
        
        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="container max-w-7xl mx-auto p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
