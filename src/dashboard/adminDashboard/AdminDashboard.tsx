import { useState } from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../../src/components/nav/Navbar';
import AdminDrawer from './aside/AdminDrawer';
import { FaBars } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import Footer from '../../components/footer/Footer';

const AdminDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Content layout wrapper */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`
            bg-gradient-to-b from-teal-700 to-pink-700 text-white w-64 
            lg:block ${drawerOpen ? 'block fixed z-50 h-full' : 'hidden'} 
            lg:static
          `}
        >
          {/* Close button for mobile */}
          <div className="relative h-full">
            <button
              className="absolute top-4 right-4 text-white text-2xl lg:hidden"
              onClick={handleDrawerToggle}
            >
              <IoCloseSharp />
            </button>
            <AdminDrawer />
          </div>
        </aside>

        {/* Main section */}
        <div className="flex flex-col flex-1">
          {/* Top bar */}
          <div className="flex items-center px-4 py-4 bg-gray-900">
            <button className="mr-4 text-white text-2xl lg:hidden" onClick={handleDrawerToggle}>
              {drawerOpen ? <IoCloseSharp /> : <FaBars />}
            </button>
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-pink-400 text-2xl font-extrabold shadow-md">
              Welcome to your Admin dashboard
            </h1>
          </div>

          {/* Main content */}
          <main className="flex-1 bg-gradient-to-br from-teal-50 to-pink-50 p-4">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminDashboard;
