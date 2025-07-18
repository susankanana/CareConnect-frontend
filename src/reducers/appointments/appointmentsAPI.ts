import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type AppointmentStatus = "Pending" | "Confirmed" | "Cancelled";

export type TAppointment = {
  appointmentId: number;
  userId: number;
  doctorId: number;
  appointmentDate: string; // ISO date string
  timeSlot: string; // HH:mm:ss format
  totalAmount: string; // from numeric in DB
  appointmentStatus: AppointmentStatus;
  createdAt?: string;
  updatedAt?: string;
};

export const appointmentsAPI = createApi({
  reducerPath: "appointmentsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: ApiDomain,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Appointments"],
  endpoints: (builder) => ({
    // POST /appointment/register
    createAppointment: builder.mutation<{ data: TAppointment }, Partial<TAppointment>>({
      query: (newAppointment) => ({
        url: "/appointment/register",
        method: "POST",
        body: newAppointment,
      }),
      invalidatesTags: ["Appointments"],
    }),

    // GET /appointments
    getAppointments: builder.query<{ data: TAppointment[] }, void>({
      query: () => "/appointments",
      providesTags: ["Appointments"],
    }),

    // GET /appointments/detailed
    getDetailedAppointments: builder.query<{ data: any[] }, void>({
      query: () => "/appointments/detailed",
    }),

    // GET /appointment/:id
    getAppointmentById: builder.query<{ data: TAppointment }, number>({
      query: (id) => `/appointment/${id}`,
    }),

    // GET /appointments/user/:userId
    getAppointmentsByUserId: builder.query<{ data: TAppointment[] }, number>({
      query: (userId) => `/appointments/user/${userId}`,
    }),

    // GET /appointments/doctor/:doctorId
    getAppointmentsByDoctorId: builder.query<{ data: TAppointment[] }, number>({
      query: (doctorId) => `/appointments/doctor/${doctorId}`,
    }),

    // GET /appointments/status/:status
    getAppointmentsByStatus: builder.query<{ data: TAppointment[] }, AppointmentStatus>({
      query: (status) => `/appointments/status/${status}`,
    }),

    // PUT /appointment/:id
    updateAppointment: builder.mutation<TAppointment, Partial<TAppointment> & { id: number }>({
      query: ({ id, ...rest }) => ({
        url: `/appointment/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Appointments"],
    }),

    // PATCH /appointment/status/:id
    updateAppointmentStatus: builder.mutation<{ message: string }, { id: number; appointmentStatus: AppointmentStatus }>({
      query: ({ id, appointmentStatus }) => ({
        url: `/appointment/status/${id}`,
        method: "PATCH",
        body: { appointmentStatus },
      }),
      invalidatesTags: ["Appointments"],
    }),

    // DELETE /appointment/:id
    deleteAppointment: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/appointment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Appointments"],
    }),
  }),
});

export const {
  useCreateAppointmentMutation,
  useGetAppointmentsQuery,
  useGetDetailedAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useGetAppointmentsByUserIdQuery,
  useGetAppointmentsByDoctorIdQuery,
  useGetAppointmentsByStatusQuery,
  useUpdateAppointmentMutation,
  useUpdateAppointmentStatusMutation,
  useDeleteAppointmentMutation,
} = appointmentsAPI;
