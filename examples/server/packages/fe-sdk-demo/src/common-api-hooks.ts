import {
  useQuery,
  useMutation,
  QueryClient,
  UndefinedInitialDataOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';

import { GetConfigsConfig, type GetConfigsReq, type GetConfigsRes } from './apiconf-refs';
import { GetConfigs } from './common-api';

let _queryClient: QueryClient;

export function setQueryClientForCommon(queryClient: QueryClient) {
  _queryClient = queryClient;
}

/**
 * get server configs for client
 *
 * @category core
 */
export function useGetConfigs(
  payload: GetConfigsReq | undefined,
  options?: UndefinedInitialDataOptions<GetConfigsRes | undefined, Error>,
  queryClient?: QueryClient,
  requestConfig?: AxiosRequestConfig<GetConfigsReq>,
  needTrim?: boolean
) {
  return useQuery(
    {
      ...(options || {}),
      queryKey: [GetConfigs.config.path, payload],
      queryFn() {
        if (typeof payload === 'undefined') {
          return undefined;
        }
        return GetConfigs(payload, requestConfig, needTrim);
      },
    },
    queryClient || _queryClient
  );
}
