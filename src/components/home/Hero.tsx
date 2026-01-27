import {
  Heart,
  Calendar,
  Shield,
  Clock,
  Star,
  ArrowRight,
  MapPin,
  Award,
  Users,
  CheckCircle,
  Video,
} from 'lucide-react';

import { useGetAllServicesQuery, type TService } from '../../../src/reducers/services/servicesAPI';
import { useGetDoctorsQuery, type TDoctor } from '../../../src/reducers/doctors/doctorsAPI';
import { useNavigate, useLocation } from 'react-router';
import { useEffect } from 'react';

const Hero = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: doctorsData, isLoading: doctorsLoading, error: doctorsError } = useGetDoctorsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const { data: servicesData, isLoading: servicesLoading, error: servicesError } = useGetAllServicesQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const navigateTo = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-8 pb-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-teal-50 px-4 py-2 rounded-full border border-teal-100">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-[#00a18e] text-[10px] font-black uppercase tracking-[0.1em]">
                    5.0 Rating • 50,000+ Patients
                  </span>
                </div>

                <h1
                  data-test="careconnect-welcome-header"
                  className="text-5xl lg:text-7xl font-black text-[#003d3d] leading-[1.1] tracking-tight"
                >
                  Your Health is Our
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a18e] to-[#f43f8e] block">
                    Priority
                  </span>
                </h1>

                <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
                  Experience world-class healthcare with CareConnect. From <strong className="text-gray-900 font-black">Virtual Video Consultations</strong> to 
                  in-person specialist visits.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <button
                  onClick={() => navigateTo('/appointments')}
                  className="bg-gradient-to-r from-[#00a18e] to-[#f43f8e] text-white px-10 py-5 rounded-2xl hover:scale-105 transition-all font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-pink-200"
                >
                  <Calendar className="h-6 w-6" />
                  Book Appointment
                </button>
                <button className="bg-white border-2 border-[#00a18e] text-[#00a18e] px-10 py-5 rounded-2xl hover:bg-teal-50 transition-all font-black text-lg flex items-center justify-center gap-3">
                  <Video className="h-6 w-6" />
                  Video Consult
                </button>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-4 gap-4 pt-10 border-t border-gray-100">
                {[
                  { icon: Shield, val: '100%', label: 'Secure', color: 'text-teal-600' },
                  { icon: Video, val: 'Virtual', label: 'Consults', color: 'text-pink-600' },
                  { icon: Clock, val: '24/7', label: 'Available', color: 'text-teal-600' },
                  { icon: Award, val: '200+', label: 'Doctors', color: 'text-teal-600' },
                ].map((item, idx) => (
                  <div key={idx} className={`text-center ${idx !== 3 ? 'border-r border-gray-100' : ''}`}>
                    <div className="flex justify-center mb-2">
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div className="text-lg font-black text-[#003d3d]">{item.val}</div>
                    <div className="text-[9px] uppercase font-black tracking-widest text-gray-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right content - Image */}
            <div className="lg:w-1/2 relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-teal-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/18252410/pexels-photo-18252410.jpeg"
                  alt="Medical professionals"
                  className="w-full h-[550px] object-cover object-top rounded-[40px] shadow-2xl border-8 border-white relative z-10"
                />
                <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-md p-5 rounded-[24px] shadow-2xl border border-pink-100 flex items-center gap-4 animate-bounce z-20">
                    <div className="bg-[#f43f8e] p-2.5 rounded-xl">
                        <Video className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs font-black text-[#003d3d]">Telemedicine <br/><span className="text-[#f43f8e] uppercase tracking-tighter">Now Active</span></p>
                </div>
                
                <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-[32px] shadow-2xl z-20 border border-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="bg-teal-500 p-3.5 rounded-2xl">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-black text-[#003d3d] text-xl">Expert Care</div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-tight">15+ Years Experience</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-[#003d3d] tracking-tight mb-4">Our Medical Services</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-[#00a18e] to-[#f43f8e] mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {servicesData?.map((service: TService, index: number) => (
              <div key={index} className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                {service.title.toLowerCase().includes('consultation') && (
                    <div className="absolute top-0 right-0 bg-[#f43f8e] text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-[0.1em]">
                        Video Available
                    </div>
                )}
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-50 rounded-[20px] mb-6 group-hover:bg-[#00a18e] transition-colors">
                    <Heart className="h-8 w-8 text-[#00a18e] group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-[#003d3d] mb-4">{service.title}</h3>
                  <p className="text-gray-400 font-medium leading-relaxed mb-8">{service.description}</p>
                </div>

                <div className="space-y-4 mb-10">
                  {service.features.map((feature: string, fIndex: number) => (
                    <div key={fIndex} className="flex items-center space-x-3">
                      <div className="bg-green-50 p-1 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="text-gray-600 font-bold text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate(`/service/${service.title.toLowerCase().replace(/\s+/g, '')}`)}
                  className="w-full bg-gray-50 text-[#003d3d] py-4 rounded-2xl font-black flex items-center justify-center gap-2 group-hover:bg-[#003d3d] group-hover:text-white transition-all"
                >
                  Learn More <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-[#003d3d] tracking-tight mb-4">Meet Our Expert Doctors</h2>
            <p className="text-xl text-gray-400 font-medium">Ready for in-person visits or secure video consultations.</p>
          </div>

          {doctorsData?.data && (
            <div className="grid md:grid-cols-3 gap-10">
              {doctorsData.data.map((doctor: TDoctor) => (
                <div key={doctor.doctor?.doctorId} className="group cursor-pointer">
                  <div className="relative h-[450px] overflow-hidden rounded-[40px] mb-6">
                    <img
                      src={doctor.user?.image_url || 'https://via.placeholder.com/400'}
                      alt="Doctor"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                    />
                    <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                        <span className="bg-white/95 backdrop-blur-md text-[10px] font-black uppercase tracking-tighter px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                            <Video className="h-3.5 w-3.5 text-[#f43f8e]" /> Video Call
                        </span>
                        <span className="bg-white/95 backdrop-blur-md text-[10px] font-black uppercase tracking-tighter px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-[#00a18e]" /> In-Clinic
                        </span>
                    </div>
                  </div>
                  <div className="px-2">
                    <h3 className="text-2xl font-black text-[#003d3d] mb-1 group-hover:text-[#00a18e] transition-colors">
                        {doctor.user?.firstName} {doctor.user?.lastName}
                    </h3>
                    <p className="text-[#f43f8e] font-black text-sm uppercase tracking-widest mb-4">{doctor.doctor?.specialization}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-400 font-bold">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-[#003d3d]">{doctor.doctor?.rating || 'N/A'}</span>
                      </div>
                      <div className="border-l border-gray-100 pl-6">{doctor.doctor?.experience} Yrs Exp</div>
                      <div className="flex items-center gap-1.5 border-l border-gray-100 pl-6">
                        <Users className="h-4 w-4" /> {doctor.doctor?.patients}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Hero;