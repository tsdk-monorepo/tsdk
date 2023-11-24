import { AxiosRequestConfig } from 'axios';
import useSWR, { SWRConfiguration } from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';

import { GetConfigsConfig, GetConfigsReq, GetConfigsRes } from './apiconf-refs';
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
