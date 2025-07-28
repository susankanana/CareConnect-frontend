// import { useEffect } from 'react';
// import { useLocation } from 'react-router';
// import { useGetServiceByTitleQuery } from '../../../src/reducers/services/servicesAPI';
// import { CheckCircle } from 'lucide-react';
// import { slugToTitleMap } from './slug';

// const Neurology = () => {
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

// export default Neurology;
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useGetServiceByTitleQuery } from '../../../src/reducers/services/servicesAPI';
import {
  CheckCircle,
  Brain,
  Award,
  Shield, 
  Scan, 
} from 'lucide-react';
import { slugToTitleMap } from './slug';

const Neurology = () => {
  const location = useLocation();

  // Extract the slug from the URL (e.g., "neurology")
  const slug = decodeURIComponent(location.pathname.split('/service/')[1]);

  // Convert slug to the proper title (e.g., "Neurology")
  const title = slugToTitleMap[slug];

  // Fetch the service data based on the title
  const { data: service, isLoading, isError } = useGetServiceByTitleQuery(title, {
    skip: !title, // Skip query if title is undefined
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Define static exhaustive content for Neurology
  const exhaustiveNeurologyContent = {
    sections: [
      {
        title: "The Scope of Neurology",
        icon: <Brain className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          "Neurology is the medical specialty dedicated to diagnosing and treating disorders of the **nervous system**. This intricate system includes the brain, spinal cord, and all the nerves that connect them throughout the body. Neurologists are experts in conditions that affect the brain, spinal cord, and peripheral nerves, and how these impact sensation, movement, memory, and overall bodily functions.",
        ],
        features: [
          "**Epilepsy and Seizure Disorders:** Characterized by recurrent, unprovoked seizures, often managed with medication, lifestyle adjustments, and in some cases, surgery.",
          "**Stroke:** Occurs when blood flow to a part of the brain is interrupted, causing brain cells to die. Neurologists are crucial in acute stroke management and rehabilitation.",
          "**Multiple Sclerosis (MS):** A chronic, unpredictable disease that affects the central nervous system, disrupting the flow of information within the brain, and between the brain and body.",
          "**Parkinson's Disease:** A progressive neurodegenerative disorder affecting movement, characterized by tremors, rigidity, slow movement, and impaired balance.",
          "**Alzheimer's Disease and Dementia:** Progressive conditions that cause gradual decline in memory, thinking, and reasoning skills, severely impacting daily life.",
          "**Headaches and Migraines:** Common conditions ranging from tension headaches to debilitating migraines, requiring accurate diagnosis and personalized treatment plans.",
          "**Neuropathic Pain:** Chronic pain caused by nerve damage, often managed with a combination of medications and therapies.",
          "**Brain and Spinal Cord Tumors:** Diagnosing and managing both cancerous and non-cancerous growths affecting the nervous system.",
          "**Peripheral Neuropathy:** Damage to nerves outside of the brain and spinal cord, often leading to weakness, numbness, and pain in the hands and feet."
        ]
      },
      {
        title: "Diagnostic Approaches in Neurology",
        icon: <Scan className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          "Neurologists utilize a variety of advanced diagnostic tools to precisely identify neurological conditions and tailor effective treatment strategies:"
        ],
        features: [
          "**Magnetic Resonance Imaging (MRI) & Computed Tomography (CT) Scans:** Detailed imaging of the brain and spinal cord to detect tumors, strokes, MS lesions, and other structural abnormalities.",
          "**Electroencephalogram (EEG):** Records the electrical activity of the brain, primarily used to diagnose epilepsy and other seizure disorders.",
          "**Electromyography (EMG) & Nerve Conduction Studies (NCS):** Assess the health of muscles and the nerves that control them, useful for diagnosing conditions like carpal tunnel syndrome, peripheral neuropathy, and ALS.",
          "**Lumbar Puncture (Spinal Tap):** Involves collecting a sample of cerebrospinal fluid (CSF) for analysis, helping diagnose infections, inflammatory conditions, and certain neurological disorders.",
          "**Evoked Potentials:** Measure the electrical activity in the brain in response to sensory stimulation (visual, auditory, or somatosensory) to evaluate nerve pathways.",
          "**Carotid Ultrasound:** Uses sound waves to create images of the carotid arteries in the neck, checking for blockages that could lead to stroke.",
          "**Blood Tests:** Used to identify inflammatory markers, genetic predispositions, infections, and nutrient deficiencies that may impact neurological health."
        ]
      },
      {
        title: "Treatment Modalities in Neurology",
        icon: <Award className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          "Neurological treatment plans are highly individualized, combining various approaches to manage symptoms, slow disease progression, and improve quality of life. These range from medication to advanced therapeutic interventions:"
        ],
        features: [
          "**Pharmacotherapy:** Prescribing medications to manage symptoms (e.g., anti-seizure drugs, pain relievers, drugs for Parkinson's), slow disease progression (e.g., for MS or Alzheimer's), or treat underlying causes.",
          "**Physical, Occupational, and Speech Therapy:** Essential for rehabilitation, helping patients regain function, manage disabilities, and improve communication after a stroke, brain injury, or in progressive neurological conditions.",
          "**Deep Brain Stimulation (DBS):** A surgical procedure involving implanting electrodes in specific brain areas to send electrical impulses, often used for Parkinson's disease, essential tremor, and dystonia.",
          "**Botulinum Toxin Injections:** Used to treat various neurological conditions involving muscle spasms, chronic migraines, and dystonia.",
          "**Immunotherapies:** For autoimmune neurological disorders like Multiple Sclerosis, these therapies modulate the immune system to reduce inflammation and prevent damage.",
          "**Lifestyle Management:** Emphasizing a healthy diet, regular exercise, adequate sleep, and stress reduction to support neurological health and manage chronic conditions.",
          "**Pain Management:** Comprehensive strategies for chronic neuropathic pain, including medications, nerve blocks, and alternative therapies."
        ]
      },
      {
        title: "Prevention and Advancements",
        icon: <Shield className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          "Prevention in neurology focuses on managing risk factors for conditions like stroke (e.g., controlling blood pressure, diabetes, cholesterol) and promoting brain health through healthy living. Early diagnosis and intervention are critical for better outcomes in many neurological disorders.",
          "The field of neurology is at the forefront of medical research, with exciting advancements continually emerging. Innovations in genetic therapies, neuroimaging, and personalized medicine are transforming the outlook for many neurological patients, offering new hope and improved quality of life."
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

  // Assuming 'service' now contains the fetched Neurology data
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
              <Brain className="w-24 h-24 opacity-20" /> 
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
          {exhaustiveNeurologyContent.sections.map((section, sectionIndex) => (
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

          {/* Concluding Section for overall Neurology */}
          <div className="text-center mt-16 bg-gradient-to-r from-teal-50 to-pink-50 p-8 rounded-2xl shadow-inner">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Advancing Understanding of the Human Nervous System
            </h3>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Neurology is a dynamic and critical field, continuously evolving with new research and technological breakthroughs. It plays a pivotal role in understanding and treating conditions that affect the very essence of human function, striving to improve the lives of those impacted by neurological disorders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Neurology;
