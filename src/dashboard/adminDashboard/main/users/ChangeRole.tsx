import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usersAPI, type TUser } from "../../../../../src/reducers/users/usersAPI";
import { toast } from "sonner";
import { useEffect } from "react";

type ChangeRoleProps = {
  user: TUser | null;
};

type ChangeRoleInputs = {
  role: "user" | "admin";
};

const schema = yup.object({
  role: yup.string().oneOf(["user", "admin"]).required("Role is required"),
});

const ChangeRole = ({ user }: ChangeRoleProps) => {
  const [updateUser, { isLoading }] = usersAPI.useUpdateUserMutation(
    { fixedCacheKey: "updateUser" }
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ChangeRoleInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      role: user ? (user.role as "user" | "admin") : "user", // Default to user's current role or "user"
    },
  });

  // Update form value when user changes
  // (so the modal always shows the correct role)
  useEffect(() => {
    if (user) {
      setValue("role", user.role as "user" | "admin"); // Set the role based on the user object
    } else {
      reset();
    }
  }, [user, setValue, reset]);

  const onSubmit: SubmitHandler<ChangeRoleInputs> = async (data) => {
    try {
      if (!user) {
        toast.error("No user selected for role change.");
        return;
      }
      await updateUser({ id: user.userId, role: data.role });
      toast.success("Role updated successfully!");
      reset();
      (document.getElementById('role_modal') as HTMLDialogElement)?.close();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role. Please try again.");
    }
  };

  return (
    <dialog id="role_modal" className="modal sm:modal-middle">
      <div className="modal-box bg-white text-gray-900 w-full max-w-xs sm:max-w-lg mx-auto rounded-2xl shadow-xl p-6">
        <h3 data-test="change-role-modal-title" className="font-bold text-2xl mb-5 text-center">
          Change Role for {user?.firstName} {user?.lastName}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" data-test="change-role-form">
          <label htmlFor="role-select" className="text-gray-700 font-medium" data-test="role-select-label">Select Role:</label>
          <select
            data-test="role-select"
            id="role-select"
            {...register("role")}
            className="select select-bordered w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && (
            <span data-test="role-error" className="text-sm text-red-600 mt-1">{errors.role.message}</span>
          )}

          <div className="modal-action flex flex-col sm:flex-row gap-3 mt-6">
            <button
              data-test="change-role-button"
              type="submit"
              className="btn bg-gradient-to-r from-teal-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-teal-600 hover:to-pink-600 transition-all font-semibold w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner text-white h-5 w-5" /> Updating...
                </>
              ) : "Update Role"}
            </button>
            <button
              data-test="cancel-change-role"
              className="btn border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold w-full sm:w-auto"
              type="button"
              onClick={() => {
                (document.getElementById('role_modal') as HTMLDialogElement)?.close();
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

export default ChangeRole;