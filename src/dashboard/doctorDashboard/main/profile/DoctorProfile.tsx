import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { type RootState } from '../../../../app/store';
import { usersAPI } from '../../../../reducers/users/usersAPI';
import { logout } from '../../../../reducers/login/userSlice';
import UpdateProfile from './UpdateProfile';
import { Mail, ShieldCheck, CheckCircle, LogOut, Pencil, Fingerprint, Stethoscope } from 'lucide-react';

const DoctorProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const user_id = user.user?.user_id;

  const { data, isLoading, error, refetch } = usersAPI.useGetUserByIdQuery(user_id ?? 0, {
    skip: !user_id,
  });

  if (isLoading) return (
    <div className="flex justify-center p-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#003d3d]"></div>
    </div>
  );

  if (error) return (
    <div className="p-10 text-center">
      <p className="text-red-500 font-bold">Error loading clinician profile.</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-[#d91e5b] rounded-full" />
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          clinician <span className="text-[#003d3d]/40 font-medium">profile</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Identity Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm flex flex-col items-center text-center">
            <div className="relative group">
              <img
                src={data?.image_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                alt="Doctor Avatar"
                className="w-44 h-44 rounded-full border-4 border-white shadow-2xl object-cover ring-1 ring-gray-100"
              />
              <div className="absolute bottom-3 right-3 bg-white rounded-full p-1.5 shadow-lg border border-gray-50">
                <Stethoscope className="h-6 w-6 text-[#003d3d]" />
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-2xl font-black text-gray-900 leading-tight">
                Dr. {data?.firstName} <br /> {data?.lastName}
              </h2>
              <div className="inline-flex items-center gap-2 mt-3 px-4 py-1 bg-teal-50 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest">
                  Licensed {data?.role}
                </span>
              </div>
            </div>

            <div className="w-full pt-8 mt-8 border-t border-gray-50 space-y-3">
              <button
                onClick={() => (document.getElementById('update_profile_modal') as HTMLDialogElement)?.showModal()}
                className="w-full flex items-center justify-center gap-2 bg-[#d91e5b] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-pink-100 hover:scale-[1.01] transition-all"
              >
                <Pencil className="h-4 w-4" /> Update Profile
              </button>
              
              <button
                onClick={() => {
                  dispatch(logout());
                  navigate('/');
                }}
                className="w-full flex items-center justify-center gap-2 border-2 border-gray-100 text-gray-400 py-3.5 rounded-xl font-bold hover:bg-gray-50 hover:text-gray-600 transition-all"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Professional Details Card */}
        <div className="lg:col-span-8">
          <div className="bg-[#003d3d] rounded-[2rem] p-1 shadow-xl h-full">
            <div className="bg-white rounded-[1.8rem] h-full p-8 lg:p-12">
              <div className="flex items-center justify-between mb-10">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Professional Credentials
                </h4>
                {data?.isVerified && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg border border-green-100">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-[9px] font-bold text-green-700 uppercase tracking-tight">Verified Practitioner</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-wider mb-2">Contact Email</p>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-gray-800 font-semibold">{data?.email}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-wider mb-2">Practitioner ID</p>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center">
                      <Fingerprint className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-gray-800 font-mono font-bold tracking-tight">DOC-{data?.userId}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-wider mb-2">Account Authorization</p>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-gray-800 font-semibold uppercase text-sm tracking-tight">{data?.role} Access</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-wider mb-2">System Status</p>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center">
                      <CheckCircle className={`h-5 w-5 ${data?.isVerified ? 'text-green-500' : 'text-gray-300'}`} />
                    </div>
                    <span className="text-gray-800 font-semibold">
                      {data?.isVerified ? 'Fully Authenticated' : 'Verification Required'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative Footer */}
              <div className="mt-20 pt-8 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-[#003d3d] flex items-center justify-center text-white">
                    <Stethoscope size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#003d3d]">CareConnect Clinician Portal</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Medical Excellence</p>
                  </div>
                </div>
                <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  v2.0.4
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {data && <UpdateProfile user={data} refetch={refetch} />}
    </div>
  );
};

export default DoctorProfile;