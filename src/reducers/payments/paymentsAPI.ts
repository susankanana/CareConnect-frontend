import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type TPayment = {
  paymentId: number;
  appointmentId: number;
  amount: string;
  paymentMethod?: string;
  paymentStatus: string;
  transactionId?: string;
  paymentDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Define the type for the M-Pesa STK push request body
export type TInitiateMpesaStkPushRequest = {
  appointmentId: number;
  phone: string;
};

// Define the type for the M-Pesa STK push response body
export type TInitiateMpesaStkPushResponse = {
  message: string;
  data: {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
  };
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
    // POST /payment/checkout-session----STRIPE
    createCheckoutSession: builder.mutation<{ url: string }, { appointmentId: number }>({
      query: (data) => ({
        url: "/payment/checkout-session",
        method: "POST",
        body: data,
      }),
    }),

    // POST /payment/mpesa/initiate ---- M-PESA
    initiateMpesaPayment: builder.mutation<TInitiateMpesaStkPushResponse, TInitiateMpesaStkPushRequest>({
      query: (data) => ({
        url: "/payment/mpesa/initiate",
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

    // GET /payments/status/:appointmentId
    checkPaymentStatusByAppointmentId: builder.query<{ status: string }, number>({
      query: (appointmentId) => `/payments/status/${appointmentId}`,
    }),

  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useInitiateMpesaPaymentMutation,
  useGetAllPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetPaymentsByAppointmentIdQuery,
  useCheckPaymentStatusByAppointmentIdQuery,
} = paymentsAPI;