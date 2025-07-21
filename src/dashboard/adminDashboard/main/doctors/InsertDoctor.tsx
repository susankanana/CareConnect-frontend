import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usersAPI } from "../../../../reducers/users/usersAPI";
import { toast } from "sonner";

type CreateDoctorInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactPhone: string;
  address: string;
  specialization: string;
  availableDays: string[];
};

const schema: yup.ObjectSchema<CreateDoctorInputs> = yup.object({
  firstName: yup.string().max(50).required("First name is required"),
  lastName: yup.string().max(50).required("Last name is required"),
  email: yup.string().email("Invalid email").max(100).required("Email is required"),
  password: yup.string().min(6).max(255).required("Password is required"),
  contactPhone: yup.string().max(20).required("Contact phone is required"),
  address: yup.string().max(255).required("Address is required"),
  specialization: yup.string().max(100).required("Specialization is required"),
  availableDays: yup.array().of(yup.string().required()).min(1, "At least one day must be selected").required(),
});

type InsertDoctorProps = {
  refetch: () => void;
};

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const InsertDoctor = ({ refetch }: InsertDoctorProps) => {
  const [createUser, { isLoading }] = usersAPI.useCreateUsersMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateDoctorInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      availableDays: [],
    },
  });

  const watchedDays = watch("availableDays");

  const handleDayToggle = (day: string) => {
    const currentDays = watchedDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    setValue("availableDays", newDays);
  };

  const onSubmit: SubmitHandler<CreateDoctorInputs> = async (data) => {
    try {
      const payload = {
        ...data,
        role: "doctor" as const,
      };

      await createUser(payload).unwrap();
      toast.success("Doctor added successfully!");
      reset();
      refetch();
      (document.getElementById("create_doctor_modal") as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error creating doctor:", error);
      toast.error("Failed to add doctor. Please try again.");
    }
  };

  return (
    <dialog id="create_doctor_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg border border-gray-200">
        <div className="bg-gradient-to-r from-teal-500 to-pink-500 -m-6 mb-6 p-6 rounded-t-lg">
          <h3 className="font-bold text-lg text-white">Add New Doctor</h3>
          <p className="text-teal-100 text-sm mt-1">Register a new medical professional</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                {...register("firstName")}
                placeholder="John"
                className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
              />
              {errors.firstName && <span className="text-sm text-red-600">{errors.firstName.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                {...register("lastName")}
                placeholder="Doe"
                className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
              />
              {errors.lastName && <span className="text-sm text-red-600">{errors.lastName.message}</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="doctor@careconnect.co.ke"
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            />
            {errors.email && <span className="text-sm text-red-600">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register("password")}
              placeholder="Secure password"
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            />
            {errors.password && <span className="text-sm text-red-600">{errors.password.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              {...register("contactPhone")}
              placeholder="+254700123456"
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            />
            {errors.contactPhone && <span className="text-sm text-red-600">{errors.contactPhone.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              {...register("address")}
              placeholder="Doctor's address"
              className="textarea textarea-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
              rows={2}
            />
            {errors.address && <span className="text-sm text-red-600">{errors.address.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
            <input
              type="text"
              {...register("specialization")}
              placeholder="e.g., Cardiology, Neurology"
              className="input input-bordered w-full bg-white text-gray-800 border-gray-300 focus:border-teal-500"
            />
            {errors.specialization && <span className="text-sm text-red-600">{errors.specialization.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
            <div className="grid grid-cols-2 gap-2">
              {daysOfWeek.map((day) => (
                <label key={day} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={watchedDays?.includes(day) || false}
                    onChange={() => handleDayToggle(day)}
                    className="checkbox checkbox-sm checkbox-primary"
                  />
                  <span className="text-sm text-gray-700">{day}</span>
                </label>
              ))}
            </div>
            {errors.availableDays && <span className="text-sm text-red-600">{errors.availableDays.message}</span>}
          </div>

          <div className="modal-action">
            <button 
              type="submit" 
              className="btn bg-teal-600 hover:bg-teal-700 text-white border-none" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm" /> Adding...
                </>
              ) : (
                "Add Doctor"
              )}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                (document.getElementById("create_doctor_modal") as HTMLDialogElement)?.close();
                reset();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default InsertDoctor;