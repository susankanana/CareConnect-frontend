import { useState, useEffect } from "react";
import { doctorsAPI, type TDoctor } from "../../../../reducers/doctors/doctorsAPI";
import { Search, Stethoscope, Star, Calendar, Phone, Mail, XCircle, MapPin } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import { appointmentsAPI } from "../../../../reducers/appointments/appointmentsAPI";
import { toast } from "sonner";

// --- Appointment Booking Logic (Moved and adapted from CreateAppointment) ---

type CreateAppointmentInputs = {
  doctorId: number;
  appointmentDate: string;
  timeSlot: string;
};

const appointmentSchema = yup.object({
  doctorId: yup.number().required('Please select a doctor'),
  appointmentDate: yup
    .string()
    .required('Appointment date is required')
    .test('future-date', 'Appointment date must be in the future', function(value) {
      if (!value) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const appointmentDate = new Date(value);
      return appointmentDate >= today;
    }),
  timeSlot: yup.string().required('Please select a time slot'),
});

const timeSlots = [
  "09:00:00", "09:30:00", "10:00:00", "10:30:00", "11:00:00", "11:30:00",
  "14:00:00", "14:30:00", "15:00:00", "15:30:00", "16:00:00", "16:30:00"
];

const DEFAULT_CONSULTATION_FEE = "6500.00";

const PatientDoctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [doctorToBook, setDoctorToBook] = useState<TDoctor | null>(null);

  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?.user_id;

  const { data: doctorsData, isLoading, error, refetch: refetchDoctors } = doctorsAPI.useGetDoctorsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const { data: specializationData } = doctorsAPI.useGetDoctorBySpecializationQuery(
    selectedSpecialization,
    { skip: !selectedSpecialization }
  );

  const [createAppointment, { isLoading: isBookingLoading }] = appointmentsAPI.useCreateAppointmentMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue, // Added setValue to programmatically set doctorId
    formState: { errors },
  } = useForm<CreateAppointmentInputs>({
    resolver: yupResolver(appointmentSchema),
  });

  const watchedValues = watch();

  useEffect(() => {
    if (doctorToBook) {
      setValue("doctorId", doctorToBook.doctor?.doctorId || 0);
    }
  }, [doctorToBook, setValue]);

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

  const handleBookAppointmentClick = (doctor: TDoctor) => {
    setDoctorToBook(doctor);
    // Open the modal using the dialog element's showModal() method
    const modal = document.getElementById("create_appointment_modal") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const handleCloseModal = () => {
    setDoctorToBook(null);
    reset(); // Reset form fields when modal closes
    const modal = document.getElementById("create_appointment_modal") as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  const onSubmit: SubmitHandler<CreateAppointmentInputs> = async (data) => {
    try {
      if (!userId) {
        toast.error("User ID not found. Please login again.");
        return;
      }

      const payload = {
        ...data,
        userId,
        doctorId: Number(data.doctorId),
        totalAmount: DEFAULT_CONSULTATION_FEE,
      };

      await createAppointment(payload).unwrap();
      toast.success("Appointment booked successfully!");
      handleCloseModal(); // Close modal on success
      refetchDoctors(); // Refetch doctors to update any relevant data, like patient counts if applicable
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  const formatTimeSlot = (timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const isDateAvailable = (dateString: string, doctor: TDoctor) => {
    if (!doctor || !doctor.doctor?.availableDays) return false;
    const dayName = getDayName(dateString);
    // Ensure doctor.doctor.availableDays is an array and includes the dayName
    return Array.isArray(doctor.doctor.availableDays) && doctor.doctor.availableDays.includes(dayName);
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
                data-test="search-doctor-input"
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
                data-test="specialization-filter"
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
              data-test="doctor-card"
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
                  <h3 data-test="doctor-name" className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
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
                <button
                  data-test="book-appointment-btn"
                  onClick={() => handleBookAppointmentClick(doctor)}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
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
              data-test="clear-filters-btn"
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
            <div data-test="summary-total-doctors" className="text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-2xl font-bold text-teal-600">
                {doctorsData.data.length}
              </div>
              <div className="text-sm text-gray-600">Total Doctors</div>
            </div>
            <div data-test="summary-specializations" className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {specializations.length}
              </div>
              <div className="text-sm text-gray-600">Specializations</div>
            </div>
            <div data-test="summary-verified" className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {doctorsData.data.filter((doctor: TDoctor) => doctor.user?.isVerified).length}
              </div>
              <div className="text-sm text-gray-600">Verified</div>
            </div>
            <div data-test="summary-showing" className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {filteredDoctors().length}
              </div>
              <div className="text-sm text-gray-600">Showing</div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <dialog id="create_appointment_modal" className="modal sm:modal-middle">
        <div className="modal-box bg-white w-full max-w-xs sm:max-w-2xl mx-auto rounded-lg border border-gray-200">
          <div className="bg-gradient-to-r from-teal-500 to-pink-500 -m-6 mb-6 p-6 rounded-t-lg">
            <h3 className="font-bold text-lg text-white">Book New Appointment</h3>
            <p className="text-teal-100 text-sm mt-1">Schedule your consultation with our doctors</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} data-test="create-appointment-form" className="flex flex-col gap-6">
            {/* Doctor Selection (pre-selected if opened from a doctor card) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor</label>
              <select
                data-test="doctor-select"
                {...register("doctorId", { valueAsNumber: true })}
                className="select select-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
                disabled={!!doctorToBook} // Disable if a doctor is already selected
              >
                <option value="">Choose a doctor</option>
                {doctorsData?.data?.map((doctor: TDoctor) => (
                  <option key={doctor.doctor?.doctorId} value={doctor.doctor?.doctorId}>
                    Dr. {doctor.user?.firstName} {doctor.user?.lastName} - {doctor.doctor?.specialization}
                  </option>
                ))}
              </select>
              {errors.doctorId && <span className="text-sm text-red-600">{errors.doctorId.message}</span>}
            </div>

            {/* Selected Doctor Info */}
            {doctorToBook && (
              <div className="bg-teal-50 rounded-lg p-4">
                <h4 className="font-semibold text-teal-800 mb-2">Selected Doctor</h4>
                <div className="flex items-center gap-4">
                  <img
                    src={doctorToBook.user?.image_url || 'https://via.placeholder.com/400'}
                    alt={`Dr. ${doctorToBook.user?.firstName}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      Dr. {doctorToBook.user?.firstName} {doctorToBook.user?.lastName}
                    </p>
                    <p className="text-sm text-teal-600">{doctorToBook.doctor?.specialization}</p>
                    <p className="text-sm text-gray-600">
                      Available: {doctorToBook.doctor?.availableDays?.join(', ') || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date</label>
              <input
                data-test="appointment-date-input"
                type="date"
                {...register("appointmentDate")}
                min={new Date().toISOString().split('T')[0]}
                className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
              />
              {errors.appointmentDate && <span className="text-sm text-red-600">{errors.appointmentDate.message}</span>}

              {doctorToBook && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                  <strong>Doctor Availability:</strong> {doctorToBook.doctor?.availableDays?.join(', ') || 'Not specified'}
                </div>
              )}

              {doctorToBook && watchedValues.appointmentDate && !isDateAvailable(watchedValues.appointmentDate, doctorToBook) && (
                <p className="text-sm text-red-600 mt-1">
                  Doctor is not available on {getDayName(watchedValues.appointmentDate)}.
                </p>
              )}

            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
              <select
                data-test="appointment-time-slot-select"
                {...register("timeSlot")}
                className="select select-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
                disabled={!doctorToBook || !watchedValues.appointmentDate}
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {formatTimeSlot(slot)}
                  </option>
                ))}
              </select>
              {errors.timeSlot && <span className="text-sm text-red-600">{errors.timeSlot.message}</span>}
            </div>

            {/* Consultation Fee */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Consultation Fee</span>
                <span className="text-2xl font-bold text-teal-600">
                  KSh {parseFloat(DEFAULT_CONSULTATION_FEE).toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Payment due at appointment</p>
            </div>

            <div className="modal-action">
              <button
                data-test="submit-appointment-btn"
                type="submit"
                className="btn bg-teal-600 hover:bg-teal-700 text-white border-none"
                disabled={isBookingLoading}
              >
                {isBookingLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" /> Booking...
                  </>
                ) : (
                  "Book Appointment"
                )}
              </button>
              <button
                data-test="cancel-appointment-btn"
                type="button"
                className="btn btn-ghost"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default PatientDoctors;