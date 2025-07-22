import { useState } from "react";
import { doctorsAPI, type TDoctor } from "../../../../reducers/doctors/doctorsAPI";
import { Search, Stethoscope, Star, Calendar, Phone, Mail, XCircle, MapPin } from "lucide-react";

const PatientDoctors = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialization, setSelectedSpecialization] = useState("");

    const { data: doctorsData, isLoading, error } = doctorsAPI.useGetDoctorsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 60000,
    });

    const { data: specializationData } = doctorsAPI.useGetDoctorBySpecializationQuery(
        selectedSpecialization,
        { skip: !selectedSpecialization }
    );

    // Get unique specializations for filter dropdown
    const specializations = doctorsData?.data 
        ? [...new Set(doctorsData.data.map(doctor => doctor.doctor?.specialization).filter(Boolean))]
        : [];

    // Filter doctors based on search term and specialization
    const filteredDoctors = () => {
        let doctors = selectedSpecialization ? specializationData?.data || [] : doctorsData?.data || [];
        
        if (searchTerm) {
            doctors = doctors.filter(doctor => 
                doctor.doctor?.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return doctors;
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
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Stethoscope className="h-7 w-7 text-teal-600" />
                            Find a Doctor
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Browse our medical professionals - {doctorsData?.data?.length || 0} doctors available
                        </p>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by doctor name or specialization..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input input-bordered w-full pl-10 bg-white text-gray-800 border-gray-300 focus:border-teal-500"
                            />
                        </div>

                        {/* Specialization Filter */}
                        <div className="sm:w-64">
                            <select
                                value={selectedSpecialization}
                                onChange={(e) => setSelectedSpecialization(e.target.value)}
                                className="select select-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
                            >
                                <option value="">All Specializations</option>
                                {specializations.map((spec) => (
                                    <option key={spec} value={spec}>
                                        {spec}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Doctors Grid */}
            {filteredDoctors().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors().map((doctor: TDoctor) => (
                        <div
                            key={doctor.doctor?.doctorId}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group"
                        >
                            {/* Doctor Image */}
                            <div className="h-48 bg-gradient-to-br from-teal-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
                                <img
                                    src={doctor.user?.image_url || 'https://via.placeholder.com/400'}
                                    alt={`Dr. ${doctor.user?.firstName} ${doctor.user?.lastName}`}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                                
                                {/* Verification Badge */}
                                <div className="absolute top-3 right-3">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                        doctor.user?.isVerified 
                                            ? 'bg-green-100 text-green-800 border border-green-200' 
                                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                    }`}>
                                        {doctor.user?.isVerified ? 'Verified' : 'Unverified'}
                                    </span>
                                </div>
                            </div>

                            {/* Doctor Details */}
                            <div className="p-6">
                                {/* Doctor Name & Specialization */}
                                <div className="text-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                                        Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                                    </h3>
                                    <p className="text-teal-600 font-semibold">{doctor.doctor?.specialization}</p>
                                    {doctor.doctor?.rating && (
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
                                        <span className="text-sm truncate">{doctor.user?.email}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Phone className="h-4 w-4 text-teal-500" />
                                        <span className="text-sm">{doctor.user?.contactPhone}</span>
                                    </div>

                                    <div className="flex items-center gap-3 text-gray-600">
                                        <MapPin className="h-4 w-4 text-teal-500" />
                                        <span className="text-sm">{doctor.user?.address || 'Address not provided'}</span>
                                    </div>
                                </div>

                                {/* Available Days */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-teal-600" />
                                        Available Days
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                        {doctor.doctor?.availableDays?.map((day, index) => (
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
                                            {doctor.doctor?.experience || 'N/A'}
                                        </div>
                                        <div className="text-xs text-gray-600">Years Exp.</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="text-lg font-bold text-gray-900">
                                            {doctor.doctor?.patients || 'N/A'}
                                        </div>
                                        <div className="text-xs text-gray-600">Patients</div>
                                    </div>
                                </div>

                                {/* Book Appointment Button */}
                                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                    <Stethoscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm || selectedSpecialization 
                            ? "Try adjusting your search criteria" 
                            : "No doctors are currently available"
                        }
                    </p>
                    {(searchTerm || selectedSpecialization) && (
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedSpecialization("");
                            }}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            )}

            {/* Summary Stats */}
            {doctorsData && doctorsData.data && doctorsData.data.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Staff Overview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-teal-50 rounded-lg">
                            <div className="text-2xl font-bold text-teal-600">
                                {doctorsData.data.length}
                            </div>
                            <div className="text-sm text-gray-600">Total Doctors</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {specializations.length}
                            </div>
                            <div className="text-sm text-gray-600">Specializations</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {doctorsData.data.filter((doctor: TDoctor) => doctor.user?.isVerified).length}
                            </div>
                            <div className="text-sm text-gray-600">Verified</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-600">
                                {filteredDoctors().length}
                            </div>
                            <div className="text-sm text-gray-600">Showing</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDoctors;