import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type TService = {
  serviceId: number;
  title: string;
  description: string;
  icon: string; // this will be a string name like 'Heart', 'Brain', etc.
  features: string[];
};

export const servicesAPI = createApi({
  reducerPath: "servicesAPI",
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
  tagTypes: ["Services"],
  endpoints: (builder) => ({
    // POST /services/register
    createService: builder.mutation<TService, Partial<TService>>({
      query: (newService) => ({
        url: "/service/register",
        method: "POST",
        body: newService,
      }),
      invalidatesTags: ["Services"],
    }),

    // GET /services
    getAllServices: builder.query<TService[], void>({
      query: () => "/services",
      transformResponse: (response: { data: TService[] }) => response.data,
      providesTags: ["Services"],
    }),

    // GET /services/:id
    getServiceById: builder.query<TService, number>({
      query: (id) => `/service/${id}`,
    }),

    // GET /service/:title
    getServiceByTitle: builder.query<TService, string>({
        query: (title) => `/service/${title}`,
    }),
    
    // PUT /services/:id
    updateService: builder.mutation<TService, Partial<TService> & { id: number }>({
      query: ({ id, ...rest }) => ({
        url: `/service/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Services"],
    }),

    // DELETE /services/:id
    deleteService: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/service/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Services"],
    }),
  }),
});

export const {
  useCreateServiceMutation,
  useGetAllServicesQuery,
  useGetServiceByIdQuery,
  useGetServiceByTitleQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesAPI;
