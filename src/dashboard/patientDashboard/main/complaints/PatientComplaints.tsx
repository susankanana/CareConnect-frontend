import { useSelector } from 'react-redux';
import type { RootState } from '../../../../app/store';
import { complaintsAPI, type TComplaint } from '../../../../reducers/complaints/complaintsAPI';
import {
  MessageSquare,
  Calendar,
  Plus,
  XCircle,
  AlertCircle,
  Clock,
  CheckCircle,
  Hash,
} from 'lucide-react';
import CreateComplaint from './CreateComplaint';

const PatientComplaints = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?.user_id;

  const {
    data: complaintsData,
    isLoading,
    error,
    refetch,
  } = complaintsAPI.useGetComplaintsByUserIdQuery(userId ?? 0, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'In Progress':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Closed':
        return 'bg-gray-50 text-gray-500 border-gray-100';
      default:
        return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <AlertCircle size={14} />;
      case 'In Progress': return <Clock size={14} />;
      case 'Resolved': return <CheckCircle size={14} />;
      case 'Closed': return <XCircle size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <span className="loading loading-spinner text-teal-600 w-12"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-red-100 rounded-[2.5rem] p-12 text-center shadow-sm">
        <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-black text-gray-900">Connection Issue</h2>
        <p className="text-gray-500 mt-2 font-medium">We couldn't load your complaints. Please check your internet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Premium Header */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-teal-600 p-3 rounded-2xl text-white shadow-lg shadow-teal-100">
            <MessageSquare size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Support & Feedback</h1>
            <p className="text-gray-500 text-sm font-medium">Track and manage your submitted concerns</p>
          </div>
        </div>

        <button
          className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-teal-100 flex items-center justify-center gap-2 active:scale-95"
          onClick={() => (document.getElementById('create_complaint_modal') as HTMLDialogElement)?.showModal()}
        >
          <Plus size={20} /> Submit New Complaint
        </button>
      </section>

      <CreateComplaint refetch={refetch} />

      {/* Complaints Grid */}
      {complaintsData?.data && complaintsData.data.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {complaintsData.data.map((complaint: TComplaint) => (
            <div
              key={complaint.complaintId}
              className="bg-white rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden"
            >
              {/* Header with gradient to match booking vibe */}
              <div className="bg-linear-to-r from-gray-50 to-white p-6 border-b border-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                      <Hash size={16} className="text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 tracking-tight">Case #{complaint.complaintId}</h3>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        <Calendar size={12} /> {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(complaint.status)}`}>
                    {getStatusIcon(complaint.status)}
                    {complaint.status}
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Subject</label>
                  <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 group-hover:border-teal-100 transition-colors">
                    <p className="font-black text-gray-900">{complaint.subject}</p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Description</label>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium px-1">
                    {complaint.description}
                  </p>
                </div>

                {complaint.relatedAppointmentId && (
                  <div className="flex items-center justify-between bg-teal-50/50 rounded-2xl p-4 border border-teal-50">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-teal-600" />
                      <span className="text-xs font-bold text-teal-800 uppercase tracking-tight">Related Appointment</span>
                    </div>
                    <span className="text-xs font-black text-teal-900 bg-white px-3 py-1 rounded-lg border border-teal-100">
                      #{complaint.relatedAppointmentId}
                    </span>
                  </div>
                )}

                <div className={`mt-4 p-4 rounded-2xl flex items-center gap-3 border ${getStatusStyles(complaint.status)}`}>
                   <div className="p-2 bg-white rounded-xl shadow-sm">
                      {getStatusIcon(complaint.status)}
                   </div>
                   <p className="text-xs font-bold">
                    {complaint.status === 'Open' && 'Complaint received and under initial review.'}
                    {complaint.status === 'In Progress' && 'Investigation is currently active.'}
                    {complaint.status === 'Resolved' && 'Resolution completed. Check your email.'}
                    {complaint.status === 'Closed' && 'This thread is now archived.'}
                   </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-gray-100 rounded-[3rem] p-20 text-center">
          <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">Clean Slate!</h3>
          <p className="text-gray-500 mb-8 font-medium max-w-xs mx-auto">
            You haven't submitted any complaints yet. We're here to help if you have concerns.
          </p>
          <button
            className="bg-teal-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 flex items-center gap-2 mx-auto active:scale-95"
            onClick={() => (document.getElementById('create_complaint_modal') as HTMLDialogElement)?.showModal()}
          >
            <Plus size={20} /> Start New Ticket
          </button>
        </div>
      )}

      {/* Summary Stats Grid */}
      {complaintsData?.data && complaintsData.data.length > 0 && (
        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 text-center">Executive Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Cases', value: complaintsData.data.length, color: 'teal' },
              { label: 'Pending Review', value: complaintsData.data.filter(c => c.status === 'Open').length, color: 'red' },
              { label: 'Active', value: complaintsData.data.filter(c => c.status === 'In Progress').length, color: 'amber' },
              { label: 'Resolved', value: complaintsData.data.filter(c => c.status === 'Resolved').length, color: 'emerald' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-gray-50/50 rounded-3xl border border-gray-50 hover:bg-white hover:shadow-md transition-all">
                <div className={`text-3xl font-black mb-1 text-${stat.color}-600`}>{stat.value}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PatientComplaints;