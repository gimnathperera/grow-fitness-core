import { baseApi } from '@/services/baseApi';
import type { ApiSuccessResponse } from '@/types/api';

export interface CreateKidRequest {
  parentId: string;
  name: string;
  gender: 'girl' | 'boy';
  age: number;
  location: string;
  isInSports?: boolean;
  preferredTrainingStyle?: 'personal' | 'group';
}

export type CreateKidsPayload = CreateKidRequest[];

export const kidsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createKids: builder.mutation<
      ApiSuccessResponse<unknown>,
      CreateKidsPayload
    >({
      query: payload => ({
        url: '/kids',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Kid'],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateKidsMutation } = kidsApi;
