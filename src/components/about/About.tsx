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
} from 'lucide-react';
import { stats } from './data/stats';
import { values } from './data/values';
import { leadership } from './data/leadership';
import { milestones } from './data/milestones';
import { achievements } from './data/achievements';
const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-teal-500 to-pink-500 p-3 rounded-full">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                About{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-pink-600">
                  CareConnect
                </span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              For over 15 years, CareConnect has been Kenya's leading healthcare provider, dedicated
              to delivering exceptional medical care with compassion, innovation, and unwavering
              commitment to patient wellbeing.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-teal-100 to-pink-100 p-4 rounded-full">
                    <stat.icon className="h-8 w-8 text-teal-600" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-xl font-semibold text-teal-600 mb-2">{stat.label}</div>
                <div className="text-gray-600 text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gradient-to-r from-teal-50 to-pink-50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-teal-500 to-pink-500 p-3 rounded-full mr-4">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To provide exceptional, compassionate healthcare services that improve the quality
                  of life for our patients and communities. We are committed to delivering
                  personalized care through innovation, excellence, and a patient-centered approach
                  that treats every individual with dignity and respect.
                </p>
              </div>
            </div>

            <div>
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-gray-600 p-3 rounded-full mr-4">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To be East Africa's most trusted and innovative healthcare institution, setting
                  the standard for medical excellence, patient safety, and community health. We
                  envision a future where quality healthcare is accessible to all, powered by
                  cutting-edge technology and delivered with unwavering compassion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  CareConnect was founded in 2009 by a group of passionate medical professionals who
                  shared a common vision: to transform healthcare delivery in Kenya. What started as
                  a small clinic in Nairobi has grown into one of East Africa's most respected
                  healthcare institutions.
                </p>
                <p>
                  Our journey has been marked by continuous innovation and expansion. From
                  introducing the first electronic health records system in Kenya to pioneering
                  telemedicine services, we have consistently been at the forefront of healthcare
                  technology adoption.
                </p>
                <p>
                  Today, we serve over 50,000 patients annually across multiple specialties,
                  supported by a team of 200+ medical professionals. Our commitment to excellence
                  has earned us numerous accolades and, more importantly, the trust of the
                  communities we serve.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/5452203/pexels-photo-5452203.jpeg"
                alt="CareConnect medical team"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Growing Impact</div>
                    <div className="text-sm text-gray-600">15 Years of Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These fundamental principles guide every decision we make and every interaction we
              have
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl hover:shadow-lg transition-shadow bg-gray-50"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-teal-100 to-pink-100 p-4 rounded-full">
                    <value.icon className="h-8 w-8 text-teal-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the experienced medical professionals leading CareConnect's mission
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-64 object-cover object-top"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{leader.name}</h3>
                  <p className="text-teal-600 font-semibold mb-2">{leader.role}</p>
                  <p className="text-gray-600 text-sm mb-3">
                    {leader.specialization} • {leader.experience}
                  </p>
                  <p className="text-gray-700 leading-relaxed">{leader.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones that have shaped CareConnect into what it is today
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-teal-200 to-pink-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}
                  >
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-pink-600 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-gradient-to-r from-teal-500 to-pink-500 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Awards & Recognition</h2>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              Our commitment to excellence has been recognized by leading healthcare organizations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all"
              >
                <div className="flex justify-center mb-4">
                  <achievement.icon className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{achievement.title}</h3>
                <p className="text-teal-100 text-sm">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CareConnect?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We go above and beyond to ensure your healthcare experience exceeds expectations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg">
              <div className="bg-gradient-to-r from-teal-500 to-pink-500 p-2 rounded-full flex-shrink-0">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Expert Medical Team</h3>
                <p className="text-gray-600">
                  200+ specialists with international training and certifications
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg">
              <div className="bg-gradient-to-r from-teal-500 to-pink-500 p-2 rounded-full flex-shrink-0">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">24/7 Emergency Care</h3>
                <p className="text-gray-600">
                  Round-the-clock emergency services with rapid response team
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg">
              <div className="bg-gradient-to-r from-teal-500 to-pink-500 p-2 rounded-full flex-shrink-0">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Advanced Technology</h3>
                <p className="text-gray-600">
                  State-of-the-art medical equipment and AI-powered diagnostics
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg">
              <div className="bg-gradient-to-r from-teal-500 to-pink-500 p-2 rounded-full flex-shrink-0">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Patient Safety</h3>
                <p className="text-gray-600">
                  JCI accredited with highest safety and quality standards
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg">
              <div className="bg-gradient-to-r from-teal-500 to-pink-500 p-2 rounded-full flex-shrink-0">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Compassionate Care</h3>
                <p className="text-gray-600">
                  Patient-centered approach with personalized treatment plans
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg">
              <div className="bg-gradient-to-r from-teal-500 to-pink-500 p-2 rounded-full flex-shrink-0">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">International Standards</h3>
                <p className="text-gray-600">
                  ISO certified with international quality management systems
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Experience Exceptional Healthcare?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of patients who trust CareConnect for their healthcare needs. Schedule
            your appointment today and experience the difference.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-teal-500 to-pink-500 text-white px-8 py-4 rounded-lg hover:from-teal-600 hover:to-pink-600 transition-all font-semibold text-lg flex items-center justify-center gap-2">
              <Calendar className="h-5 w-5" />
              Book Appointment
            </button>
            <button className="border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-lg hover:bg-teal-50 transition-colors font-semibold text-lg flex items-center justify-center gap-2">
              <Phone className="h-5 w-5" />
              Call Us: +254 700 123 456
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
