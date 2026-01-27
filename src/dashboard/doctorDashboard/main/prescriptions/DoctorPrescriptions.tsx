import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import {
  prescriptionsAPI,
  type TPrescription,
} from '../../../../reducers/prescriptions/prescriptionsAPI';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Pill, 
  User, 
  Calendar, 
  XCircle, 
  FileText, 
  Hash, 
  TrendingUp, 
  Users 
} from 'lucide-react';
import CreatePrescription from './CreatePrescription';
import UpdatePrescription from './UpdatePrescription';
import DeletePrescription from './DeletePrescription';

const DoctorPrescriptions = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const doctorId = user?.user_id;

  const {
    data: prescriptionsData,
    isLoading,
    error,
    refetch,
  } = prescriptionsAPI.useGetPrescriptionsByDoctorIdQuery(doctorId ?? 0, {
    skip: !doctorId,
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const [selectedPrescription, setSelectedPrescription] = useState<TPrescription | null>(null);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<TPrescription | null>(null);

  const prescriptions = prescriptionsData?.data || [];

  const handleEdit = (prescription: TPrescription) => {
    setSelectedPrescription(prescription);
    (document.getElementById('update_prescription_modal') as HTMLDialogElement)?.showModal();
  };

  const handleDelete = (prescription: TPrescription) => {
    setPrescriptionToDelete(prescription);
    (document.getElementById('delete_prescription_modal') as HTMLDialogElement)?.showModal();
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-700 text-lg font-semibold">Error fetching prescriptions</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Integrated Dashboard Header & Summary */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Pill className="h-7 w-7 text-teal-600" /> Medical Prescriptions
            </h1>
            <p className="text-gray-500 text-sm ml-9">
              Managing <span className="font-bold text-teal-700">{prescriptions.length}</span> issued prescriptions
            </p>
          </div>
          <button
            onClick={() => (document.getElementById('create_prescription_modal') as HTMLDialogElement)?.showModal()}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-teal-100 active:scale-95"
          >
            <Plus size={20} /> New Prescription
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {/* Total Prescriptions */}
            <div className="flex flex-col items-center justify-center p-4 bg-teal-50/50 rounded-xl border border-teal-100/50">
              <span className="text-2xl font-black text-teal-700">{prescriptions.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600/70">Total Issued</span>
            </div>

            {/* Unique Patients */}
            <div className="flex flex-col items-center justify-center p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
              <span className="text-2xl font-black text-blue-700">
                {new Set(prescriptions.map((p) => p.patientId)).size}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600/70">Patients</span>
            </div>

            {/* Total Value */}
            <div className="flex flex-col items-center justify-center p-4 bg-amber-50/50 rounded-xl border border-amber-100/50">
              <span className="text-2xl font-black text-amber-700">
                KSh {prescriptions.reduce((t, p) => t + parseFloat(p.amount || '0'), 0).toLocaleString()}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600/70">Revenue</span>
            </div>

            {/* Avg Value */}
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-2xl font-black text-gray-900">
                {prescriptions.length > 0 
                  ? (prescriptions.reduce((t, p) => t + parseFloat(p.amount || '0'), 0) / prescriptions.length).toFixed(0)
                  : 0}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Avg Cost</span>
            </div>
          </div>
        </div>
      </div>

      <CreatePrescription refetch={refetch} />
      <UpdatePrescription prescription={selectedPrescription} refetch={refetch} />
      <DeletePrescription prescription={prescriptionToDelete} refetch={refetch} />

      {/* Prescriptions Grid */}
      {prescriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {prescriptions.map((prescription: TPrescription) => (
            <PrescriptionCard
              key={prescription.prescriptionId}
              prescription={prescription}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center">
          <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No prescriptions recorded yet.</p>
        </div>
      )}
    </div>
  );
};

const PrescriptionCard = ({ prescription, onEdit, onDelete }: any) => {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-gray-400 uppercase">RX ID #{prescription.prescriptionId}</span>
        </div>
        <div className="text-sm font-black text-teal-700">
          KSh {parseFloat(prescription.amount).toLocaleString()}
        </div>
      </div>

      <div className="p-5 flex-grow space-y-4">
        {/* Patient & Context */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
              <User size={16} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 leading-none">Patient ID</p>
              <h3 className="font-bold text-gray-900">{prescription.patientId}</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Hash size={16} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 leading-none">Appointment Ref</p>
              <h3 className="font-bold text-gray-900">{prescription.appointmentId}</h3>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="pt-3 border-t border-dashed border-gray-200">
          <div className="flex items-center gap-2 mb-2 text-gray-500">
            <FileText size={14} />
            <span className="text-[10px] font-bold uppercase">Clinical Notes</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 min-h-[80px]">
            <p className="text-xs text-gray-600 italic leading-relaxed">
              "{prescription.notes || 'No specific instructions provided.'}"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase">
          <Calendar size={12} /> Issued on: {prescription.createdAt ? new Date(prescription.createdAt).toLocaleDateString() : 'N/A'}
        </div>
      </div>

      <div className="p-5 pt-0 flex gap-2">
        <button 
          onClick={() => onEdit(prescription)} 
          className="flex-1 bg-gray-50 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 text-gray-700 py-2.5 rounded-lg text-xs font-bold border border-gray-200 transition-all flex items-center justify-center gap-2"
        >
          <Edit size={14} /> Edit
        </button>
        <button 
          onClick={() => onDelete(prescription)} 
          className="flex-1 bg-gray-50 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-gray-700 py-2.5 rounded-lg text-xs font-bold border border-gray-200 transition-all flex items-center justify-center gap-2"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
};

export default DoctorPrescriptions;