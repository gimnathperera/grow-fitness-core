import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store';
import { clearSession, selectAuth, setTokens } from '@/auth/authSlice';
import { normalizeApiError } from '@/services/errorNormalizer';

const DEFAULT_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

type RefreshResponse = {
  ok: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
    expiresAt?: string;
  };
};

type CustomBaseQuery = BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError>;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: DEFAULT_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const { accessToken } = selectAuth(getState() as RootState);
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
  credentials: 'include',
});

type BaseQueryReturn = Awaited<ReturnType<typeof rawBaseQuery>>;

export const baseQueryWithReauth: CustomBaseQuery = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const { refreshToken } = selectAuth(api.getState() as RootState);

    if (!refreshToken) {
      api.dispatch(clearSession());
    }

    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions,
      );

      const parsed = refreshResult.data as RefreshResponse | undefined;
      const tokens = parsed?.data;

      if (tokens?.accessToken && tokens.refreshToken) {
        api.dispatch(setTokens(tokens));
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearSession());
        result = refreshResult as BaseQueryReturn;
      }
    }
  }

  if (result.error) {
    result.error = normalizeApiError(result.error);
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth',
    'User',
    'Client',
    'Kid',
    'Coach',
    'Session',
    'Team',
    'Calendar',
    'Notification',
    'Pass',
    'Milestone',
  ],
  endpoints: () => ({}),
});

export type BaseApi = typeof baseApi;
export type ApiTags = (typeof baseApi)['reducerPath'];
