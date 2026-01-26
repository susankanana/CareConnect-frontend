import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiDomain } from '../../utils/ApiDomain';

export type TLoginResponse = {
  token: string;
  user: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    isVerified: boolean;
  };
};

type LoginInputs = {
  email: string;
  password: string;
};

export const loginAPI = createApi({
  reducerPath: 'loginAPI',
  baseQuery: fetchBaseQuery({ baseUrl: ApiDomain }),
  tagTypes: ['Login'],
  endpoints: (builder) => ({
    loginUser: builder.mutation<TLoginResponse, LoginInputs>({
      query: (loginData) => ({
        url: '/auth/login',
        method: 'POST',
        body: loginData,
      }),
      invalidatesTags: ['Login'],
    }),
  }),
});
