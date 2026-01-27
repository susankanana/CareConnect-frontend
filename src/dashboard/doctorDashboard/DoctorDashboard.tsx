import { useState } from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../../src/components/nav/Navbar';
import DoctorDrawer from './aside/DoctorDrawer';
import { FaBars } from 'react-icons/fa';
import Footer from '../../components/footer/Footer';

const DoctorDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex flex-1 relative">
        {/* Sidebar Overlay for Mobile */}
        {drawerOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
            onClick={handleDrawerToggle}
          />
        )}

        {/* Sidebar - Deep Teal #003d3d */}
        <aside
          className={`
            bg-[#003d3d] text-white w-72 transition-all duration-300
            lg:block ${drawerOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden'} 
            lg:static
          `}
        >
          <div className="h-full flex flex-col">
            <DoctorDrawer />
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Dashboard Sub-Header */}
          <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-100">
            <div className="flex items-center gap-4">
              <button 
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden" 
                onClick={handleDrawerToggle}
              >
                <FaBars size={22} />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome to your <span className="text-[#d91e5b]">Doctor dashboard</span>
                </h1>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                  CARECONNECT HEALTH SYSTEM
                </p>
              </div>
            </div>

            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-600">
                {new Date().toLocaleDateString('en-GB', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </p>
            </div>
          </header>

          {/* Main Routed Content */}
          <main className="flex-1 bg-[#f9fafb] p-6 lg:p-10 overflow-y-auto">
            <div className="max-w-400 mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorDashboard;