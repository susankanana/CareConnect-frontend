import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useGetServiceByTitleQuery } from '../../../src/reducers/services/servicesAPI';
import { CheckCircle } from 'lucide-react';
import { slugToTitleMap } from './slug';

const Neurology = () => {
  const location = useLocation();

  // Extract the slug from the URL (e.g., "emergencycare")
  const slug = decodeURIComponent(location.pathname.split('/service/')[1]);

  // Convert slug to the proper title (e.g., "Emergency Care")
  const title = slugToTitleMap[slug];

  const { data: service, isLoading, isError } = useGetServiceByTitleQuery(title, {
    skip: !title, //skip query if title is undefined
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!title) {
    return <div className="text-center mt-10 text-red-500">Invalid service URL.</div>;
  }

  if (isLoading) {
    return <div className="text-center mt-10 text-gray-600">Loading service...</div>;
  }

  if (isError || !service) {
    return <div className="text-center mt-10 text-red-500">Service not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{service.title}</h1>
        <p className="text-lg text-gray-700 mb-8">{service.description}</p>

        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
        <ul className="space-y-3">
          {service.features?.map((feature: string, index: number) => (
            <li key={index} className="flex items-start gap-2 text-gray-800">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Neurology;
