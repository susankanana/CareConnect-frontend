import {
  Heart,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router';

const Footer = () => {
  const navigate = useNavigate();
  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-teal-500 to-pink-500 p-2 rounded-full">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold">
                <span className="text-teal-400">Care</span>
                <span className="text-pink-400">Connect</span>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              With passion we deliver healthcare. Your trusted partner for comprehensive medical
              care and wellness services in Kenya.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#doctors" className="text-gray-300 hover:text-white transition-colors">
                  Our Doctors
                </a>
              </li>
              <li>
                <a
                  href="/appointments"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Book Appointment
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Patient Portal
                </a>
              </li>
            </ul>
          </div>

          {/* Medical Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Medical Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Cardiology
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Neurology
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Pediatrics
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Orthopedics
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Emergency Care
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Laboratory Services
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-pink-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Emergency: +254 700 000 911</div>
                  <div className="text-gray-300 text-sm">24/7 Emergency Services</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-pink-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">General: +254 700 123 456</div>
                  <div className="text-gray-300 text-sm">Appointments & Inquiries</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-pink-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">info@careconnect.co.ke</div>
                  <div className="text-gray-300 text-sm">General Information</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-pink-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">123 Healthcare Avenue</div>
                  <div className="text-gray-300 text-sm">Nairobi, Kenya</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-pink-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Mon - Fri: 8:00 AM - 8:00 PM</div>
                  <div className="text-gray-300 text-sm">Sat - Sun: 9:00 AM - 5:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-teal-600 to-pink-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Need Medical Attention?</h3>
          <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
            Don't wait when it comes to your health. Book an appointment with our experienced
            medical professionals today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigateTo('/appointments')}
              className="bg-white text-teal-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Calendar className="h-5 w-5" />
              Book Appointment
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-teal-600 transition-colors font-semibold flex items-center justify-center gap-2">
              <Phone className="h-5 w-5" />
              Call Emergency
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 CareConnect Hospital. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Medical Disclaimer
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
