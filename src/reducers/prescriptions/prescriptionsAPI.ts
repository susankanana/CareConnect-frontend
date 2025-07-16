import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type TPrescription = {
  prescriptionId: number;
  appointmentId: number;
  doctorId: number;
  patientId: number;
  notes: string;
  amount: string; // stored as string because it's a PostgreSQL numeric
  createdAt?: string;
  updatedAt?: string;
};

export const prescriptionsAPI = createApi({
  reducerPath: "prescriptionsAPI",
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
  tagTypes: ["Prescriptions"],
  endpoints: (builder) => ({
    // POST /prescription/register
    createPrescription: builder.mutation<TPrescription, Partial<TPrescription>>({
      query: (newPrescription) => ({
        url: "/prescription/register",
        method: "POST",
        body: newPrescription,
      }),
      invalidatesTags: ["Prescriptions"],
    }),

    // GET /prescriptions
    getPrescriptions: builder.query<{ data: TPrescription[] }, void>({
      query: () => "/prescriptions",
      providesTags: ["Prescriptions"],
    }),

    // GET /prescription/:id
    getPrescriptionById: builder.query<{ data: TPrescription }, number>({
      query: (id) => `/prescription/${id}`,
    }),

    // GET /prescriptions/patient/:patientId
    getPrescriptionsByPatientId: builder.query<{ data: TPrescription[] }, number>({
      query: (patientId) => `/prescriptions/patient/${patientId}`,
    }),

    // GET /prescriptions/doctor/:doctorId
    getPrescriptionsByDoctorId: builder.query<{ data: TPrescription[] }, number>({
      query: (doctorId) => `/prescriptions/doctor/${doctorId}`,
    }),

    // PUT /prescription/:id
    updatePrescription: builder.mutation<TPrescription, Partial<TPrescription> & { id: number }>({
      query: ({ id, ...rest }) => ({
        url: `/prescription/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Prescriptions"],
    }),

    // DELETE /prescription/:id
    deletePrescription: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/prescription/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Prescriptions"],
    }),
  }),
});

export const {
  useCreatePrescriptionMutation,
  useGetPrescriptionsQuery,
  useGetPrescriptionByIdQuery,
  useGetPrescriptionsByPatientIdQuery,
  useGetPrescriptionsByDoctorIdQuery,
  useUpdatePrescriptionMutation,
  useDeletePrescriptionMutation,
} = prescriptionsAPI;
