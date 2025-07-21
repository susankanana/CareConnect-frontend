import { doctorsAPI, type TDoctor } from "../../../../reducers/doctors/doctorsAPI";
import { Edit, Trash2, Stethoscope, Star, CheckCircle, XCircle, Plus, Phone, Mail, Calendar } from "lucide-react";
import { useState } from "react";
import InsertDoctor from "./InsertDoctor";
import UpdateDoctor from "./UpdateDoctor";
import DeleteDoctor from "./DeleteDoctor";

const Doctors = () => {
    const { data: doctorsData, isLoading, error, refetch } = doctorsAPI.useGetDoctorsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 60000,
    });

    const [selectedDoctor, setSelectedDoctor] = useState<TDoctor | null>(null);
    const [doctorToDelete, setDoctorToDelete] = useState<TDoctor | null>(null);

    const handleEdit = (doctor: TDoctor) => {
        setSelectedDoctor(doctor);
        (document.getElementById('update_doctor_modal') as HTMLDialogElement)?.showModal();
    };

    const handleDelete = (doctor: TDoctor) => {
        setDoctorToDelete(doctor);
        (document.getElementById('delete_doctor_modal') as HTMLDialogElement)?.showModal();
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
                <p className="text-red-700 text-lg font-semibold">Error fetching doctors</p>
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
                            <Stethoscope className="h-7 w-7 text-teal-600" />
                            Doctors Management
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage medical staff - {doctorsData?.data?.length || 0} doctors total
                        </p>
                    </div>
                    <button
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-md"
                        onClick={() => (document.getElementById('create_doctor_modal') as HTMLDialogElement)?.showModal()}
                    >
                        <Plus className="h-5 w-5" />
                        Add New Doctor
                    </button>
                </div>
            </div>

            {/* Modals */}
            <InsertDoctor refetch={refetch} />
            <UpdateDoctor doctor={selectedDoctor} refetch={refetch} />
            <DeleteDoctor doctor={doctorToDelete} refetch={refetch} />

            {/* Doctors Grid */}
            {doctorsData && doctorsData.data && doctorsData.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctorsData.data.map((doctor: TDoctor) => (
                        <div
                            key={doctor.doctor.doctorId}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group"
                        >
                            {/* Doctor Image */}
                            <div className="h-48 bg-gradient-to-br from-teal-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
                                <img
                                    src={doctor.user.image_url || 'https://via.placeholder.com/400'}
                                    alt={`Dr. ${doctor.user.firstName} ${doctor.user.lastName}`}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                                
                                {/* Verification Badge */}
                                <div className="absolute top-3 right-3">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                        doctor.user.isVerified 
                                            ? 'bg-green-100 text-green-800 border border-green-200' 
                                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                    }`}>
                                        {doctor.user.isVerified ? (
                                            <>
                                                <CheckCircle className="h-3 w-3" />
                                                Verified
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-3 w-3" />
                                                Unverified
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Doctor Details */}
                            <div className="p-6">
                                {/* Doctor Name & Specialization */}
                                <div className="text-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                                        Dr. {doctor.user.firstName} {doctor.user.lastName}
                                    </h3>
                                    <p className="text-teal-600 font-semibold">{doctor.doctor.specialization}</p>
                                    {doctor.doctor.rating && (
                                        <div className="flex items-center justify-center gap-1 mt-2">
                                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                            <span className="text-sm font-medium">{doctor.doctor.rating}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Mail className="h-4 w-4 text-teal-500" />
                                        <span className="text-sm truncate">{doctor.user.email}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Phone className="h-4 w-4 text-teal-500" />
                                        <span className="text-sm">{doctor.user.contactPhone}</span>
                                    </div>
                                </div>

                                {/* Available Days */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-teal-600" />
                                        Available Days
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                        {doctor.doctor.availableDays?.map((day, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full"
                                            >
                                                {day}
                                            </span>
                                        )) || <span className="text-gray-500 text-sm">Not specified</span>}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="text-lg font-bold text-gray-900">
                                            {doctor.doctor.experience || 'N/A'}
                                        </div>
                                        <div className="text-xs text-gray-600">Years Exp.</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="text-lg font-bold text-gray-900">
                                            {doctor.doctor.patients || 'N/A'}
                                        </div>
                                        <div className="text-xs text-gray-600">Patients</div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(doctor)}
                                        className="flex-1 bg-teal-50 hover:bg-teal-100 text-teal-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-teal-200"
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doctor)}
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
                    <Stethoscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
                    <p className="text-gray-600 mb-6">Get started by adding your first medical professional</p>
                    <button
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
                        onClick={() => (document.getElementById('create_doctor_modal') as HTMLDialogElement)?.showModal()}
                    >
                        <Plus className="h-5 w-5" />
                        Add Your First Doctor
                    </button>
                </div>
            )}

            {/* Summary Stats */}
            {doctorsData && doctorsData.data && doctorsData.data.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Staff Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-teal-50 rounded-lg">
                            <div className="text-2xl font-bold text-teal-600">
                                {doctorsData.data.length}
                            </div>
                            <div className="text-sm text-gray-600">Total Doctors</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {doctorsData.data.filter((doctor: TDoctor) => doctor.user.isVerified).length}
                            </div>
                            <div className="text-sm text-gray-600">Verified</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {new Set(doctorsData.data.map((doctor: TDoctor) => doctor.doctor.specialization)).size}
                            </div>
                            <div className="text-sm text-gray-600">Specializations</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-600">
                                {(doctorsData.data.reduce((avg: number, doctor: TDoctor) => avg + (doctor.doctor.rating || 0), 0) / doctorsData.data.length).toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-600">Avg. Rating</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Doctors;