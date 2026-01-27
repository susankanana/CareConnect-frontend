import {
  Heart,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Calendar,
  Video,
} from 'lucide-react';
import { useNavigate } from 'react-router';

const Footer = () => {
  const navigate = useNavigate();
  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-[#003d3d] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 relative">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              {/* Logo Icon matching the Dashboard style */}
              <div className="bg-linear-to-r from-teal-500 to-pink-500 p-2 rounded-full">
                <Heart className="h-6 w-6 text-white" />
              </div>
              {/* careconnect branding style */}
              <div className="text-2xl font-bold tracking-tight">
                <span className="text-[#00a18e]">Care</span>
                <span className="text-[#f43f8e]">Connect</span>
              </div>
            </div>
            <p className="text-teal-100/70 leading-relaxed text-sm font-medium">
              Providing modern healthcare solutions. Your trusted partner for physical and 
              **virtual medical care** in Kenya.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="h-10 w-10 rounded-xl bg-teal-800/30 flex items-center justify-center hover:bg-[#f43f8e] transition-all group">
                  <Icon className="h-5 w-5 text-teal-200 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:ml-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-[#f43f8e]">Navigation</h3>
            <ul className="space-y-4">
              {['Home', 'About Us', 'Services', 'Our Doctors', 'Dashboard'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-teal-100/60 hover:text-white text-sm font-bold transition-all flex items-center gap-2 group">
                    <div className="w-1 h-1 rounded-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-all" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Medical Services */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-[#f43f8e]">Specialties</h3>
            <ul className="space-y-4">
              {['Cardiology', 'Neurology', 'Pediatrics', 'Video Consultations', 'Laboratory'].map((service) => (
                <li key={service}>
                  <a href="#" className="text-teal-100/60 hover:text-white text-sm font-bold transition-all flex items-center gap-2 group">
                    {service === 'Video Consultations' && <Video className="h-3 w-3 text-pink-400" />}
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Styled like a card to match Dashboard stats */}
          <div className="bg-teal-800/20 p-6 rounded-2xl border border-teal-700/50">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-white">Contact Center</h3>
            <div className="space-y-5">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-[#f43f8e] shrink-0" />
                <div>
                  <div className="text-white font-bold text-xs uppercase">Emergency</div>
                  <div className="text-teal-100 text-xs">+254 700 000 911</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-[#f43f8e] shrink-0" />
                <div>
                  <div className="text-white font-bold text-xs uppercase">Email Support</div>
                  <div className="text-teal-100 text-xs">info@careconnect.co.ke</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#f43f8e] shrink-0" />
                <div>
                  <div className="text-white font-bold text-xs uppercase">Location</div>
                  <div className="text-teal-100 text-xs">Nairobi, Kenya</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - Matches Dashboard Card style */}
        <div className="mt-16 bg-white rounded-3xl p-1 shadow-2xl overflow-hidden">
          <div className="bg-linear-to-r from-teal-50 to-white px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-[#003d3d] tracking-tight">Need Medical Attention?</h3>
              <p className="text-gray-500 font-medium mt-1">Available for physical and virtual consultations 24/7.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigateTo('/appointments')}
                className="bg-[#f43f8e] text-white px-8 py-4 rounded-xl hover:scale-105 transition-all font-bold shadow-lg shadow-pink-200 flex items-center justify-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                Book Now
              </button>
              <button className="bg-[#003d3d] text-white px-8 py-4 rounded-xl hover:scale-105 transition-all font-bold flex items-center justify-center gap-2">
                <Video className="h-5 w-5 text-pink-400" />
                Virtual Visit
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-teal-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-teal-200/40 text-[10px] font-bold uppercase tracking-[0.3em]">
              © 2026 CARECONNECT HOSPITAL • QUALITY HEALTHCARE
            </div>
            <div className="flex space-x-8">
              {['Privacy', 'Terms', 'Disclaimer'].map((item) => (
                <a key={item} href="#" className="text-teal-200/40 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;