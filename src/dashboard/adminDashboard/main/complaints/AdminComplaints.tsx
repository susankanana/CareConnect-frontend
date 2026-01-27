import { complaintsAPI, type TComplaint } from '../../../../reducers/complaints/complaintsAPI';
import {
  Edit,
  Trash2,
  MessageSquare,
  User,
  Calendar,
  Clock,
  AlertCircle,
  Hash,
  Loader,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import UpdateComplaint from './UpdateComplaint';
import DeleteComplaint from './DeleteComplaint';
import ChangeStatus from './ChangeStatus';

const Complaints = () => {
  const {
    data: complaintsData,
    isLoading,
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

  const getStatusTheme = (status: string) => {
    switch (status) {
      case 'Open':
        return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', dot: 'bg-red-500' };
      case 'In Progress':
        return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', dot: 'bg-amber-500' };
      case 'Resolved':
        return { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100', dot: 'bg-teal-500' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100', dot: 'bg-gray-500' };
    }
  };

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center min-h-100">
      <Loader className="animate-spin text-teal-600" size={40} />
      <p className="text-gray-500 font-bold mt-4">Retrieving Patient Feedback...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-10">
      {/* Chique Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-pink-50 p-4 rounded-2xl">
            <MessageSquare className="h-8 w-8 text-pink-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Resolution Center</h1>
            <p className="text-gray-400 text-sm font-semibold mt-1">
              Monitoring {complaintsData?.data?.length || 0} active inquiries
            </p>
          </div>
        </div>
      </div>

      <UpdateComplaint complaint={selectedComplaint} refetch={refetch} />
      <DeleteComplaint complaint={complaintToDelete} refetch={refetch} />
      <ChangeStatus complaint={complaintToChangeStatus} refetch={refetch} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {complaintsData?.data?.map((complaint: TComplaint) => {
          const theme = getStatusTheme(complaint.status);
          return (
            <div key={complaint.complaintId} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all duration-500 group">
              
              {/* Card Top Strip */}
              <div className="p-6 flex justify-between items-center bg-gray-50/50 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Hash size={14} className="text-pink-500" />
                  <span className="text-xs font-black text-gray-900">CASE-{complaint.complaintId}</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm flex items-center gap-2 bg-white ${theme.text} ${theme.border}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${theme.dot} animate-pulse`} />
                  {complaint.status}
                </div>
              </div>

              <div className="p-8 space-y-6">
                {/* Subject Area */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={14} className="text-teal-500" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inquiry Subject</span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 leading-snug">
                    {complaint.subject}
                  </h3>
                </div>

                {/* Description Box */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 italic text-gray-600 text-sm leading-relaxed">
                  "{complaint.description}"
                </div>

                {/* Meta Data Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 rounded-xl">
                      <User size={16} className="text-teal-600" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Patient ID</p>
                      <p className="text-xs font-bold text-gray-700">USR-{complaint.userId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-50 rounded-xl">
                      <Calendar size={16} className="text-pink-500" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Filed On</p>
                      <p className="text-xs font-bold text-gray-700">
                        {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status-related action items */}
                {complaint.relatedAppointmentId && (
                  <div className="flex items-center justify-between p-4 bg-teal-600 rounded-2xl text-white">
                    <div className="flex items-center gap-3">
                      <Clock size={18} />
                      <span className="text-xs font-bold">Related to Appointment #{complaint.relatedAppointmentId}</span>
                    </div>
                    <ArrowRight size={16} />
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="p-8 pt-0 mt-auto flex gap-3">
                <button
                  onClick={() => handleChangeStatus(complaint)}
                  className="flex-1 border border-teal-400 text-teal-600 bg-teal-50/30 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  Update Status
                </button>
                <button
                  onClick={() => handleEdit(complaint)}
                  className="px-5 py-3.5 bg-white text-gray-600 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(complaint)}
                  className="px-5 py-3.5 bg-white text-red-500 border border-red-100 rounded-2xl hover:bg-red-50 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chique Footer Summary - Teal Gradient (No Black) */}
      <div className="bg-linear-to-r from-[#004d4d] to-[#006666] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl -mr-40 -mt-40"></div>
        <h3 className="text-xl font-black mb-10 flex items-center gap-3 tracking-tighter uppercase">
          <div className="w-1.5 h-6 bg-teal-400 rounded-full"></div> 
          Department Health Summary
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
          {[
            { label: 'Total Logs', value: complaintsData?.data?.length || 0, color: 'text-white' },
            { label: 'Pending Action', value: complaintsData?.data?.filter(c => c.status === 'Open').length || 0, color: 'text-red-300' },
            { label: 'Ongoing', value: complaintsData?.data?.filter(c => c.status === 'In Progress').length || 0, color: 'text-amber-300' },
            { label: 'Resolved Rate', value: `${complaintsData?.data?.length ? Math.round((complaintsData.data.filter(c => c.status === 'Resolved').length / complaintsData.data.length) * 100) : 0}%`, color: 'text-teal-300' }
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

export default Complaints;