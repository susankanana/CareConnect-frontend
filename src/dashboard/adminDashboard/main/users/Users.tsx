import { useState } from 'react';
import { usersAPI, type TUser } from '../../../../reducers/users/usersAPI';
import {
  Users as UsersIcon,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  Settings,
  UserCheck,
  UserX,
  Crown,
  User,
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

  const handleChangeRole = (user: TUser) => {
    setSelectedUser(user);
    (document.getElementById('role_modal') as HTMLDialogElement)?.showModal();
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'user':
        return <User className="h-4 w-4 text-blue-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'user':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-700 text-lg font-semibold">Error fetching users</p>
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
              <UsersIcon className="h-7 w-7 text-blue-600" />
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage customer accounts and permissions - {usersData?.length || 0} users total
            </p>
          </div>
        </div>
      </div>

      {/* Change Role Modal */}
      <ChangeRole user={selectedUser} />

      {/* Users Grid */}
      {usersData && usersData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usersData.map((user: TUser) => (
            <div
              key={user.userId}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group"
            >
              {/* User Avatar Section */}
              <div className="h-24 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                  <User className="h-8 w-8 text-blue-600" />
                </div>

                {/* Verification Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      user.isVerified
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}
                  >
                    {user.isVerified ? (
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

              {/* User Details */}
              <div className="p-6">
                {/* User Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {user.firstName} {user.lastName}
                </h3>

                {/* Email */}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>

                {/* Role Badge */}
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Role:</span>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user.role || 'user')}`}
                  >
                    {getRoleIcon(user.role || 'user')}
                    {user.role || 'User'}
                  </span>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">
                      {user.isVerified ? (
                        <UserCheck className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <UserX className="h-5 w-5 text-yellow-600 mx-auto" />
                      )}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Status</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{user.userId}</div>
                    <div className="text-xs text-gray-600 mt-1">User ID</div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleChangeRole(user)}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-blue-200"
                >
                  <Settings className="h-4 w-4" />
                  Change Role
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">
            Users will appear here once they register for your car rental service
          </p>
        </div>
      )}

      {/* Summary Stats */}
      {usersData && usersData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{usersData.length}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {usersData.filter((user: TUser) => user.isVerified).length}
              </div>
              <div className="text-sm text-gray-600">Verified</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {usersData.filter((user: TUser) => !user.isVerified).length}
              </div>
              <div className="text-sm text-gray-600">Unverified</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {usersData.filter((user: TUser) => user.role === 'admin').length}
              </div>
              <div className="text-sm text-gray-600">Admins</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
