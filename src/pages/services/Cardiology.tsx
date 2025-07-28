// import { useEffect } from 'react';
// import { useLocation } from 'react-router';
// import { useGetServiceByTitleQuery } from '../../../src/reducers/services/servicesAPI';
// import { CheckCircle } from 'lucide-react';
// import { slugToTitleMap } from './slug';

// const Cardiology = () => {
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

// export default Cardiology;
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useGetServiceByTitleQuery } from '../../../src/reducers/services/servicesAPI';
import {
  CheckCircle,
  Heart,
  Award,
  Stethoscope,
  Activity,
  HeartPulse // Added HeartPulse for a relevant icon
} from 'lucide-react';
import { slugToTitleMap } from './slug';

const Cardiology = () => {
  const location = useLocation();

  // Extract the slug from the URL (e.g., "emergencycare")
  const slug = decodeURIComponent(location.pathname.split('/service/')[1]);

  // Convert slug to the proper title (e.g., "Emergency Care")
  const title = slugToTitleMap[slug]; // This will be "Cardiology" if the slug is correct

  // Fetch the service data based on the title
  const { data: service, isLoading, isError } = useGetServiceByTitleQuery(title, {
    skip: !title, // Skip query if title is undefined
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Define static exhaustive content for Cardiology
  const exhaustiveCardiologyContent = {
    sections: [
      {
        title: "The Scope of Cardiology",
        icon: <Stethoscope className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          "The field of cardiology is incredibly broad, encompassing various sub-specialties and addressing a multitude of conditions. At its core, cardiology aims to preserve and restore the health of one of the body's most critical organs.",
        ],
        features: [
          "**Coronary Artery Disease (CAD):** This is one of the most common heart conditions, involving the narrowing or blockage of the coronary arteries, which supply blood to the heart muscle. CAD can lead to **angina** (chest pain), **heart attack (myocardial infarction)**, and other serious complications.",
          "**Heart Failure:** A chronic, progressive condition in which the heart muscle is unable to pump enough blood to meet the body's needs. It can result from various underlying heart conditions and significantly impacts a person's quality of life.",
          "**Arrhythmias (Heart Rhythm Disorders):** These are conditions where the heart beats too fast (tachycardia), too slow (bradycardia), or irregularly. Common arrhythmias include **atrial fibrillation**, a rapid and irregular heartbeat, and **ventricular tachycardia**, a potentially life-threatening fast heart rhythm.",
          "**Valvular Heart Disease:** Affects the heart's four valves, which ensure blood flows in the correct direction. Valves can become **stenotic** (narrowed) or **regurgitant** (leaky), impairing the heart's efficiency.",
          "**Hypertension (High Blood Pressure):** A major risk factor for many cardiovascular diseases, hypertension can damage arteries and lead to heart attack, stroke, and kidney disease if left uncontrolled. Cardiologists often play a crucial role in managing complex or resistant cases of hypertension.",
          "**Cardiomyopathy:** Diseases of the heart muscle itself, leading to it becoming enlarged, thickened, or rigid. These conditions can weaken the heart and lead to heart failure or arrhythmias.",
          "**Congenital Heart Defects:** Structural problems with the heart that are present at birth. While some are minor, others can be severe and require significant medical intervention.",
          "**Peripheral Artery Disease (PAD):** Although primarily focused on the heart, cardiologists also address conditions affecting blood vessels outside the heart, such as PAD, which involves narrowed arteries reducing blood flow to the limbs."
        ]
      },
      {
        title: "Diagnostic Tools and Techniques",
        icon: <Activity className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          "Cardiologists employ a sophisticated array of diagnostic tools to assess heart health and identify abnormalities. These techniques allow for precise evaluation and guide treatment strategies:"
        ],
        features: [
          "**Electrocardiogram (ECG/EKG):** A quick and painless test that records the electrical signals of the heart, detecting irregular heartbeats, heart damage, or other electrical problems.",
          "**Echocardiogram (Echo):** Uses sound waves to create a moving picture of the heart, providing detailed information about its structure, function, and blood flow through the valves.",
          "**Stress Test:** Evaluates how the heart performs under physical stress. This can involve exercising on a treadmill or stationary bicycle, or using medication to simulate exercise.",
          "**Cardiac Catheterization (Angiogram):** An invasive procedure where a thin, flexible tube (catheter) is inserted into a blood vessel and guided to the heart. Dye is then injected to visualize the coronary arteries and check for blockages.",
          "**Cardiac MRI/CT Scan:** Advanced imaging techniques that provide highly detailed images of the heart's structure and function, often used for complex cases or to evaluate specific conditions.",
          "**Holter Monitor/Event Monitor:** Portable devices worn for extended periods to record the heart's electrical activity, helping to detect intermittent arrhythmias that might not show up on a standard ECG.",
          "**Blood Tests:** Used to measure cholesterol levels, blood sugar, markers of inflammation, and indicators of heart muscle damage."
        ]
      },
      {
        title: "Treatment Approaches in Cardiology",
        icon: <Award className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          "Treatment plans in cardiology are highly individualized, depending on the specific condition, its severity, and the patient's overall health. Treatments can range from lifestyle modifications to advanced surgical procedures:"
        ],
        features: [
          "**Lifestyle Modifications:** Often the first line of defense, these include dietary changes (e.g., low-sodium, low-fat), regular exercise, weight management, smoking cessation, and stress reduction.",
          "**Medications:** A wide array of drugs are used to manage heart conditions, such as Beta-blockers (slow heart rate), ACE inhibitors/ARBs (lower blood pressure), Diuretics (eliminate fluid), Statins (lower cholesterol), Anticoagulants/Antiplatelets (prevent clots), and Anti-arrhythmic drugs (regulate rhythm).",
          "**Interventional Procedures:** Include **Angioplasty and Stenting** (opening narrowed arteries), **Pacemakers and Defibrillators** (regulating heart rhythm), and **Electrophysiology (EP) Study and Ablation** (treating complex arrhythmias).",
          "**Cardiac Surgery:** Involves procedures like **Coronary Artery Bypass Graft (CABG) Surgery** (bypassing blocked arteries), **Heart Valve Repair or Replacement**, and in severe cases, **Heart Transplant**."
        ]
      },
      {
        title: "Prevention and Prognosis",
        icon: <Heart className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          "A significant focus in cardiology is on **prevention**. By identifying and managing risk factors early, such as high blood pressure, high cholesterol, diabetes, obesity, and smoking, cardiologists can help patients reduce their risk of developing serious heart conditions. Regular check-ups, a healthy lifestyle, and adherence to medical advice are crucial for maintaining cardiovascular health.",
          "The prognosis for heart conditions has dramatically improved over the decades due to advancements in diagnostic tools, medications, and surgical techniques. With proper management and patient adherence to treatment plans, many individuals with cardiovascular disease can lead long and fulfilling lives."
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

  // Assuming 'service' now contains the fetched Cardiology data
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
              <HeartPulse className="w-24 h-24 opacity-20" /> {/* Changed icon to HeartPulse */}
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
          {exhaustiveCardiologyContent.sections.map((section, sectionIndex) => (
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

          {/* Concluding Section for overall Cardiology */}
          <div className="text-center mt-16 bg-gradient-to-r from-teal-50 to-pink-50 p-8 rounded-2xl shadow-inner">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              A Vital Field in Modern Healthcare
            </h3>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Cardiology is a constantly evolving field, driven by ongoing research and technological innovations that continue to enhance our understanding and treatment of heart diseases. It stands as a cornerstone of modern healthcare, dedicated to protecting the organ that keeps us all going.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cardiology;