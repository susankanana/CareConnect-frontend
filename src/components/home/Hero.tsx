import {
  Heart,
  Calendar,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Phone,
  MapPin,
  Mail,
  Award,
  Users,
  CheckCircle
} from 'lucide-react';

import { useGetAllServicesQuery, type TService } from '../../../src/reducers/services/servicesAPI';
import { testimonials } from './data/testimonials';
import { useGetDoctorsQuery, type TDoctor } from '../../../src/reducers/doctors/doctorsAPI';
import { useNavigate, useLocation } from 'react-router'; 
import { useEffect } from 'react';


const Hero = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch doctors data using the Redux Toolkit Query hook
  const { data: doctorsData, isLoading: doctorsLoading, error: doctorsError } = useGetDoctorsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: 60000,
    }
  );

  // Fetch services data using the Redux Toolkit Query hook
  const { data: servicesData, isLoading: servicesLoading, error: servicesError } = useGetAllServicesQuery(undefined, {
  refetchOnMountOrArgChange: true,
  pollingInterval: 60000,
});

  const navigateTo = (path: string) => {
    navigate(path);
  };

  // code for scrolling
  useEffect(() => {
    // Check if there's a hash in the URL (e.g., #services, #doctors)
    if (location.hash) {
      const id = location.hash.substring(1); // Remove the '#' from the hash
      const element = document.getElementById(id); // Find the element by its ID

      if (element) {
        // Scroll to the element smoothly
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section (rest of the hero section remains unchanged) */}
      <section className="relative bg-gradient-to-br from-teal-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left content */}
            <div className="lg:w-1/2 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600 font-medium">5.0 Rating • 50,000+ Patients Served</span>
                </div>

                <h1 data-test="careconnect-welcome-header" className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Your Health is Our
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-pink-600 block">
                    Priority
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Experience world-class healthcare with CareConnect. Our team of expert doctors
                  and state-of-the-art facilities ensure you receive the best medical care in Kenya.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigateTo('/appointments')} className="bg-gradient-to-r from-teal-500 to-pink-500 text-white px-8 py-4 rounded-lg hover:from-teal-600 hover:to-pink-600 transition-all font-semibold text-lg flex items-center justify-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </button>
                <button className="border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-lg hover:bg-teal-50 transition-colors font-semibold text-lg">
                  Emergency: +254 700 000 911
                </button>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Shield className="h-8 w-8 text-teal-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Secure</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Clock className="h-8 w-8 text-teal-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">Available</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Award className="h-8 w-8 text-teal-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">200+</div>
                  <div className="text-sm text-gray-600">Specialists</div>
                </div>
              </div>
            </div>

            {/* Right content - Image */}
            <div className="lg:w-1/2">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/18252410/pexels-photo-18252410.jpeg"
                  alt="Medical professionals at CareConnect"
                  className="w-full h-96 lg:h-[500px] object-cover object-top rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Heart className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Expert Care</div>
                      <div className="text-sm text-gray-600">15+ Years Experience</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      ---

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Medical Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare services delivered by our team of experienced
              medical professionals using the latest technology and treatment methods.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesLoading && <p className="text-center text-gray-700">Loading services...</p>}
            {servicesError && <p className="text-center text-red-500">Error loading services.</p>}

            {servicesData && servicesData.length > 0 && (servicesData.map((service: TService, index: number) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 border border-gray-100">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-100 to-pink-100 rounded-full mb-4">
                    <Heart className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>

                <div className="space-y-3 mb-6">
                  {service.features.map((feature: string, featureIndex: number) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate(`/services/${service.title}`)}
                  className="w-full bg-gradient-to-r from-teal-500 to-pink-500 text-white py-3 px-6 rounded-lg hover:from-teal-600 hover:to-pink-600 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))
            )}


          </div>
        </div>
      </section>

      ---

      {/* Doctors Section */}
      <section id="doctors" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Doctors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team of highly qualified medical professionals is dedicated to
              providing you with the best possible healthcare experience.
            </p>
          </div>

          {/* Conditional rendering based on fetching status */}
          {doctorsLoading && <p className="text-center text-gray-700">Loading doctors...</p>}
          {doctorsError && <p className="text-center text-red-500">Error fetching doctors. Please try again later.</p>}

          {/* Render doctors only if data is available and not loading/errored */}
          {doctorsData && doctorsData.data && doctorsData.data.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {doctorsData.data.map((doctor: TDoctor) => (
                <div key={doctor.doctor?.doctorId} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <img
                    src={doctor.user?.image_url || 'https://via.placeholder.com/400'} // Use image_url from user or a placeholder
                    alt={`${doctor.user?.firstName} ${doctor.user?.lastName}`}
                    className="w-full h-64 object-cover object-top"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {doctor.user?.firstName} {doctor.user?.lastName}
                    </h3>
                    <p className="text-teal-600 font-semibold mb-2">{doctor.doctor?.specialization}</p>

                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{doctor.doctor?.rating || 'N/A'}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {doctor.doctor?.experience != null ? `${doctor.doctor.experience} years experience` : 'N/A'}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      <Users className="h-4 w-4 inline mr-1" />
                      {doctor.doctor?.patients || 'N/A'} patients treated
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Only show "No doctors found." if not loading and no error, and data is empty
            !doctorsLoading && !doctorsError && <p className="text-center text-gray-700">No doctors found.</p>
          )}
        </div>
      </section>

      {/* Testimonials Section (remains unchanged) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real patients who have experienced our exceptional healthcare services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.condition}</p>
                  </div>
                </div>

                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section (remains unchanged) */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-teal-100">Patients Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-teal-100">Medical Specialists</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-teal-100">Years of Excellence</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-teal-100">Emergency Care</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section (remains unchanged) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to experience exceptional healthcare? Contact us today to schedule
              your appointment or learn more about our services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="bg-gradient-to-r from-teal-100 to-pink-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Phone className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-2">Emergency: +254 700 000 911</p>
              <p className="text-gray-600">General: +254 700 123 456</p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="bg-gradient-to-r from-teal-100 to-pink-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-2">123 Healthcare Avenue</p>
              <p className="text-gray-600">Nairobi, Kenya</p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="bg-gradient-to-r from-teal-100 to-pink-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Mail className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-2">info@careconnect.co.ke</p>
              <p className="text-gray-600">support@careconnect.co.ke</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button onClick={() => navigateTo('/appointments')} className="bg-gradient-to-r from-teal-500 to-pink-500 text-white px-8 py-4 rounded-lg hover:from-teal-600 hover:to-pink-600 transition-all font-semibold text-lg flex items-center justify-center gap-2 mx-auto">
              <Calendar className="h-5 w-5" />
              Book Your Appointment Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;