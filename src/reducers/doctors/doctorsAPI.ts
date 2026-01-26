import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiDomain } from '../../utils/ApiDomain';
import type { RootState } from '../../app/store';

export type TDoctor = {
  user: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    contactPhone: string;
    address: string;
    role: 'admin' | 'doctor' | 'user';
    image_url?: string;
    isVerified: boolean;
    verificationCode?: string;
    createdAt: string;
    updatedAt: string;
  };
  doctor: {
    doctorId: number;
    specialization: string;
    availableDays: string[];
    rating?: number;
    experience?: number;
    patients?: number;
    createdAt: string;
    updatedAt: string;
  };
};

export const doctorsAPI = createApi({
  reducerPath: 'doctorsAPI',
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
  tagTypes: ['Doctors'],
  endpoints: (builder) => ({
    // GET /doctors
    getDoctors: builder.query<{ data: TDoctor[] }, void>({
      query: () => '/doctors',
      providesTags: ['Doctors'],
    }),

    // GET /doctor/:id
    getDoctorById: builder.query<{ data: TDoctor }, number>({
      query: (id) => `/doctor/${id}`,
    }),

    // GET /doctors/specialization/:specialization
    getDoctorBySpecialization: builder.query<{ data: TDoctor[] }, string>({
      query: (specialization) => `/doctors/specialization/${specialization}`,
    }),
  }),
});

export const { useGetDoctorsQuery, useGetDoctorByIdQuery, useGetDoctorBySpecializationQuery } =
  doctorsAPI;
