import { useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import {
  prescriptionsAPI,
  type TPrescription,
} from '../../../../reducers/prescriptions/prescriptionsAPI';
import {
  Pill,
  Calendar,
  XCircle,
  FileText,
  Download,
  Stethoscope,
  Clock,
  ExternalLink,
} from 'lucide-react';

const PatientPrescriptions = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const patientId = user?.user_id;

  // Using the hook defined in your API slice
  const {
    data: prescriptionsData,
    isLoading,
    isError,
    refetch,
  } = prescriptionsAPI.useGetPrescriptionsByPatientIdQuery(patientId ?? 0, {
    skip: !patientId,
    refetchOnMountOrArgChange: true,
  });

  const prescriptions = prescriptionsData?.data || [];

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );

  if (isError)
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-red-700 text-lg font-bold">Failed to load prescriptions</h2>
        <p className="text-red-600 text-sm mb-4">
          There was an error connecting to the medical records server.
        </p>
        <button
          onClick={() => refetch()}
          className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Header & Stats Section */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Pill className="h-7 w-7 text-teal-600" /> My Prescription History
            </h1>
            <p className="text-gray-500 text-sm ml-9">
              View and download your official medical prescriptions
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="flex items-center gap-4 p-4 bg-teal-50/50 rounded-xl border border-teal-100/50">
              <div className="h-10 w-10 bg-teal-600 rounded-lg flex items-center justify-center text-white">
                <Pill size={20} />
              </div>
              <div>
                <span className="block text-xl font-black text-teal-700">
                  {prescriptions.length}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600/70">
                  Total Records
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Clock size={20} />
              </div>
              <div>
                <span className="block text-xl font-black text-blue-700 uppercase">
                  {prescriptions.length > 0 && prescriptions[0].createdAt
                    ? new Date(prescriptions[0].createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                      })
                    : 'No Records'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600/70">
                  Last Issued
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="h-10 w-10 bg-gray-600 rounded-lg flex items-center justify-center text-white">
                <Stethoscope size={20} />
              </div>
              <div>
                <span className="block text-xl font-black text-gray-900">Official</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Verified RX
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription List */}
      {prescriptions.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {prescriptions.map((prescription: TPrescription) => (
            <PatientPrescriptionRow key={prescription.prescriptionId} prescription={prescription} />
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
          <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <Pill size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No prescriptions found</h3>
          <p className="text-gray-500 max-w-xs mx-auto mt-2">
            Your medical prescriptions will appear here after your doctor issues them during a
            consultation.
          </p>
        </div>
      )}
    </div>
  );
};

const PatientPrescriptionRow = ({ prescription }: { prescription: TPrescription }) => {
  const dateObj = prescription.createdAt ? new Date(prescription.createdAt) : new Date();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-teal-200 hover:shadow-md transition-all duration-300 overflow-hidden group">
      <div className="flex flex-col md:flex-row items-stretch md:items-center p-4 gap-6">
        {/* Date Calendar Widget */}
        <div className="flex md:flex-col items-center justify-center bg-gray-50 rounded-xl p-4 min-w-25 border border-gray-100">
          <span className="text-xs font-black text-gray-400 uppercase">
            {dateObj.toLocaleString('default', { month: 'short' })}
          </span>
          <span className="text-2xl font-black text-gray-900 leading-none my-1">
            {dateObj.getDate()}
          </span>
          <span className="text-[10px] font-bold text-teal-600 uppercase">
            {dateObj.getFullYear()}
          </span>
        </div>

        {/* Prescription Main Info */}
        <div className="grow space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-teal-50 text-teal-700 text-[10px] px-2 py-0.5 rounded-md font-black border border-teal-100 uppercase flex items-center gap-1">
              <Calendar size={10} /> RX #{prescription.prescriptionId}
            </span>
            <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-md font-black border border-blue-100 uppercase flex items-center gap-1">
              <ExternalLink size={10} /> Appt #{prescription.appointmentId}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-900">
            <FileText size={18} className="text-teal-600" />
            <h3 className="font-bold text-lg">Doctor's Instructions</h3>
          </div>
          <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
            <p className="text-gray-700 text-sm leading-relaxed italic">
              "{prescription.notes || 'No specific notes provided.'}"
            </p>
          </div>
        </div>

        {/* Pricing and Actions */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-dashed border-gray-200 pt-4 md:pt-0 md:pl-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
              Pharmacy Total
            </p>
            <span className="text-xl font-black text-gray-900">
              KSh {parseFloat(prescription.amount || '0').toLocaleString()}
            </span>
          </div>
          <button
            className="flex items-center gap-2 bg-gray-900 hover:bg-teal-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg active:scale-95 group"
            onClick={() => window.print()} // Placeholder for PDF download/print
          >
            <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientPrescriptions;
