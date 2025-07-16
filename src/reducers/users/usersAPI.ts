import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiDomain } from "../../utils/ApiDomain";
import type { RootState } from "../../app/store";

export type TUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactPhone?: string;
  address?: string;
  role: "admin" | "doctor" | "user";
  isVerified: boolean;
  image_url: string;
  verificationCode?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const usersAPI = createApi({
  reducerPath: "usersAPI",
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
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    // POST /auth/register
    createUsers: builder.mutation<TUser, Partial<TUser>>({
      query: (newUser) => ({
        url: "/auth/register",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),

    // POST /auth/verify
    verifyUser: builder.mutation<{ message: string }, { email: string; code: string }>({
      query: (data) => ({
        url: "/auth/verify",
        method: "POST",
        body: data,
      }),
    }),

    // GET /users
    getUsers: builder.query<{ data: TUser[] }, void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    // GET /user/:id
    getUserById: builder.query<{ data: TUser[] }, number>({
      query: (id) => `/user/${id}`,
    }),

    // PUT /user/:id
    updateUser: builder.mutation<TUser, Partial<TUser> & { id: number }>({
      query: ({ id, ...rest }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Users"],
    }),

    // DELETE /user/:id
    deleteUser: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useCreateUsersMutation,
  useVerifyUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersAPI;
