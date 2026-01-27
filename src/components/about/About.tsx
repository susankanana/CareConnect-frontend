import {
  Heart,
  Shield,
  Target,
  Eye,
  Stethoscope,
  Clock,
  Phone,
  Calendar,
  TrendingUp,
  Globe,
  Zap,
  Award,
  ChevronRight,
} from 'lucide-react';
import { stats } from './data/stats';
import { values } from './data/values';
import { leadership } from './data/leadership';
import { milestones } from './data/milestones';
import { achievements } from './data/achievements';

const About = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-32">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-teal-50 px-4 py-2 rounded-full mb-8 border border-teal-100">
              <Heart className="h-4 w-4 text-[#00a18e]" />
              <span className="text-[#00a18e] text-xs font-black uppercase tracking-[0.2em]">Our Legacy</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-[#003d3d] tracking-tight mb-8">
              About{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00a18e] to-[#f43f8e]">
                CareConnect
              </span>
            </h1>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium">
              For over 15 years, we have been Kenya's leading healthcare provider, dedicated
              to delivering exceptional medical care with compassion and innovation.
            </p>
          </div>

          {/* Stats Grid - Styled as floating cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="bg-teal-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <stat.icon className="h-6 w-6 text-[#00a18e]" />
                </div>
                <div className="text-3xl font-black text-[#003d3d] mb-1">{stat.number}</div>
                <div className="text-sm font-bold text-[#f43f8e] uppercase tracking-widest mb-2">{stat.label}</div>
                <p className="text-gray-400 text-xs leading-relaxed font-medium">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision - High contrast split */}
      <section className="py-24 bg-[#003d3d] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-teal-900/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="group">
              <div className="flex items-center mb-8">
                <div className="bg-[#f43f8e] p-4 rounded-2xl shadow-lg shadow-pink-900/20 mr-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Our Mission</h2>
              </div>
              <p className="text-teal-50/70 leading-relaxed text-lg font-medium">
                To provide exceptional, compassionate healthcare services that improve the quality
                of life for our patients and communities. We deliver personalized care through 
                innovation and excellence.
              </p>
            </div>

            <div className="group">
              <div className="flex items-center mb-8">
                <div className="bg-[#00a18e] p-4 rounded-2xl shadow-lg shadow-teal-900/20 mr-6">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Our Vision</h2>
              </div>
              <p className="text-teal-50/70 leading-relaxed text-lg font-medium">
                To be East Africa's most trusted and innovative healthcare institution, setting
                the standard for medical excellence, patient safety, and community health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story - Editorial Layout */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
              <img
                src="https://images.pexels.com/photos/5452203/pexels-photo-5452203.jpeg"
                alt="CareConnect medical team"
                className="w-full h-125 object-cover rounded-[40px] shadow-2xl relative z-10 border-8 border-white"
              />
              <div className="absolute -bottom-10 -right-6 bg-white p-8 rounded-3xl shadow-xl z-20 border border-gray-50 max-w-70">
                <div className="flex items-center space-x-4">
                  <div className="bg-teal-500 p-3 rounded-2xl">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-black text-[#003d3d] text-lg">15+ Years</div>
                    <div className="text-sm text-gray-400 font-bold uppercase tracking-tighter">Clinical Excellence</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-[#003d3d] tracking-tight">Our Story</h2>
              <div className="space-y-6 text-gray-500 font-medium leading-loose text-lg">
                <p>
                  CareConnect was founded in 2009 by a group of passionate medical professionals who
                  shared a common vision: to transform healthcare delivery in Kenya.
                </p>
                <p>
                  Our journey has been marked by continuous innovation. From 
                  introducing electronic health records to pioneering telemedicine, we have 
                  consistently stayed at the forefront.
                </p>
                <p className="bg-teal-50 p-6 rounded-2xl border-l-4 border-[#00a18e] text-[#003d3d]">
                  Today, we serve over 50,000 patients annually across multiple specialties,
                  supported by a team of 200+ medical professionals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values - Modern Grid */}
      <section className="py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-[#003d3d] mb-4 tracking-tight">Our Core Values</h2>
            <div className="w-20 h-1 bg-linear-to-r from-[#00a18e] to-[#f43f8e] mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-10 rounded-4xl border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#00a18e] transition-colors">
                  <value.icon className="h-8 w-8 text-[#00a18e] group-hover:text-white" />
                </div>
                <h3 className="text-xl font-black text-[#003d3d] mb-4">{value.title}</h3>
                <p className="text-gray-400 font-medium text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team - Profile Cards */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <h2 className="text-4xl font-black text-[#003d3d] tracking-tight mb-4">Leadership Team</h2>
              <p className="text-xl text-gray-400 font-medium">Meet the experts behind our clinical success.</p>
            </div>
            <button className="flex items-center gap-2 text-[#00a18e] font-black uppercase tracking-widest text-sm hover:gap-4 transition-all">
              View All Doctors <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {leadership.map((leader, index) => (
              <div key={index} className="group relative">
                <div className="relative h-100 overflow-hidden rounded-[40px] mb-6">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#003d3d]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-2xl font-black text-[#003d3d] mb-1">{leader.name}</h3>
                <p className="text-[#f43f8e] font-bold text-sm uppercase tracking-widest mb-4">{leader.role}</p>
                <p className="text-gray-500 font-medium leading-relaxed">{leader.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline - Simplified & Modern */}
      <section className="py-32 bg-gray-50/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-black text-[#003d3d] tracking-tight">Our Journey</h2>
          </div>

          <div className="space-y-16 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block"></div>
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="flex-1 w-full md:w-1/2 px-8 mb-8 md:mb-0">
                  <div className={`bg-white p-10 rounded-4xl shadow-sm border border-gray-100 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#00a18e] to-[#f43f8e] mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-black text-[#003d3d] mb-4">{milestone.title}</h3>
                    <p className="text-gray-400 font-medium text-sm leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
                <div className="relative z-10 w-12 h-12 bg-white rounded-full border-4 border-[#00a18e] flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 bg-[#f43f8e] rounded-full"></div>
                </div>
                <div className="flex-1 hidden md:block w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition - Dark Mode Section */}
      <section className="py-24 bg-linear-to-br from-[#003d3d] to-[#002a2a] overflow-hidden relative">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#00a18e]/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-white mb-4">Awards & Recognition</h2>
            <p className="text-teal-100/60 font-medium">Standard of excellence recognized globally.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-center hover:bg-white/10 transition-all"
              >
                <div className="flex justify-center mb-6">
                  <Award className="h-10 w-10 text-[#f43f8e]" />
                </div>
                <h3 className="text-white font-bold mb-2">{achievement.title}</h3>
                <p className="text-teal-100/40 text-xs font-medium uppercase tracking-widest">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Functional Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-[#003d3d] tracking-tight">Why Choose Us?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Stethoscope, title: 'Expert Medical Team', desc: '200+ specialists with international training and certifications.' },
              { icon: Clock, title: '24/7 Emergency Care', desc: 'Round-the-clock services with a dedicated rapid response team.' },
              { icon: Zap, title: 'Advanced Technology', desc: 'State-of-the-art diagnostics and AI-powered treatment planning.' },
              { icon: Shield, title: 'Patient Safety', desc: 'JCI accredited with the highest global safety and quality standards.' },
              { icon: Heart, title: 'Compassionate Care', desc: 'A patient-centered approach with personalized treatment plans.' },
              { icon: Globe, title: 'International Standards', desc: 'ISO certified management systems for consistent care quality.' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col p-10 bg-gray-50 rounded-[40px] hover:bg-white hover:shadow-xl transition-all group">
                <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#f43f8e] transition-colors">
                  <item.icon className="h-6 w-6 text-[#00a18e] group-hover:text-white" />
                </div>
                <h3 className="text-lg font-black text-[#003d3d] mb-4">{item.title}</h3>
                <p className="text-gray-400 font-medium text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-32 px-4">
        <div className="max-w-5xl mx-auto bg-linear-to-r from-[#00a18e] to-[#003d3d] rounded-[50px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight">
            Ready to Experience <br /> Exceptional Healthcare?
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-[#f43f8e] text-white px-10 py-5 rounded-2xl font-black hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3">
              <Calendar className="h-6 w-6" />
              Book Appointment
            </button>
            <button className="bg-white text-[#003d3d] px-10 py-5 rounded-2xl font-black hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-xl">
              <Phone className="h-6 w-6" />
              +254 700 123 456
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;