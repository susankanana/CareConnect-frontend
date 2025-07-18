import { useState } from 'react';
import { Menu, X, Phone, MapPin, Heart, Calendar, User } from 'lucide-react';
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

  const dashboardPath = role === 'admin'
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

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      {/* Emergency Top Bar */}
      <div className="bg-red-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 font-semibold">
                <Phone className="h-4 w-4" />
                <span>Emergency: +254 700 000 911</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
            <div className="hidden md:flex space-x-4">
              <span>24/7 Emergency Services</span>
              <span>Quality Healthcare</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigateTo('/')}
          >
            <div className="bg-gradient-to-r from-teal-500 to-pink-500 p-2 rounded-full">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold">
              <span className="text-teal-600">Care</span>
              <span className="text-pink-500">Connect</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              onClick={() => navigateTo('/')} 
              className="text-gray-700 hover:text-teal-600 font-medium cursor-pointer transition-colors"
            >
              Home
            </a>
            <a 
              onClick={() => navigateTo('/about')} 
              className="text-gray-700 hover:text-teal-600 font-medium cursor-pointer transition-colors"
            >
              About
            </a>
            <a 
              href="#services" 
              className="text-gray-700 hover:text-teal-600 font-medium cursor-pointer transition-colors"
            >
              Services
            </a>
            <a 
              href="#doctors" 
              className="text-gray-700 hover:text-teal-600 font-medium cursor-pointer transition-colors"
            >
              Doctors
            </a>

            {isLoggedIn && (
              <a 
                onClick={() => navigateTo(dashboardPath)} 
                className="text-gray-700 hover:text-teal-600 font-medium cursor-pointer transition-colors flex items-center gap-1"
              >
                <User className="h-4 w-4" />
                Dashboard
              </a>
            )}

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">
                  Welcome, {firstName || 'User'}!
                </span>
                <button 
                  onClick={handleLogout} 
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a 
                  onClick={() => navigateTo('/login')} 
                  className="text-gray-700 hover:text-teal-600 font-medium cursor-pointer transition-colors"
                >
                  Login
                </a>
                <a 
                  onClick={() => navigateTo('/register')} 
                  className="text-gray-700 hover:text-teal-600 font-medium cursor-pointer transition-colors"
                >
                  Register
                </a>
              </div>
            )}

            <button 
              onClick={() => navigateTo('/appointments')} 
              className="bg-gradient-to-r from-teal-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-teal-600 hover:to-pink-600 transition-all font-medium flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Book Appointment
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {isLoggedIn && (
              <span className="text-gray-700 font-medium text-sm">
                Hi, {firstName || 'User'}!
              </span>
            )}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-gray-700 hover:text-teal-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <a 
                onClick={() => navigateTo('/')} 
                className="text-gray-700 hover:text-teal-600 font-medium cursor-pointer transition-colors"
              >
                Home
              </a>
              <a 
                onClick={() => navigateTo('/about')} 
                className="text-gray-700 hover:text-teal-600 font-medium cursor-pointer transition-colors"
              >
                About
              </a>
              <a 
                href="#services" 
                className="text-gray-700 hover:text-teal-600 font-medium cursor-pointer transition-colors"
              >
                Services
              </a>
              <a 
                href="#doctors" 
                className="text-gray-700 hover:text-teal-600 font-medium cursor-pointer transition-colors"
              >
                Doctors
              </a>

              {isLoggedIn && (
                <a 
                  onClick={() => navigateTo(dashboardPath)} 
                  className="text-gray-700 hover:text-teal-600 font-medium cursor-pointer transition-colors flex items-center gap-1"
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </a>
              )}

              {isLoggedIn ? (
                <button 
                  onClick={handleLogout} 
                  className="text-gray-700 hover:text-red-600 font-medium text-left transition-colors"
                >
                  Logout
                </button>
              ) : (
                <>
                  <a 
                    onClick={() => navigateTo('/login')} 
                    className="text-gray-700 hover:text-teal-600 font-medium cursor-pointer transition-colors"
                  >
                    Login
                  </a>
                  <a 
                    onClick={() => navigateTo('/register')} 
                    className="text-gray-700 hover:text-teal-600 font-medium cursor-pointer transition-colors"
                  >
                    Register
                  </a>
                </>
              )}

              <button 
                onClick={() => navigateTo('/appointments')} 
                className="bg-gradient-to-r from-teal-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-teal-600 hover:to-pink-600 transition-all font-medium flex items-center gap-2 w-fit"
              >
                <Calendar className="h-4 w-4" />
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