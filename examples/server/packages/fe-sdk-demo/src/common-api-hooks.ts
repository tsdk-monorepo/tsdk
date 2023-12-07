import useSWR, { SWRConfiguration } from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { AxiosRequestConfig } from 'axios';

import { GetConfigsConfig, type GetConfigsReq, type GetConfigsRes } from './apiconf-refs';
import { GetConfigs } from './common-api';

export function useGetConfigs(
  payload: GetConfigsReq,
  options?: SWRConfiguration<GetConfigsRes>,
  requestConfig?: AxiosRequestConfig<GetConfigsReq>,
  needTrim?: boolean
) {
  return useSWR(
    { url: GetConfigs.config.path, arg: payload },
    ({ arg }) => {
      return GetConfigs(arg, requestConfig, needTrim);
    },
    options
  );
}
