// import { useEffect } from 'react';
// import { useLocation } from 'react-router';
// import { useGetServiceByTitleQuery } from '../../../src/reducers/services/servicesAPI';
// import { CheckCircle } from 'lucide-react';
// import { slugToTitleMap } from './slug';

// const Ophthalmology = () => {
//   const location = useLocation();

//   // Extract the slug from the URL (e.g., "emergencycare")
//   const slug = decodeURIComponent(location.pathname.split('/service/')[1]);

//   // Convert slug to the proper title (e.g., "Emergency Care")
//   const title = slugToTitleMap[slug];

//   const { data: service, isLoading, isError } = useGetServiceByTitleQuery(title, {
//     skip: !title, //skip query if title is undefined
//     refetchOnMountOrArgChange: true,
//   });

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   if (!title) {
//     return <div className="text-center mt-10 text-red-500">Invalid service URL.</div>;
//   }

//   if (isLoading) {
//     return <div className="text-center mt-10 text-gray-600">Loading service...</div>;
//   }

//   if (isError || !service) {
//     return <div className="text-center mt-10 text-red-500">Service not found.</div>;
//   }

//   return (
//     <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold text-gray-900 mb-6">{service.title}</h1>
//         <p className="text-lg text-gray-700 mb-8">{service.description}</p>

//         <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
//         <ul className="space-y-3">
//           {service.features?.map((feature: string, index: number) => (
//             <li key={index} className="flex items-start gap-2 text-gray-800">
//               <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
//               {feature}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Ophthalmology;
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useGetServiceByTitleQuery } from '../../../src/reducers/services/servicesAPI';
import { CheckCircle, Eye, Award, Shield, ScanEye } from 'lucide-react';
import { slugToTitleMap } from './slug';

const Ophthalmology = () => {
  const location = useLocation();

  // Extract the slug from the URL (e.g., "ophthalmology")
  const slug = decodeURIComponent(location.pathname.split('/service/')[1]);

  // Convert slug to the proper title (e.g., "Ophthalmology")
  const title = slugToTitleMap[slug];

  // Fetch the service data based on the title
  const {
    data: service,
    isLoading,
    isError,
  } = useGetServiceByTitleQuery(title, {
    skip: !title, // Skip query if title is undefined
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Define static exhaustive content for Ophthalmology
  const exhaustiveOphthalmologyContent = {
    sections: [
      {
        title: 'The Scope of Ophthalmology',
        icon: <Eye className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          'Ophthalmology is the specialized branch of medicine that deals with the **anatomy, physiology, and diseases of the eye**. Ophthalmologists are highly trained medical doctors who provide comprehensive eye care, from prescribing corrective lenses to performing complex eye surgeries. Their expertise covers a wide spectrum of visual health needs.',
        ],
        features: [
          "**Cataracts:** A clouding of the eye's natural lens, leading to blurry vision. Ophthalmologists perform surgery to remove the clouded lens and replace it with an artificial one.",
          '**Glaucoma:** A group of diseases that damage the optic nerve, often due to high pressure inside the eye. Early detection and management are crucial to prevent vision loss.',
          '**Diabetic Retinopathy:** A complication of diabetes that affects the blood vessels in the retina, potentially leading to blindness if untreated.',
          '**Macular Degeneration:** A common cause of vision loss among older people, affecting the central part of the retina (macula), which is responsible for sharp, central vision.',
          '**Refractive Errors (Myopia, Hyperopia, Astigmatism):** Common vision problems that can be corrected with glasses, contact lenses, or refractive surgery like LASIK.',
          '**Strabismus (Crossed Eyes) & Amblyopia (Lazy Eye):** Conditions often diagnosed and treated in childhood to ensure proper visual development.',
          "**Dry Eye Syndrome:** A common condition where the eyes don't produce enough quality tears to lubricate them, causing discomfort and vision problems.",
          '**Conjunctivitis (Pink Eye) & Other Eye Infections:** Diagnosis and treatment of various infectious and inflammatory conditions affecting the eye.',
          '**Retinal Detachment:** A serious condition where the retina pulls away from the back of the eye, requiring urgent surgical repair to preserve vision.',
        ],
      },
      {
        title: 'Diagnostic Tools and Techniques',
        icon: <ScanEye className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          'Ophthalmologists use state-of-the-art diagnostic equipment to thoroughly examine the eyes and detect subtle changes, enabling early intervention:',
        ],
        features: [
          '**Slit-Lamp Examination:** A high-magnification microscope used to examine the front and back structures of the eye.',
          '**Ophthalmoscopy:** Direct visualization of the retina, optic nerve, and vitreous humor at the back of the eye.',
          '**Optical Coherence Tomography (OCT):** A non-invasive imaging test that uses light waves to take cross-section pictures of your retina, useful for glaucoma and macular degeneration.',
          '**Visual Field Testing:** Measures peripheral vision and helps detect blind spots, often used to monitor glaucoma or neurological conditions affecting vision.',
          '**Fundus Photography:** Captures detailed images of the retina and optic nerve for documentation and monitoring disease progression.',
          '**Tonometry:** Measures the pressure inside the eye, a key test for glaucoma screening.',
          '**Corneal Topography:** Maps the curvature of the cornea, essential for fitting contact lenses and planning refractive surgery.',
          '**Fluorescein Angiography:** A diagnostic procedure using a special dye and camera to visualize blood flow in the retina and choroid.',
        ],
      },
      {
        title: 'Treatment Modalities in Ophthalmology',
        icon: <Award className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          'Treatment approaches in ophthalmology are diverse, ranging from non-invasive methods to highly specialized surgical procedures, all aimed at preserving or restoring vision:',
        ],
        features: [
          '**Corrective Lenses:** Prescribing glasses and contact lenses for refractive errors.',
          '**Medications:** Including eye drops (for glaucoma, infections, dry eye) and oral medications to manage various eye conditions.',
          '**Laser Surgery:** Procedures like **LASIK** (for refractive errors), **Photocoagulation** (for diabetic retinopathy, retinal tears), and **Laser Iridotomy** (for glaucoma).',
          '**Cataract Surgery:** The most common eye surgery globally, involving removal of the clouded lens and implantation of an intraocular lens.',
          '**Glaucoma Surgery:** Procedures such as trabeculectomy, shunts, or minimally invasive glaucoma surgery (MIGS) to lower eye pressure.',
          '**Retinal Surgery:** Complex procedures to repair conditions like retinal detachment or macular holes.',
          '**Corneal Transplants:** Replacing damaged cornea with healthy donor tissue to restore vision.',
          '**Oculoplastic Surgery:** Addressing conditions affecting the eyelids, orbit (eye socket), and tear drainage system.',
        ],
      },
      {
        title: 'Prevention and Advancements',
        icon: <Shield className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          'Preventative eye care is paramount. Regular comprehensive eye exams are vital for early detection of diseases, many of which show no symptoms in their early stages. Maintaining a healthy lifestyle, protecting your eyes from UV radiation, and managing systemic conditions like diabetes and hypertension significantly contribute to long-term eye health.',
          'Ophthalmology is a field of rapid innovation. Breakthroughs in gene therapy for inherited retinal diseases, advanced surgical techniques for complex conditions, and new drug delivery systems are continually expanding the possibilities for vision preservation and restoration. The future of eye care holds immense promise for millions worldwide.',
        ],
      },
    ],
  };

  // --- Render Logic ---

  if (!title) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <p className="text-2xl text-red-600 font-semibold mb-4">Invalid Service URL</p>
          <p className="text-gray-700">
            The URL you're trying to access is not a recognized service. Please check and try again.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <span className="loading loading-spinner loading-lg text-teal-600"></span>
          <p className="text-xl text-gray-700 mt-4">Loading service details...</p>
        </div>
      </div>
    );
  }

  // Handle case where service is not found after loading
  if (isError || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <p className="text-2xl text-red-600 font-semibold mb-4">Service Not Found</p>
          <p className="text-gray-700">
            The service "{title}" could not be found. It might not exist or there was an issue
            fetching it.
          </p>
        </div>
      </div>
    );
  }

  // Assuming 'service' now contains the fetched Ophthalmology data
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* === Fetched Service Details Section (Hero/Header Card) === */}
        <div className="relative bg-gradient-to-br from-teal-500 to-pink-500 text-white p-8 md:p-12 lg:p-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
                {service.title}
              </h1>
              <p className="text-lg sm:text-xl opacity-90 max-w-3xl">{service.description}</p>
            </div>
            <div className="hidden md:block">
              <Eye className="w-24 h-24 opacity-20" />
            </div>
          </div>
          {service.features && service.features.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white border-opacity-30">
              <h2 className="text-2xl font-semibold text-white mb-4">Our Key Features</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-lg">
                {service.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-teal-200" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* === Exhaustive Static Content Sections === */}
        <div className="p-8 md:p-12 lg:p-16 space-y-12">
          {exhaustiveOphthalmologyContent.sections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 flex items-center gap-3 border-b border-gray-200">
                {section.icon}
                {section.title}
              </h2>
              {section.paragraphs &&
                section.paragraphs.map((paragraph, pIndex) => (
                  <p key={`p-${pIndex}`} className="text-lg text-gray-700 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}

              {section.features && section.features.length > 0 && (
                <ul className="space-y-4 text-lg mt-6">
                  {section.features.map((feature: string, featureIndex: number) => (
                    <li
                      key={`feature-${featureIndex}`}
                      className="flex items-start gap-3 text-gray-800 p-3 bg-gray-50 rounded-lg shadow-sm"
                    >
                      <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                      {/* Using dangerouslySetInnerHTML to render bold markdown within strings */}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: feature.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                        }}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Concluding Section for overall Ophthalmology */}
          <div className="text-center mt-16 bg-gradient-to-r from-teal-50 to-pink-50 p-8 rounded-2xl shadow-inner">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Preserving and Enhancing the Gift of Sight
            </h3>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Ophthalmology is a continually evolving field, critical for maintaining the health of
              our eyes and the precious gift of sight. Through ongoing research, advanced
              diagnostics, and innovative treatments, ophthalmologists strive to improve vision and
              quality of life for individuals of all ages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ophthalmology;
