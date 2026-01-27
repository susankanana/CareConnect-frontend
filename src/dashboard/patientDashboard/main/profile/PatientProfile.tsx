import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { type RootState } from '../../../../app/store';
import { usersAPI } from '../../../../reducers/users/usersAPI';
import { logout } from '../../../../reducers/login/userSlice';
import UpdateProfile from './UpdateProfile';
import { Mail, ShieldCheck, CheckCircle, LogOut, Pencil, Fingerprint } from 'lucide-react';

const PatientProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const user_id = user.user?.user_id;

  const { data, isLoading, error, refetch } = usersAPI.useGetUserByIdQuery(user_id ?? 0, {
    skip: !user_id,
  });

  if (isLoading) return (
    <div className="flex justify-center p-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003d3d]"></div>
    </div>
  );

  if (error) return (
    <div className="p-10 text-center">
      <p className="text-red-500 font-bold">Error loading profile. Please try again.</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1.5 h-6 bg-[#d91e5b] rounded-full" />
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          personal <span className="text-[#003d3d]/40 font-medium">profile</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={data?.image_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                alt="User Avatar"
                className="w-40 h-40 rounded-full border-4 border-white shadow-xl object-cover"
              />
              {data?.isVerified && (
                <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-lg">
                  <CheckCircle className="h-8 w-8 text-green-500" fill="currentColor" fillOpacity="0.1" />
                </div>
              )}
            </div>
            
            <h2 className="mt-6 text-2xl font-black text-gray-900 leading-tight">
              {data?.firstName} <br /> {data?.lastName}
            </h2>
            <p className="text-sm font-bold text-teal-600 uppercase tracking-widest mt-2">
              {data?.role}
            </p>

            <div className="w-full pt-6 mt-6 border-t border-gray-50 flex flex-col gap-3">
               <button
                onClick={() => (document.getElementById('update_profile_modal') as HTMLDialogElement)?.showModal()}
                className="w-full flex items-center justify-center gap-2 bg-[#d91e5b] text-white py-3 rounded-xl font-bold shadow-lg shadow-pink-100 hover:scale-[1.02] transition-all"
              >
                <Pencil className="h-4 w-4" /> Update Profile
              </button>
              
              <button
                onClick={() => {
                  dispatch(logout());
                  navigate('/');
                }}
                className="w-full flex items-center justify-center gap-2 border-2 border-gray-100 text-gray-400 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Details Card */}
        <div className="lg:col-span-2">
          <div className="bg-[#003d3d] rounded-[2rem] p-1 shadow-xl overflow-hidden h-full">
            <div className="bg-white rounded-[1.8rem] h-full p-8 lg:p-12">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">
                Account Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-wider">Email Address</p>
                  <div className="flex items-center gap-3 mt-1">
                    <Mail className="h-5 w-5 text-gray-300" />
                    <span className="text-gray-700 font-semibold">{data?.email}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-wider">Verification Status</p>
                  <div className="flex items-center gap-3 mt-1">
                    <ShieldCheck className={`h-5 w-5 ${data?.isVerified ? 'text-green-500' : 'text-amber-500'}`} />
                    <span className="text-gray-700 font-semibold">
                      {data?.isVerified ? 'Verified Account' : 'Pending Verification'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-wider">System Identifier</p>
                  <div className="flex items-center gap-3 mt-1">
                    <Fingerprint className="h-5 w-5 text-gray-300" />
                    <span className="text-gray-700 font-mono font-bold">UID-{data?.userId}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-wider">Account Role</p>
                  <div className="flex items-center gap-3 mt-1">
                    <CheckCircle className="h-5 w-5 text-gray-300" />
                    <span className="text-gray-700 font-semibold capitalize">{data?.role} Access</span>
                  </div>
                </div>
              </div>

              {/* Decorative Brand Element */}
              <div className="mt-16 pt-8 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-900">CareConnect Health</p>
                  <p className="text-[10px] text-gray-400 font-medium">Secure Patient Portal v2.0</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 font-black text-[10px]">
                  CC
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {data && <UpdateProfile user={data} refetch={refetch} />}
    </div>
  );
};

export default PatientProfile;