import { useState } from 'react';
import { usersAPI, type TUser } from '../../../../reducers/users/usersAPI';
import {
  Users as UsersIcon,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  Settings,
  Crown,
  User,
  Search,
  Fingerprint,
  Loader,
} from 'lucide-react';
import ChangeRole from './ChangeRole';

const Users = () => {
  const {
    data: usersData,
    isLoading,
    error,
  } = usersAPI.useGetUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const users = usersData || [];

  const filteredUsers = users.filter((user: TUser) => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangeRole = (user: TUser) => {
    setSelectedUser(user);
    (document.getElementById('role_modal') as HTMLDialogElement)?.showModal();
  };

  const getRoleStyles = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return { 
          container: 'bg-white border-pink-200 text-pink-600', 
          icon: <Crown className="h-3 w-3" /> 
        };
      default:
        return { 
          container: 'bg-white border-teal-200 text-teal-600', 
          icon: <User className="h-3 w-3" /> 
        };
    }
  };

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
      <Loader className="animate-spin text-teal-600" size={40} />
      <p className="text-gray-500 font-bold tracking-tight text-sm">Syncing Directory...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-10">
      {/* Updated Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-teal-50 p-4 rounded-2xl">
            <UsersIcon className="h-8 w-8 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Identity Hub</h1>
            <p className="text-gray-400 text-sm font-semibold mt-1">
               Permission Management • {users.length} Records
            </p>
          </div>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-semibold outline-none focus:ring-2 ring-teal-500/20 transition-all" 
          />
        </div>
      </div>

      <ChangeRole user={selectedUser} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredUsers.map((user: TUser) => {
          const roleStyle = getRoleStyles(user.role || 'user');
          return (
            <div key={user.userId} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
              
              <div className="p-5 flex justify-between items-center bg-gray-50/50 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Fingerprint size={14} className="text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ID: {user.userId}</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${
                  user.isVerified ? 'bg-white border-green-200 text-green-600' : 'bg-white border-amber-200 text-amber-600'
                }`}>
                  {user.isVerified ? 'Verified' : 'Pending'}
                </div>
              </div>

              <div className="p-7 space-y-6 grow">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-100 shrink-0">
                    <User size={32} />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-black text-gray-900 text-xl leading-none tracking-tight truncate">
                      {user.firstName} {user.lastName}
                    </h3>
                    <div className="flex items-center mt-3">
                       <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${roleStyle.container}`}>
                          {roleStyle.icon}
                          {user.role || 'User'}
                       </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Mail size={16} className="text-pink-500" />
                  </div>
                  <span className="text-xs font-bold text-gray-600 truncate">{user.email}</span>
                </div>

                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Access Status</p>
                   <div className="flex items-center gap-2">
                     <div className={`h-2 w-2 rounded-full ${user.isVerified ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></div>
                     <p className="text-sm font-black text-gray-800 tracking-tighter">
                       {user.isVerified ? 'Active Access' : 'Restricted Access'}
                     </p>
                   </div>
                </div>
              </div>

              <div className="p-6 pt-0 mt-auto">
                <button
                  onClick={() => handleChangeRole(user)}
                  className="w-full border border-teal-400 text-teal-600 bg-teal-50/30 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-teal-600 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Settings size={14} /> Modify Permissions
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* NEW FOOTER: Removed black, used Deep Teal Gradient */}
      <div className="bg-gradient-to-r from-[#004d4d] to-[#006666] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl -mr-40 -mt-40"></div>
        <h3 className="text-xl font-black mb-10 flex items-center gap-3 tracking-tighter uppercase">
          <div className="w-1.5 h-6 bg-teal-400 rounded-full"></div> 
          Network Statistics
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Total Users', value: users.length, color: 'text-white' },
            { label: 'Admins', value: users.filter((u:any) => u.role === 'admin').length, color: 'text-pink-300' },
            { label: 'Verified', value: users.filter((u:any) => u.isVerified).length, color: 'text-teal-300' },
            { label: 'Unverified', value: users.filter((u:any) => !u.isVerified).length, color: 'text-amber-300' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
              <p className="text-[10px] font-bold text-teal-100/60 uppercase tracking-widest mb-2">{stat.label}</p>
              <div className={`text-2xl font-black ${stat.color} tracking-tight`}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;