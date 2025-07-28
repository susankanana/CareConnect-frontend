// import { useEffect } from 'react';
// import { useLocation } from 'react-router';
// import { useGetServiceByTitleQuery } from '../../../src/reducers/services/servicesAPI';
// import { CheckCircle } from 'lucide-react';
// import { slugToTitleMap } from './slug';

// const EmergencyCare = () => {
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

// export default EmergencyCare;
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useGetServiceByTitleQuery } from '../../../src/reducers/services/servicesAPI';
import {
  CheckCircle,
  Ambulance, 
  BriefcaseMedical,
  Stethoscope, 
  Users, 
} from 'lucide-react';
import { slugToTitleMap } from './slug';

const EmergencyCare = () => {
  const location = useLocation();

  // Extract the slug from the URL (e.g., "emergencycare")
  const slug = decodeURIComponent(location.pathname.split('/service/')[1]);

  // Convert slug to the proper title (e.g., "Emergency Care")
  const title = slugToTitleMap[slug];

  // Fetch the service data based on the title
  const { data: service, isLoading, isError } = useGetServiceByTitleQuery(title, {
    skip: !title, // Skip query if title is undefined
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Define static exhaustive content for Emergency Care
  const exhaustiveEmergencyCareContent = {
    sections: [
      {
        title: "The Scope of Emergency Care",
        icon: <Ambulance className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          "Emergency care is a critical medical specialty focused on the **immediate evaluation and treatment of acute illnesses and injuries** that pose an immediate threat to life or limb, or require urgent medical attention. Emergency departments (EDs) are equipped to handle a vast array of conditions, providing rapid assessment, stabilization, and appropriate disposition for patients of all ages. The core mission is to save lives, prevent disability, and alleviate suffering during critical moments."
        ],
        features: [
          "**Life-Threatening Conditions:** Responding to heart attacks, strokes, severe bleeding, anaphylaxis, and other conditions requiring immediate intervention.",
          "**Traumatic Injuries:** Managing injuries from accidents, falls, burns, and assaults, including fractures, head injuries, and internal organ damage.",
          "**Acute Illnesses:** Treating sudden onset severe infections (e.g., sepsis, pneumonia), respiratory distress (e.g., asthma attacks), severe allergic reactions, and acute abdominal pain.",
          "**Pediatric Emergencies:** Specialized care for infants and children experiencing medical emergencies, considering their unique physiological and developmental needs.",
          "**Psychiatric Emergencies:** Providing initial assessment and stabilization for individuals experiencing acute mental health crises, including suicidal ideation or severe behavioral disturbances.",
          "**Toxicology and Overdoses:** Managing poisoning, drug overdoses, and adverse reactions to medications.",
          "**Environmental Emergencies:** Treating conditions like heatstroke, hypothermia, frostbite, and bites/stings.",
          "**Stabilization and Transfer:** Stabilizing critically ill or injured patients before transferring them to specialized units (e.g., ICU, operating room) or other facilities.",
          "**Minor Injuries & Illnesses (Urgent Care):** While not life-threatening, many EDs also treat conditions requiring prompt attention but not immediate critical intervention, such as cuts, sprains, or minor infections."
        ]
      },
      {
        title: "Diagnostic Approaches in Emergency Care",
        icon: <Stethoscope className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          "Rapid and accurate diagnosis is paramount in emergency settings. Emergency physicians and their teams utilize swift assessment tools to identify life-threatening conditions and guide immediate interventions:"
        ],
        features: [
          "**Rapid Clinical Assessment:** Immediate evaluation of vital signs (heart rate, blood pressure, respiration, oxygen saturation, temperature), airway, breathing, circulation, and level of consciousness.",
          "**Point-of-Care Testing (POCT):** Quick laboratory tests performed at the bedside (e.g., blood glucose, blood gas analysis, cardiac markers) for rapid results.",
          "**Diagnostic Imaging:** Immediate access to X-rays for fractures, CT scans for head injuries or internal bleeding, and ultrasound for rapid assessment of internal organs.",
          "**Electrocardiogram (ECG):** Performed immediately for chest pain or cardiac symptoms to detect heart attacks or arrhythmias.",
          "**Focused Assessment with Sonography for Trauma (FAST) Exam:** A quick ultrasound examination to detect internal bleeding in trauma patients.",
          "**Laboratory Investigations:** Comprehensive blood and urine tests ordered based on initial assessment to further diagnose conditions like infection, organ dysfunction, or electrolyte imbalances.",
          "**Patient History and Collateral Information:** Gathering crucial information from the patient, family, or emergency responders to understand the context of the emergency."
        ]
      },
      {
        title: "Treatment Modalities in Emergency Care",
        icon: <BriefcaseMedical className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          "Emergency treatment focuses on stabilization, resuscitation, and addressing the immediate cause of the emergency. Interventions are often time-sensitive and life-saving:"
        ],
        features: [
          "**Resuscitation (CPR/ACLS/PALS):** Advanced life support protocols for cardiac arrest, severe trauma, or respiratory failure, including airway management, defibrillation, and medication administration.",
          "**Trauma Management:** Initial assessment and stabilization of severe injuries, including bleeding control, splinting, and preparation for surgery.",
          "**Medication Administration:** Rapid delivery of life-saving drugs for conditions like anaphylaxis, severe pain, seizures, or cardiac events.",
          "**Fluid Resuscitation:** Administering intravenous fluids to patients with shock, severe dehydration, or blood loss.",
          "**Wound Care:** Cleaning, closing, and dressing lacerations and other wounds to prevent infection.",
          "**Pain Management:** Rapid and effective relief of acute pain through various pharmacological and non-pharmacological methods.",
          "**Symptom Control:** Addressing acute symptoms like nausea, vomiting, severe headache, or allergic reactions.",
          "**Stabilization for Transfer:** Preparing patients who require higher levels of care or specialized surgery for safe transfer to other hospital units or facilities.",
          "**Emergency Surgical Procedures:** Performing urgent procedures like chest tube insertion, intubation, or emergency fasciotomy when immediate surgical intervention is critical."
        ]
      },
      {
        title: "Preparedness and Evolution of Emergency Care",
        icon: <Users className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          "Emergency departments operate 24/7, staffed by highly trained teams of emergency physicians, nurses, paramedics, and support staff, all working together in a fast-paced environment. Readiness includes having specialized equipment, protocols for mass casualties, and strong collaboration with pre-hospital services (ambulances) and other hospital departments.",
          "The field of emergency medicine is constantly evolving with advancements in trauma care, critical care techniques, rapid diagnostics, and public health preparedness. The goal remains to provide immediate, life-saving care, ensuring the best possible outcomes during medical crises. In Kenya, access to well-equipped emergency care is crucial for public health, especially given the current time (July 2025)."
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
          <p className="text-gray-700">The URL you're trying to access is not a recognized service. Please check and try again.</p>
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

  // Assuming 'service' now contains the fetched Emergency Care data
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
              <Ambulance className="w-24 h-24 opacity-20" /> {/* Main icon for Emergency Care */}
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
          {exhaustiveEmergencyCareContent.sections.map((section, sectionIndex) => (
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

          {/* Concluding Section for overall Emergency Care */}
          <div className="text-center mt-16 bg-gradient-to-r from-teal-50 to-pink-50 p-8 rounded-2xl shadow-inner">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Responding to Crisis, Saving Lives
            </h3>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Emergency care is a vital frontline service, providing immediate and critical medical attention during acute crises. Through rapid assessment, advanced interventions, and dedicated teams, emergency departments are indispensable in safeguarding public health and delivering urgent care when every second counts, especially in dynamic healthcare environments like Kenya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCare;
