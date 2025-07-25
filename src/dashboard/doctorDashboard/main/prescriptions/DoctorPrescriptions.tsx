import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import { prescriptionsAPI, type TPrescription } from "../../../../reducers/prescriptions/prescriptionsAPI";
import { Edit, Trash2, Plus, Pill, User, Calendar, XCircle, FileText } from "lucide-react";
import CreatePrescription from "./CreatePrescription";
import UpdatePrescription from "./UpdatePrescription";
import DeletePrescription from "./DeletePrescription";

const DoctorPrescriptions = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const doctorId = user?.user_id; 

    const { data: prescriptionsData, isLoading, error, refetch } = prescriptionsAPI.useGetPrescriptionsByDoctorIdQuery(
        doctorId ?? 0,
        {
            skip: !doctorId,
            refetchOnMountOrArgChange: true,
            pollingInterval: 60000,
        }
    );

    const [selectedPrescription, setSelectedPrescription] = useState<TPrescription | null>(null);
    const [prescriptionToDelete, setPrescriptionToDelete] = useState<TPrescription | null>(null);

    const handleEdit = (prescription: TPrescription) => {
        setSelectedPrescription(prescription);
        (document.getElementById('update_prescription_modal') as HTMLDialogElement)?.showModal();
    };

    const handleDelete = (prescription: TPrescription) => {
        setPrescriptionToDelete(prescription);
        (document.getElementById('delete_prescription_modal') as HTMLDialogElement)?.showModal();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-700 text-lg font-semibold">Error fetching prescriptions</p>
                <p className="text-red-600 mt-2">Please try again later</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Pill className="h-7 w-7 text-teal-600" />
                            My Prescriptions
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage patient prescriptions - {prescriptionsData?.data?.length || 0} total prescriptions
                        </p>
                    </div>
                    <button
                        data-test="open-create-prescription"
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-md"
                        onClick={() => (document.getElementById('create_prescription_modal') as HTMLDialogElement)?.showModal()}
                    >
                        <Plus className="h-5 w-5" />
                        Add New Prescription
                    </button>
                </div>
            </div>

            {/* Modals */}
            <CreatePrescription refetch={refetch} />
            <UpdatePrescription prescription={selectedPrescription} refetch={refetch} />
            <DeletePrescription prescription={prescriptionToDelete} refetch={refetch} />

            {/* Prescriptions Grid */}
            {prescriptionsData && prescriptionsData.data && prescriptionsData.data.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {prescriptionsData.data.map((prescription: TPrescription) => (
                        <div
                            data-test="prescription-card"
                            key={prescription.prescriptionId}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
                        >
                            {/* Prescription Header */}
                            <div className="bg-gradient-to-r from-teal-50 to-pink-50 p-4 border-b">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Prescription #{prescription.prescriptionId}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar className="h-4 w-4 text-teal-600" />
                                            <span className="text-sm text-gray-600">
                                                {prescription.createdAt ? new Date(prescription.createdAt).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-bold text-teal-600">
                                            KSh {parseFloat(prescription.amount).toFixed(2)}
                                        </span>
                                        <p className="text-xs text-gray-500">Amount</p>
                                    </div>
                                </div>
                            </div>

                            {/* Prescription Details */}
                            <div className="p-6">
                                {/* Patient Information */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <User className="h-4 w-4 text-teal-600" />
                                        Patient ID: {prescription.patientId}
                                    </h4>
                                </div>

                                {/* Appointment Information */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-teal-600" />
                                        Appointment ID: {prescription.appointmentId}
                                    </h4>
                                </div>

                                {/* Prescription Notes */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-teal-600" />
                                        Notes
                                    </h4>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {prescription.notes}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        data-test="edit-prescription-button"
                                        onClick={() => handleEdit(prescription)}
                                        className="flex-1 bg-teal-50 hover:bg-teal-100 text-teal-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-teal-200"
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </button>
                                    <button
                                        data-test="delete-prescription-button"
                                        onClick={() => handleDelete(prescription)}
                                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-red-200"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                    <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No prescriptions found</h3>
                    <p className="text-gray-600 mb-6">Start by creating your first prescription for a patient</p>
                    <button
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
                        onClick={() => (document.getElementById('create_prescription_modal') as HTMLDialogElement)?.showModal()}
                    >
                        <Plus className="h-5 w-5" />
                        Create Your First Prescription
                    </button>
                </div>
            )}

            {/* Summary Stats */}
            {prescriptionsData && prescriptionsData.data && prescriptionsData.data.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescriptions Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-teal-50 rounded-lg">
                            <div className="text-2xl font-bold text-teal-600">
                                {prescriptionsData.data.length}
                            </div>
                            <div className="text-sm text-gray-600">Total Prescriptions</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {new Set(prescriptionsData.data.map(p => p.patientId)).size}
                            </div>
                            <div className="text-sm text-gray-600">Unique Patients</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                KSh {prescriptionsData.data.reduce((total, p) => total + parseFloat(p.amount), 0).toFixed(0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Value</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-600">
                                KSh {(prescriptionsData.data.reduce((total, p) => total + parseFloat(p.amount), 0) / prescriptionsData.data.length).toFixed(0)}
                            </div>
                            <div className="text-sm text-gray-600">Average Amount</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorPrescriptions;