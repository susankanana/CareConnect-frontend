import { complaintsAPI, type TComplaint } from '../../../../reducers/complaints/complaintsAPI';
import {
  Edit,
  Trash2,
  MessageSquare,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import UpdateComplaint from './UpdateComplaint';
import DeleteComplaint from './DeleteComplaint';
import ChangeStatus from './ChangeStatus';

const Complaints = () => {
  const {
    data: complaintsData,
    isLoading,
    error,
    refetch,
  } = complaintsAPI.useGetComplaintsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const [selectedComplaint, setSelectedComplaint] = useState<TComplaint | null>(null);
  const [complaintToDelete, setComplaintToDelete] = useState<TComplaint | null>(null);
  const [complaintToChangeStatus, setComplaintToChangeStatus] = useState<TComplaint | null>(null);

  const handleEdit = (complaint: TComplaint) => {
    setSelectedComplaint(complaint);
    (document.getElementById('update_complaint_modal') as HTMLDialogElement)?.showModal();
  };

  const handleDelete = (complaint: TComplaint) => {
    setComplaintToDelete(complaint);
    (document.getElementById('delete_complaint_modal') as HTMLDialogElement)?.showModal();
  };

  const handleChangeStatus = (complaint: TComplaint) => {
    setComplaintToChangeStatus(complaint);
    (document.getElementById('change_status_modal') as HTMLDialogElement)?.showModal();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="h-3 w-3" />;
      case 'In Progress':
        return <Clock className="h-3 w-3" />;
      case 'Resolved':
        return <CheckCircle className="h-3 w-3" />;
      case 'Closed':
        return <XCircle className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
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
        <p className="text-red-700 text-lg font-semibold">Error fetching complaints</p>
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
              <MessageSquare className="h-7 w-7 text-teal-600" />
              Complaints Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage patient complaints - {complaintsData?.data?.length || 0} total complaints
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UpdateComplaint complaint={selectedComplaint} refetch={refetch} />
      <DeleteComplaint complaint={complaintToDelete} refetch={refetch} />
      <ChangeStatus complaint={complaintToChangeStatus} refetch={refetch} />

      {/* Complaints Grid */}
      {complaintsData && complaintsData.data && complaintsData.data.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {complaintsData.data.map((complaint: TComplaint) => (
            <div
              data-test={`complaint-card-${complaint.complaintId}`}
              key={complaint.complaintId}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
            >
              {/* Complaint Header */}
              <div className="bg-gradient-to-r from-teal-50 to-pink-50 p-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Complaint #{complaint.complaintId}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-teal-600" />
                      <span className="text-sm text-gray-600">
                        {complaint.createdAt
                          ? new Date(complaint.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(complaint.status)}`}
                  >
                    {getStatusIcon(complaint.status)}
                    {complaint.status}
                  </span>
                </div>
              </div>

              {/* Complaint Details */}
              <div className="p-6">
                {/* Subject */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-teal-600" />
                    Subject
                  </h4>
                  <p className="font-medium text-gray-900 bg-gray-50 rounded-lg p-3">
                    {complaint.subject}
                  </p>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm leading-relaxed">
                    {complaint.description}
                  </p>
                </div>

                {/* User Information */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-teal-600" />
                    Patient Information
                  </h4>
                  <div className="bg-teal-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">User ID:</span> {complaint.userId}
                    </p>
                    {complaint.relatedAppointmentId && (
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Related Appointment:</span> #
                        {complaint.relatedAppointmentId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    data-test={`change-status-${complaint.complaintId}`}
                    onClick={() => handleChangeStatus(complaint)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-blue-200"
                  >
                    <Clock className="h-4 w-4" />
                    Status
                  </button>
                  <button
                    data-test={`edit-complaint-${complaint.complaintId}`}
                    onClick={() => handleEdit(complaint)}
                    className="flex-1 bg-teal-50 hover:bg-teal-100 text-teal-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-teal-200"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    data-test={`delete-complaint-${complaint.complaintId}`}
                    onClick={() => handleDelete(complaint)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No complaints found</h3>
          <p className="text-gray-600">Patient complaints will appear here when submitted</p>
        </div>
      )}

      {/* Summary Stats */}
      {complaintsData && complaintsData.data && complaintsData.data.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-2xl font-bold text-teal-600">{complaintsData.data.length}</div>
              <div className="text-sm text-gray-600">Total Complaints</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {
                  complaintsData.data.filter((complaint: TComplaint) => complaint.status === 'Open')
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">Open</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {
                  complaintsData.data.filter(
                    (complaint: TComplaint) => complaint.status === 'In Progress'
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {
                  complaintsData.data.filter(
                    (complaint: TComplaint) => complaint.status === 'Resolved'
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Resolved</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;
