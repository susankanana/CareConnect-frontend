import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { type RootState } from '../../../../app/store';
import { usersAPI } from '../../../../reducers/users/usersAPI';
import { logout } from '../../../../reducers/login/userSlice';
import UpdateProfile from './UpdateProfile';
import { Mail, UserCircle, ShieldCheck, CheckCircle, LogOut, Pencil } from 'lucide-react';

const PatientProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const user_id = user.user?.user_id;

  const { data, isLoading, error, refetch } = usersAPI.useGetUserByIdQuery(user_id ?? 0, {
    skip: !user_id,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      {isLoading ? (
        <p className="text-center text-lg text-gray-700">Loading...</p>
      ) : error ? (
        <p className="text-center text-lg text-red-500">Error loading profile</p>
      ) : (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={
                data?.image_url ||
                'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
              }
              alt="User Avatar"
              className="w-32 h-32 rounded-full border-2 border-teal-400 object-cover"
              onError={() => console.warn('Image failed to load:', data?.image_url)}
            />
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <UserCircle className="h-6 w-6 text-teal-600" />
                {data?.firstName} {data?.lastName}
              </h2>
              <p className="text-gray-600 flex items-center gap-2">
                <Mail className="h-4 w-4 text-pink-600" />
                {data?.email}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                Role: {data?.role}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                Verified: {data?.isVerified ? 'Yes' : 'No'}
              </p>
              <p className="text-gray-600">User ID: {data?.userId}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              data-test="update-profile-btn"
              onClick={() =>
                (document.getElementById('update_profile_modal') as HTMLDialogElement)?.showModal()
              }
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-teal-600 hover:to-pink-600 transition-all font-semibold"
            >
              <Pencil className="h-4 w-4" />
              Update Profile
            </button>

            <button
              onClick={() => {
                dispatch(logout());
                navigate('/');
              }}
              className="flex items-center justify-center gap-2 border-2 border-teal-600 text-teal-600 px-6 py-3 rounded-lg hover:bg-teal-50 transition-colors font-semibold"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {data && <UpdateProfile user={data} refetch={refetch} />}
    </div>
  );
};

export default PatientProfile;
