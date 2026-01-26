import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiDomain } from '../../utils/ApiDomain';
import type { RootState } from '../../app/store';

export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export type TComplaint = {
  complaintId: number;
  userId: number;
  relatedAppointmentId?: number;
  subject: string;
  description: string;
  status: ComplaintStatus;
  createdAt?: string;
  updatedAt?: string;
};

export const complaintsAPI = createApi({
  reducerPath: 'complaintsAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Complaints'],
  endpoints: (builder) => ({
    // POST /complaint/register
    createComplaint: builder.mutation<TComplaint, Partial<TComplaint>>({
      query: (newComplaint) => ({
        url: '/complaint/register',
        method: 'POST',
        body: newComplaint,
      }),
      invalidatesTags: ['Complaints'],
    }),

    // GET /complaints
    getComplaints: builder.query<{ data: TComplaint[] }, void>({
      query: () => '/complaints',
      providesTags: ['Complaints'],
    }),

    // GET /complaint/:id
    getComplaintById: builder.query<{ data: TComplaint }, number>({
      query: (id) => `/complaint/${id}`,
    }),

    // GET /complaints/user/:userId
    getComplaintsByUserId: builder.query<{ data: TComplaint[] }, number>({
      query: (userId) => `/complaints/user/${userId}`,
    }),

    // GET /complaints/status/:status
    getComplaintsByStatus: builder.query<{ data: TComplaint[] }, ComplaintStatus>({
      query: (status) => `/complaints/status/${status}`,
    }),

    // PUT /complaint/:id
    updateComplaint: builder.mutation<TComplaint, Partial<TComplaint> & { id: number }>({
      query: ({ id, ...rest }) => ({
        url: `/complaint/${id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: ['Complaints'],
    }),

    // PATCH /complaint/status/:id
    updateComplaintStatus: builder.mutation<
      { message: string },
      { id: number; status: ComplaintStatus }
    >({
      query: ({ id, status }) => ({
        url: `/complaint/status/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Complaints'],
    }),

    // DELETE /complaint/:id
    deleteComplaint: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/complaint/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Complaints'],
    }),
  }),
});

export const {
  useCreateComplaintMutation,
  useGetComplaintsQuery,
  useGetComplaintByIdQuery,
  useGetComplaintsByUserIdQuery,
  useGetComplaintsByStatusQuery,
  useUpdateComplaintMutation,
  useUpdateComplaintStatusMutation,
  useDeleteComplaintMutation,
} = complaintsAPI;
