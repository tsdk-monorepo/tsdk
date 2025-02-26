export function generateSWRHook(name: string, apiConf: APIConfig) {
  const { description = '', category = 'others', isGet } = apiConf;
  const isGetMethod = isGet ?? (!apiConf.method || apiConf.method.toLowerCase() === 'get');
  if (isGetMethod) {
    // Query hook
    return `
      /** 
       * ${description || name}
       * 
       * @category ${category}
       */
      export function use${name}(
        payload?: ${name}Req,
        options?: SWRConfiguration<${name}Res>,
        requestConfig?: AxiosRequestConfig<${name}Req>,
        customHandler?: Handler,
      ) {
        return useSWR(
          () => payload ? { url: ${name}.config.path, arg: payload } : null,
          ({ arg }) => {
            return ${name}(arg, requestConfig, customHandler);
          },
          options
        );
      }`;
  } else {
    // Mutation hook
    return `
      /** 
       * ${description || name}
       * 
       * @category ${category}
       */
      export function use${name}(
        options?: SWRMutationConfiguration<
          ${name}Res,
          Error,
          string,
          ${name}Req | FormData
        >,
        requestConfig?: AxiosRequestConfig<${name}Req | FormData>,
        customHandler?: Handler,
      ) {
        return useSWRMutation(
          ${name}.config.path,
          (url, { arg }: { arg: ${name}Req | FormData }) => {
            return ${name}(arg, requestConfig, customHandler);
          },
          options
        );
      }`;
  }
}

export function generateReactQueryHook(name: string, apiConf: APIConfig) {
  const { description = '', category = 'others', isGet } = apiConf;
  const isGetMethod = isGet ?? (!apiConf.method || apiConf.method.toLowerCase() === 'get');

  if (isGetMethod) {
    return `
      /** 
       * ${description || name}
       * 
       * @category ${category}
       */
      export function use${name}(
        payload?: ${name}Req,
        options?: Omit<UndefinedInitialDataOptions<${name}Res | undefined, Error>, 'queryKey' | 'queryFn'>,
        queryClient?: QueryClient,
        requestConfig?: AxiosRequestConfig<${name}Req>,
        customHandler?: Handler,
      ) {
        return useQuery(
          {
            ...options,
            queryKey: [${name}.config.path, payload],
            queryFn() {
              if (typeof payload === 'undefined') {
                return undefined;
              }
              return ${name}(payload, requestConfig, customHandler);
            },
          },
          queryClient || _queryClient
        );
      }`;
  } else {
    return `
    /** 
     * ${description || name}
     * 
     * @category ${category}
     */
    export function use${name}(
      options?: UseMutationOptions<
        ${name}Res,
        Error,
        ${name}Req | FormData,
        unknown
      >,
      queryClient?: QueryClient,
      requestConfig?: AxiosRequestConfig<${name}Req | FormData>,
      customHandler?: Handler,
    ) {
      return useMutation(
        {
          ...options,
          mutationFn(payload) {
            return ${name}(payload, requestConfig, customHandler);
          },
        },
        queryClient || _queryClient
      );
    }`;
  }
}

export function generateVueQueryHook(name: string, apiConf: APIConfig) {
  const { description = '', category = 'others', isGet } = apiConf;
  const isGetMethod = isGet ?? (!apiConf.method || apiConf.method.toLowerCase() === 'get');

  if (isGetMethod) {
    return `
        /** 
         * ${description || name}
         * 
         * @category ${category}
         */
        export function use${name}(
          payload?: ${name}Req,
          options?: Omit<UndefinedInitialQueryOptions<${name}Res | undefined, Error>, 'queryKey' | 'queryFn'>,
          queryClient?: QueryClient,
          requestConfig?: AxiosRequestConfig<${name}Req>,
          customHandler?: Handler,
        ) {
          return useQuery(
            {
              ...options,
              queryKey: [${name}.config.path, payload],
              queryFn() {
                if (typeof payload === 'undefined') {
                  return undefined;
                }
                return ${name}(payload, requestConfig, customHandler);
              },
            },
            queryClient || _queryClient
          );
        }`;
  } else {
    return `
      /** 
       * ${description || name}
       * 
       * @category ${category}
       */
      export function use${name}(
        options?: UseMutationOptions<
          ${name}Res,
          Error,
          ${name}Req | FormData,
          unknown
        >,
        queryClient?: QueryClient,
        requestConfig?: AxiosRequestConfig<${name}Req | FormData>,
        customHandler?: Handler,
      ) {
        return useMutation(
          {
            ...options,
            mutationFn(payload) {
              return ${name}(payload, requestConfig, customHandler);
            },
          },
          queryClient || _queryClient
        );
      }`;
  }
}

export interface APIConfig {
  path: string;
  description?: string;
  method?: string;
  type?: string;
  category?: string;
  isGet?: boolean;
  schema?: any;
}
