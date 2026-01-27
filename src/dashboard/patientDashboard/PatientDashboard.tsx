import { useState } from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../components/nav/Navbar';
import Footer from '../../components/footer/Footer';
import { FaBars } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import PatientDrawer from './aside/PatientDrawer';

const PatientDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex flex-1 relative">
        {/* Mobile Sidebar Overlay */}
        {drawerOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
            onClick={handleDrawerToggle}
          />
        )}

        {/* Sidebar - Consistent with Doctor View */}
        <aside
          className={`
            bg-[#003d3d] text-white w-72 transition-all duration-300
            lg:block ${drawerOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden'} 
            lg:static
          `}
        >
          <div className="h-full flex flex-col">
            <PatientDrawer />
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
                {drawerOpen ? <IoCloseSharp size={24} /> : <FaBars size={22} />}
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome to your <span className="text-[#d91e5b]">Patient dashboard</span>
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

          {/* Main Content Section */}
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

export default PatientDashboard;