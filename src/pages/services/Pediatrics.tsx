// import { useEffect } from 'react';
// import { useLocation } from 'react-router';
// import { useGetServiceByTitleQuery } from '../../../src/reducers/services/servicesAPI';
// import { CheckCircle } from 'lucide-react';
// import { slugToTitleMap } from './slug';

// const Pediatrics = () => {
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

// export default Pediatrics;
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useGetServiceByTitleQuery } from '../../../src/reducers/services/servicesAPI';
import { CheckCircle, Baby, Stethoscope, ShieldCheck, LineChart } from 'lucide-react';
import { slugToTitleMap } from './slug';

const Pediatrics = () => {
  const location = useLocation();

  // Extract the slug from the URL (e.g., "pediatrics")
  const slug = decodeURIComponent(location.pathname.split('/service/')[1]);

  // Convert slug to the proper title (e.g., "Pediatrics")
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

  // Define static exhaustive content for Pediatrics
  const exhaustivePediatricsContent = {
    sections: [
      {
        title: 'The Scope of Pediatrics',
        icon: <Baby className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          'Pediatrics is the branch of medicine that deals with the **medical care of infants, children, and adolescents**. Pediatricians provide comprehensive health services, from preventive health maintenance to the diagnosis and treatment of acute and chronic illnesses. Their focus is not just on physical health, but also on the overall growth, development, and well-being of young people, understanding that children are not just small adults.',
        ],
        features: [
          '**Well-Child Visits:** Regular check-ups from infancy through adolescence to monitor growth, development, provide immunizations, and offer guidance on child health.',
          '**Immunizations:** Administering vaccines to protect children from a wide range of infectious diseases, following established national and international schedules.',
          '**Acute Illnesses:** Diagnosing and treating common childhood illnesses such as colds, flu, ear infections, strep throat, and various viral infections.',
          '**Chronic Conditions:** Managing long-term health issues like asthma, allergies, diabetes, epilepsy, and developmental disorders, often coordinating care with specialists.',
          '**Growth and Development Monitoring:** Tracking physical, cognitive, and emotional milestones to identify any delays or concerns early.',
          '**Behavioral and Mental Health:** Addressing common behavioral issues, ADHD, anxiety, depression, and other mental health challenges in children and adolescents.',
          '**Nutrition and Feeding:** Providing guidance on healthy eating habits, managing feeding difficulties, and addressing issues like childhood obesity or picky eating.',
          '**Injuries and Accidents:** Treating common childhood injuries, providing wound care, and offering safety counseling to prevent accidents.',
          '**Adolescent Health:** Addressing specific health needs of teenagers, including reproductive health, substance abuse prevention, and mental well-being.',
        ],
      },
      {
        title: 'Diagnostic Tools and Techniques',
        icon: <Stethoscope className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          'Pediatricians use age-appropriate diagnostic methods to ensure accurate assessment and minimize discomfort for their young patients:',
        ],
        features: [
          '**Physical Examination:** A thorough head-to-toe examination, adapted for different age groups, to assess overall health and development.',
          "**Growth Charts:** Essential tools to plot and monitor a child's weight, height, and head circumference against established norms.",
          '**Developmental Screenings:** Tools and questionnaires to assess motor skills, language, cognitive abilities, and social-emotional development.',
          '**Vaccination Records Review:** Meticulous tracking of immunization status to ensure timely and complete vaccination.',
          '**Laboratory Tests:** Age-appropriate blood, urine, and stool tests for diagnosing infections, anemia, allergies, and other conditions.',
          '**Imaging Studies:** X-rays, ultrasounds, and sometimes MRI/CT scans (when necessary) performed with child-friendly protocols for conditions like fractures, abdominal issues, or neurological concerns.',
          '**Hearing and Vision Screenings:** Regular tests to detect any impairments early that could affect learning and development.',
          '**Referral to Specialists:** Collaborating with pediatric sub-specialists (e.g., pediatric cardiologists, neurologists, endocrinologists) for complex or specialized care.',
        ],
      },
      {
        title: 'Treatment Approaches in Pediatrics',
        icon: <ShieldCheck className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          'Pediatric treatment focuses on effective and safe interventions tailored to the unique physiological and developmental needs of children. Approaches range from preventive measures to managing complex illnesses:',
        ],
        features: [
          '**Immunization Schedules:** Adhering to and administering recommended vaccine doses to build immunity against infectious diseases.',
          "**Medication Management:** Prescribing and carefully monitoring medications, with dosages adjusted precisely for a child's weight and age.",
          '**Hydration and Nutritional Support:** Managing dehydration due to illness and providing guidance on appropriate nutrition for growth and recovery.',
          '**Fever Management:** Education and strategies for safely managing fever, which is a common symptom in childhood illnesses.',
          '**Antibiotic/Antiviral Therapy:** Treating bacterial or viral infections with appropriate antimicrobial agents.',
          '**Inhaler/Nebulizer Therapy:** For respiratory conditions like asthma or bronchiolitis.',
          '**Behavioral Interventions:** Counseling for parents and children to address behavioral challenges, sleep issues, or developmental concerns.',
          '**Minor Procedures:** Performing procedures like wound care, ear wax removal, or minor injury management in the clinic.',
          '**Chronic Disease Management Plans:** Developing comprehensive plans for conditions like diabetes or asthma, including medication, lifestyle, and emergency protocols.',
        ],
      },
      {
        title: 'Growth, Development, and Prevention',
        icon: <LineChart className="h-8 w-8 text-teal-600" />,
        paragraphs: [
          'A cornerstone of pediatrics is preventive care, focusing on optimal growth and development. This includes regular check-ups, comprehensive immunization, nutritional counseling, safety education (e.g., car seat safety, poison prevention), and early intervention for developmental delays. Pediatricians work closely with families to foster healthy lifestyles and create supportive environments for children.',
          'The field continuously evolves with new research in child health, infectious diseases, genetics, and developmental psychology. Advances in pediatric medicine aim to ensure every child has the best possible start in life and the opportunity to reach their full potential, contributing to healthier future generations.',
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

  // Assuming 'service' now contains the fetched Pediatrics data
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
              <Baby className="w-24 h-24 opacity-20" /> {/* Main icon for Pediatrics */}
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
          {exhaustivePediatricsContent.sections.map((section, sectionIndex) => (
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

          {/* Concluding Section for overall Pediatrics */}
          <div className="text-center mt-16 bg-gradient-to-r from-teal-50 to-pink-50 p-8 rounded-2xl shadow-inner">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Nurturing Health and Growth for Future Generations
            </h3>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Pediatrics is a foundational medical specialty dedicated to safeguarding the health
              and development of children from birth through adolescence. Through continuous
              advancements in medical science, preventative care, and compassionate patient-centered
              approaches, pediatricians play a vital role in ensuring a healthy start and a brighter
              future for every child.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pediatrics;
