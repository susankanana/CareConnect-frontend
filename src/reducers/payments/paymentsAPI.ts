import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type TPayment = {
  paymentId: number;
  appointmentId: number;
  amount: string;
  paymentStatus?: string;
  transactionId?: string;
  paymentDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const paymentsAPI = createApi({
  reducerPath: "paymentsAPI",
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
  tagTypes: ["Payments"],
  endpoints: (builder) => ({
    // POST /payment/checkout-session
    createCheckoutSession: builder.mutation<{ url: string }, { appointmentId: number }>({
      query: (data) => ({
        url: "/payment/checkout-session",
        method: "POST",
        body: data,
      }),
    }),

    // GET /payments
    getAllPayments: builder.query<{ data: TPayment[] }, void>({
      query: () => "/payments",
      providesTags: ["Payments"],
    }),

    // GET /payment/:id
    getPaymentById: builder.query<{ data: TPayment }, number>({
      query: (id) => `/payment/${id}`,
    }),

    // GET /payments/appointment/:appointmentId
    getPaymentsByAppointmentId: builder.query<{ data: TPayment[] }, number>({
      query: (appointmentId) => `/payments/appointment/${appointmentId}`,
    }),

    // PATCH /payment/status/:id
    updatePaymentStatus: builder.mutation<
      { message: string },
      { id: number; paymentStatus: string }
    >({
      query: ({ id, paymentStatus }) => ({
        url: `/payment/status/${id}`,
        method: "PATCH",
        body: { paymentStatus },
      }),
      invalidatesTags: ["Payments"],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetAllPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetPaymentsByAppointmentIdQuery,
  useUpdatePaymentStatusMutation,
} = paymentsAPI;
