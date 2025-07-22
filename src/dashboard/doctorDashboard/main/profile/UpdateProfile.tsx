import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usersAPI } from "../../../../reducers/users/usersAPI"; // Adjusted path based on your provided code
import { toast } from "sonner";
import { useEffect } from "react";

type UpdateProfileInputs = {
    firstName: string;
    lastName: string;
    image_url: string;
};

const schema = yup.object({
    firstName: yup.string().max(50, "Max 50 characters").required("First name is required"),
    lastName: yup.string().max(50, "Max 50 characters").required("Last name is required"),
    image_url: yup.string().url("Invalid URL").required("Image URL is required"),
});

interface User {
    userId: string | number;
    firstName?: string;
    lastName?: string;
    image_url?: string;
}

interface UpdateProfileProps {
    user: User;
    refetch?: () => void;
}

const UpdateProfile = ({ user, refetch }: UpdateProfileProps) => {
    const [updateUser, { isLoading }] = usersAPI.useUpdateUserMutation(
        { fixedCacheKey: "updateUser" }
    );

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch, // Keep watch for the image preview
        formState: { errors },
    } = useForm<UpdateProfileInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            image_url: user?.image_url || "",
        },
    });

    // Watch the image_url field for live preview
    const imageUrlValue = watch("image_url");

    // Update form values when user changes
    useEffect(() => {
        if (user) {
            setValue("firstName", user.firstName || "");
            setValue("lastName", user.lastName || "");
            setValue("image_url", user.image_url || "");
        } else {
            reset();
        }
    }, [user, setValue, reset]);

    const onSubmit: SubmitHandler<UpdateProfileInputs> = async (data) => {
        try {
            // Ensure customerID is passed correctly, assuming user.customerID is the correct ID field
            await updateUser({ id: Number(user.userId), ...data });

            toast.success("Profile updated successfully!");
            if (refetch) {
                refetch(); // Call refetch if provided
            }
            reset();
            (document.getElementById('update_profile_modal') as HTMLDialogElement)?.close();
        } catch (error) {
            console.error("Error updating profile:", error); // Use console.error for errors
            toast.error("Failed to update profile. Please try again.");
        }
    };

    return (
        <dialog id="update_profile_modal" className="modal sm:modal-middle">
            <div className="modal-box bg-white text-gray-900 w-full max-w-xs sm:max-w-lg mx-auto rounded-2xl p-6 shadow-2xl">
                <h3 className="font-bold text-2xl mb-6 text-center">Update Profile</h3>

                {/* Image Preview Section */}
                {imageUrlValue && (
                    <div className="mb-6 flex justify-center"> {/* Centered container for the image */}
                        <img
                            src={imageUrlValue}
                            alt="Profile Preview"
                            className="w-32 h-32 object-cover rounded-full border-2 border-teal-300 shadow-md" // Increased size, added teal border, and shadow
                            onError={(e) => {
                                // Fallback to a generic avatar if the URL is broken
                                e.currentTarget.src = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
                                e.currentTarget.onerror = null; // Prevent infinite loop if fallback also fails
                            }}
                        />
                    </div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <div>
                        <input
                            type="text"
                            {...register("firstName")}
                            placeholder="First Name"
                            className="input bg-gray-50 border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg text-gray-800 transition-all duration-200"
                        />
                        {errors.firstName && (
                            <span className="text-sm text-red-600 mt-1 block">{errors.firstName.message}</span>
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            {...register("lastName")}
                            placeholder="Last Name"
                            className="input bg-gray-50 border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg text-gray-800 transition-all duration-200"
                        />
                        {errors.lastName && (
                            <span className="text-sm text-red-600 mt-1 block">{errors.lastName.message}</span>
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            {...register("image_url")}
                            placeholder="Image URL"
                            className="input bg-gray-50 border border-gray-300 rounded-lg w-full p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg text-gray-800 transition-all duration-200"
                        />
                        {errors.image_url && (
                            <span className="text-sm text-red-600 mt-1 block">{errors.image_url.message}</span>
                        )}
                    </div>

                    <div className="modal-action flex flex-col sm:flex-row gap-3 mt-4">
                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-pink-500 text-white py-3 px-6 rounded-lg hover:from-teal-600 hover:to-pink-600 transition-all font-semibold text-lg flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner text-white h-5 w-5" /> Updating...
                                </>
                            ) : (
                                "Update Profile"
                            )}
                        </button>
                        <button
                            className="w-full sm:w-auto border-2 border-teal-600 text-teal-600 px-6 py-3 rounded-lg hover:bg-teal-50 transition-colors font-semibold text-lg"
                            type="button"
                            onClick={() => {
                                (document.getElementById('update_profile_modal') as HTMLDialogElement)?.close();
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

export default UpdateProfile;