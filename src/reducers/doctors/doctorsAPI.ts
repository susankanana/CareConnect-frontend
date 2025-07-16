import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type TDoctor = {
  doctorId: number;
  specialization: string;
  availableDays: string[]; // from `text().array()`
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: "admin" | "doctor" | "user";
    image_url?: string;
  };
};

export const doctorsAPI = createApi({
  reducerPath: "doctorsAPI",
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
  tagTypes: ["Doctors"],
  endpoints: (builder) => ({
    // GET /doctors 
    getDoctors: builder.query<{ data: TDoctor[] }, void>({
      query: () => "/doctors",
      providesTags: ["Doctors"],
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

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useGetDoctorBySpecializationQuery,
} = doctorsAPI;
