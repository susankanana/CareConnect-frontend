// import { useEffect } from 'react';
// import { useLocation } from 'react-router';
// import { useGetServiceByTitleQuery } from '../../../src/reducers/services/servicesAPI';
// import { CheckCircle } from 'lucide-react';
// import { slugToTitleMap } from './slug';

// const Orthopedics = () => {
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

// export default Orthopedics;
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useGetServiceByTitleQuery } from '../../../src/reducers/services/servicesAPI';
import {
  CheckCircle,
  Bone, // Main icon for Orthopedics
  Award,
  Footprints,
  Scan, 
} from 'lucide-react';
import { slugToTitleMap } from './slug';

const Orthopedics = () => {
  const location = useLocation();

  // Extract the slug from the URL (e.g., "orthopedics")
  const slug = decodeURIComponent(location.pathname.split('/service/')[1]);

  // Convert slug to the proper title (e.g., "Orthopedics")
  const title = slugToTitleMap[slug];

  // Fetch the service data based on the title
  const { data: service, isLoading, isError } = useGetServiceByTitleQuery(title, {
    skip: !title, // Skip query if title is undefined
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Define static exhaustive content for Orthopedics
  const exhaustiveOrthopedicsContent = {
    sections: [
      {
        title: "The Scope of Orthopedics",
        icon: <Bone className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          "Orthopedics is the medical specialty focused on the **musculoskeletal system**, which includes bones, joints, ligaments, tendons, muscles, and nerves. Orthopedic surgeons (often simply called orthopedists) diagnose, treat, prevent, and rehabilitate injuries and diseases that affect this vital system, enabling patients to regain mobility and reduce pain. It's a field dedicated to restoring function and improving quality of life for individuals of all ages."
        ],
        features: [
          "**Fractures and Trauma:** Managing and treating broken bones, dislocations, and other acute injuries resulting from accidents or falls.",
          "**Arthritis:** Treating various forms of arthritis (e.g., osteoarthritis, rheumatoid arthritis) that cause joint pain, stiffness, and inflammation, often leading to joint replacement surgery.",
          "**Sports Injuries:** Diagnosing and treating injuries common in athletes, such as ACL tears, meniscus tears, rotator cuff tears, sprains, and strains.",
          "**Spinal Disorders:** Addressing conditions of the spine, including scoliosis, disc herniations, spinal stenosis, and degenerative disc disease, which can cause back and neck pain.",
          "**Joint Pain and Disorders:** Managing chronic pain and dysfunction in joints like the knees, hips, shoulders, and ankles, often requiring arthroscopy or joint reconstruction.",
          "**Ligament and Tendon Injuries:** Repairing or reconstructing damaged ligaments (e.g., ACL, MCL) and tendons (e.g., Achilles tendon, rotator cuff).",
          "**Bone Tumors:** Diagnosing and treating cancerous and non-cancerous tumors affecting bone tissue.",
          "**Congenital Conditions:** Addressing musculoskeletal deformities present at birth, such as clubfoot or developmental dysplasia of the hip.",
          "**Osteoporosis:** Managing this bone-weakening disease to prevent fractures and maintain bone density."
        ]
      },
      {
        title: "Diagnostic Tools and Techniques",
        icon: <Scan className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          "Orthopedists utilize a range of diagnostic tools to accurately assess musculoskeletal conditions, guiding precise treatment plans:"
        ],
        features: [
          "**X-rays:** The most common diagnostic tool for visualizing bones, identifying fractures, dislocations, and arthritic changes.",
          "**Magnetic Resonance Imaging (MRI):** Provides detailed images of soft tissues (ligaments, tendons, muscles, cartilage), crucial for diagnosing sports injuries, disc herniations, and certain tumors.",
          "**Computed Tomography (CT) Scans:** Offers cross-sectional images of bone and soft tissue, valuable for complex fractures, spinal conditions, and surgical planning.",
          "**Ultrasound:** Used to visualize soft tissue structures like tendons, ligaments, and muscles, and can guide injections.",
          "**Bone Scans:** Detects bone abnormalities, infections, fractures, and tumors by identifying areas of increased bone metabolism.",
          "**Arthroscopy:** A minimally invasive procedure where a small camera is inserted into a joint to visualize, diagnose, and treat internal joint problems.",
          "**Electromyography (EMG) & Nerve Conduction Studies (NCS):** Evaluate nerve and muscle function, used for diagnosing nerve impingement or muscle disorders."
        ]
      },
      {
        title: "Treatment Approaches in Orthopedics",
        icon: <Footprints className="h-8 w-8 text-teal-600" />, // Changed icon
        paragraphs: [
          "Orthopedic treatment plans are highly tailored, ranging from conservative management to advanced surgical interventions, with the goal of restoring function and alleviating pain:"
        ],
        features: [
          "**Non-Surgical Management:** Includes physical therapy, occupational therapy, bracing, casting, anti-inflammatory medications, pain relievers, and corticosteroid injections.",
          "**Arthroscopy:** Minimally invasive surgery to diagnose and treat joint problems (e.g., knee, shoulder, hip) with smaller incisions and faster recovery.",
          "**Joint Replacement Surgery (Arthroplasty):** Replacing damaged joint surfaces with artificial implants, commonly performed for hips, knees, and shoulders affected by severe arthritis.",
          "**Fracture Repair:** Surgical fixation of broken bones using plates, screws, rods, or pins to stabilize and promote healing.",
          "**Spinal Surgery:** Procedures for disc herniations (discectomy), spinal fusion, laminectomy, and correction of spinal deformities (e.g., scoliosis).",
          "**Ligament and Tendon Repair/Reconstruction:** Surgical procedures to repair torn ligaments (e.g., ACL reconstruction) or tendons (e.g., rotator cuff repair).",
          "**Hand and Wrist Surgery:** Addressing conditions like carpal tunnel syndrome, trigger finger, and fractures.",
          "**Foot and Ankle Surgery:** Treating bunions, hammertoes, Achilles tendon ruptures, and various foot deformities."
        ]
      },
      {
        title: "Rehabilitation and Prevention",
        icon: <Award className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          "Rehabilitation is a cornerstone of orthopedic care, often involving physical therapy, occupational therapy, and pain management to restore strength, flexibility, and function after injury or surgery. Prevention focuses on maintaining bone health, practicing proper ergonomics, warming up before exercise, and using protective gear during sports.",
          "The field of orthopedics is continuously advancing, with innovations in minimally invasive surgery, biologic treatments (like PRP and stem cell therapy), custom implants, and robotic-assisted surgery leading to better patient outcomes, faster recovery times, and more personalized care. These advancements are transforming the lives of countless individuals suffering from musculoskeletal conditions."
        ]
      }
    ]
  };

  // --- Render Logic ---

  if (!title) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <p className="text-2xl text-red-600 font-semibold mb-4">Invalid Service URL</p>
          <p className="text-700">The URL you're trying to access is not a recognized service. Please check and try again.</p>
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
          <p className="text-gray-700">The service "{title}" could not be found. It might not exist or there was an issue fetching it.</p>
        </div>
      </div>
    );
  }

  // Assuming 'service' now contains the fetched Orthopedics data
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
              <p className="text-lg sm:text-xl opacity-90 max-w-3xl">
                {service.description}
              </p>
            </div>
            <div className="hidden md:block">
              <Bone className="w-24 h-24 opacity-20" /> {/* Main icon for Orthopedics */}
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
          {exhaustiveOrthopedicsContent.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 flex items-center gap-3 border-b border-gray-200">
                {section.icon}
                {section.title}
              </h2>
              {section.paragraphs && section.paragraphs.map((paragraph, pIndex) => (
                <p key={`p-${pIndex}`} className="text-lg text-gray-700 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}

              {section.features && section.features.length > 0 && (
                <ul className="space-y-4 text-lg mt-6">
                  {section.features.map((feature: string, featureIndex: number) => (
                    <li key={`feature-${featureIndex}`} className="flex items-start gap-3 text-gray-800 p-3 bg-gray-50 rounded-lg shadow-sm">
                      <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                      {/* Using dangerouslySetInnerHTML to render bold markdown within strings */}
                      <span dangerouslySetInnerHTML={{ __html: feature.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Concluding Section for overall Orthopedics */}
          <div className="text-center mt-16 bg-gradient-to-r from-teal-50 to-pink-50 p-8 rounded-2xl shadow-inner">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Restoring Movement, Relieving Pain, Enhancing Life
            </h3>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Orthopedics is a dynamic and essential field dedicated to improving the lives of individuals by addressing disorders of the musculoskeletal system. Through continuous innovation in surgical techniques, rehabilitation, and preventive strategies, orthopedists strive to restore mobility, alleviate pain, and enable patients to return to their active lives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orthopedics;