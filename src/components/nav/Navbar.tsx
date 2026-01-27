import { useState } from 'react';
import { Menu, X, Phone, MapPin, Heart, Calendar, User, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../src/app/store';
import { logout } from '../../../src/reducers/login/userSlice';
import { useNavigate } from 'react-router';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.user);
  const token = useSelector((state: RootState) => state.user.token);
  const isLoggedIn = !!token;
  const firstName = user?.first_name;
  const role = user?.role;

  const dashboardPath =
    role === 'admin'
      ? '/admin/dashboard/users'
      : role === 'doctor'
        ? '/doctor/dashboard/appointments'
        : role === 'user'
          ? '/user/dashboard/appointments'
          : '/login';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  // Logic to handle internal section scrolling vs page navigation
  const navigateAndScroll = (sectionId: string) => {
    setIsMenuOpen(false);
    if (window.location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on home, navigate to home with the hash
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <nav className="bg-white sticky top-0 z-50">
      {/* Emergency Top Bar */}
      <div className="bg-[#cc0000] text-white py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-[13px] font-medium tracking-tight">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Phone className="h-3.5 w-3.5" />
                <span>Emergency: +254 700 000 911</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <MapPin className="h-3.5 w-3.5 text-red-200" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
            <div className="hidden md:flex space-x-6 uppercase tracking-widest text-[10px] font-bold">
              <span>24/7 Emergency Services</span>
              <span className="border-l border-white/30 pl-6">Quality Healthcare</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-gray-100 shadow-sm">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => navigateTo('/')}
          >
            <div className="bg-linear-to-br from-[#14b8a6] to-[#ec4899] p-2 rounded-full shadow-md transition-transform group-hover:scale-110">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold tracking-tighter">
              <span className="text-[#00a18e]">Care</span>
              <span className="text-[#f43f8e]">Connect</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6 pr-6 border-r border-gray-100">
              <a onClick={() => navigateTo('/')} className="text-gray-600 hover:text-[#00a18e] text-sm font-bold cursor-pointer transition-all uppercase tracking-wide">
                Home
              </a>
              <a onClick={() => navigateTo('/about')} className="text-gray-600 hover:text-[#00a18e] text-sm font-bold cursor-pointer transition-all uppercase tracking-wide">
                About
              </a>
              <a onClick={() => navigateAndScroll('services')} className="text-gray-600 hover:text-[#00a18e] text-sm font-bold cursor-pointer transition-all uppercase tracking-wide">
                Services
              </a>
              <a onClick={() => navigateAndScroll('doctors')} className="text-gray-600 hover:text-[#00a18e] text-sm font-bold cursor-pointer transition-all uppercase tracking-wide">
                Doctors
              </a>
            </div>

            <div className="flex items-center space-x-5">
              {isLoggedIn ? (
                <div className="flex items-center space-x-6">
                  <div 
                    onClick={() => navigateTo(dashboardPath)}
                    className="flex items-center gap-3 cursor-pointer group bg-teal-50/50 hover:bg-teal-50 px-3 py-1.5 rounded-2xl transition-all border border-transparent hover:border-teal-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-linear-to-tr from-[#00a18e] to-[#14b8a6] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {firstName ? firstName[0].toUpperCase() : <User className="h-4 w-4" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-tighter text-teal-600 font-black leading-none mb-1">
                        {role || 'Account'}
                      </span>
                      <span className="text-sm font-bold text-gray-800 leading-none">
                        {firstName || 'Dashboard'}
                      </span>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-6">
                  <a onClick={() => navigateTo('/login')} className="text-sm font-bold text-gray-600 hover:text-[#00a18e] cursor-pointer transition-colors uppercase tracking-wide">
                    Login
                  </a>
                  <button
                    onClick={() => navigateTo('/appointments')}
                    className="bg-linear-to-r from-[#00a18e] to-[#f43f8e] text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all font-bold text-sm flex items-center gap-2 active:scale-95"
                  >
                    <Calendar className="h-4 w-4" />
                    Book Now
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg bg-gray-50 text-gray-600">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {isMenuOpen && (
          <div className="md:hidden py-6 bg-white border-t border-gray-50 animate-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col space-y-5 px-2">
              <a onClick={() => navigateTo('/')} className="text-lg font-bold text-gray-800">Home</a>
              <a onClick={() => navigateTo('/about')} className="text-lg font-bold text-gray-800">About</a>
              <a onClick={() => navigateAndScroll('services')} className="text-lg font-bold text-gray-800">Services</a>
              <a onClick={() => navigateAndScroll('doctors')} className="text-lg font-bold text-gray-800">Doctors</a>
              <hr className="border-gray-100" />
              {isLoggedIn ? (
                <>
                  <a onClick={() => navigateTo(dashboardPath)} className="text-lg font-bold text-[#00a18e]">Dashboard</a>
                  <button onClick={handleLogout} className="text-lg font-bold text-red-500 text-left">Logout</button>
                </>
              ) : (
                <a onClick={() => navigateTo('/login')} className="text-lg font-bold text-gray-800">Login</a>
              )}
              <button
                onClick={() => navigateTo('/appointments')}
                className="w-full bg-linear-to-r from-[#00a18e] to-[#f43f8e] text-white py-4 rounded-2xl font-bold text-center"
              >
                Book Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;