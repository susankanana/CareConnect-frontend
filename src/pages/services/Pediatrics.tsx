import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { useGetServiceByTitleQuery } from '../../../src/reducers/services/servicesAPI';
import {
  CheckCircle,
  Baby,
  Stethoscope,
  ShieldCheck,
  ArrowLeft,
  Heart,
  Award,
} from 'lucide-react';
import { slugToTitleMap } from './slug';

const Pediatrics = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const slug = decodeURIComponent(location.pathname.split('/service/')[1]);
  const title = slugToTitleMap[slug];

  const {
    data: service,
    isLoading,
    isError,
  } = useGetServiceByTitleQuery(title, {
    skip: !title,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigateAndScroll = (sectionId: string) => {
    if (window.location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const exhaustivePediatricsContent = {
    sections: [
      {
        title: 'The Scope of Pediatrics',
        icon: <Baby size={24} />,
        paragraphs: [
          'Pediatrics is dedicated to the medical care of infants, children, and adolescents. Our focus is on the overall growth, development, and well-being of young people, understanding that children require specialized, age-appropriate care.',
        ],
        features: [
          '**Well-Child Visits:** Regular check-ups to monitor growth and development.',
          '**Immunizations:** Administering vaccines to protect against infectious diseases.',
          '**Acute Illnesses:** Treating common childhood infections and viral issues.',
          '**Chronic Conditions:** Managing asthma, allergies, and developmental disorders.',
        ],
      },
      {
        title: 'Diagnostic Tools',
        icon: <Stethoscope size={24} />,
        paragraphs: [
          'We use child-friendly diagnostic methods to ensure accurate assessment while minimizing discomfort for our young patients:',
        ],
        features: [
          '**Growth Charts:** Monitoring physical milestones against global norms.',
          '**Developmental Screenings:** Assessing motor, language, and social skills.',
          '**Imaging Studies:** Child-friendly X-rays and ultrasounds.',
          '**Hearing & Vision:** Early detection of impairments affecting learning.',
        ],
      },
    ],
  };

  if (!title || isError || (!isLoading && !service)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-black text-[#003d3d] uppercase italic">Service Not Found</h2>
          <div
            onClick={() => navigateAndScroll('services')}
            className="inline-flex items-center gap-2 text-[#00a18e] text-[10px] font-black uppercase tracking-widest mt-4 hover:text-pink-500 transition-colors cursor-pointer group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to all services
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#003d3d]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00a18e] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-black uppercase tracking-widest text-xs">Loading Specialist Data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      {/* --- PREMIUM HERO SECTION --- */}
      <div className="bg-[#003d3d] pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00a18e] rounded-full blur-[150px] opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div
            onClick={() => navigateAndScroll('services')}
            className="inline-flex items-center gap-2 text-[#00a18e] text-[10px] font-black uppercase tracking-widest mb-8 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to all services
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4">
                {service.title}<span className="text-[#00a18e]">.</span>
              </h1>
              <p className="text-teal-100/60 text-lg font-medium leading-relaxed">
                {service.description}
              </p>
            </div>
            <div className="hidden lg:block bg-white/5 p-8 rounded-[40px] border border-white/10 backdrop-blur-sm">
              <Baby size={64} className="text-[#00a18e] animate-bounce-slow" />
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 pb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Dynamic Features Grid */}
            {service.features && (
              <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100">
                <h2 className="text-2xl font-black text-[#003d3d] uppercase tracking-tight mb-8 flex items-center gap-3">
                  <div className="bg-teal-50 p-2 rounded-xl text-[#00a18e]"><Award size={20}/></div>
                  Care Highlights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl border border-gray-100 hover:border-[#00a18e]/30 transition-all group">
                      <CheckCircle className="text-[#00a18e] group-hover:scale-110 transition-transform" size={20} />
                      <span className="font-bold text-[#003d3d] text-sm uppercase">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exhaustive Content Sections */}
            {exhaustivePediatricsContent.sections.map((section, idx) => (
              <div key={idx} className="bg-white rounded-[40px] shadow-xl p-8 md:p-12 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#003d3d] text-white p-3 rounded-2xl shadow-lg shadow-teal-900/20">
                    {section.icon}
                  </div>
                  <h3 className="text-2xl font-black text-[#003d3d] uppercase tracking-tight">{section.title}</h3>
                </div>
                
                {section.paragraphs.map((p, pi) => (
                  <p key={pi} className="text-gray-600 text-lg leading-relaxed mb-8">{p}</p>
                ))}

                <div className="space-y-4">
                  {section.features.map((feature, fi) => (
                    <div key={fi} className="flex gap-4 items-start p-4 rounded-2xl bg-teal-50/30 border-l-4 border-[#00a18e]">
                      <span className="text-sm text-gray-700 leading-relaxed" 
                        dangerouslySetInnerHTML={{ __html: feature.replace(/\*\*(.*?)\*\*/g, '<b class="text-[#003d3d] font-black uppercase text-[12px]">$1</b>') }} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-[#f43f8e] rounded-[40px] p-10 text-white shadow-2xl shadow-pink-200 sticky top-24">
              <Heart className="mb-6 opacity-50" size={40} />
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Book a Consultation</h3>
              <p className="text-pink-100 font-medium mb-8">
                Trust your child's health to the experts. Schedule a pediatric visit today.
              </p>
              <Link to="/appointments" className="block w-full bg-white text-[#f43f8e] text-center py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-pink-50 transition-colors shadow-lg">
                Book Now
              </Link>
            </div>

            <div className="bg-[#003d3d] rounded-[40px] p-10 text-white overflow-hidden relative">
              <ShieldCheck className="absolute -bottom-4 -right-4 text-white/5 w-32 h-32" />
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#00a18e] mb-2">Emergency</h4>
              <p className="text-xl font-bold italic mb-0">24/7 Pediatric Support</p>
              <p className="text-3xl font-black mt-2">+254 700 000 000</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Pediatrics;