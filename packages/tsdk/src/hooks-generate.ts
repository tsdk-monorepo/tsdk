export function generateSWRHook(name: string, apiConf: APIConfig) {
  const funcName = name[0].toLowerCase() + name.slice(1);
  const { description = '', category = 'others', isGet, method, path } = apiConf;
  const isGetMethod = isGet ?? (!apiConf.method || apiConf.method.toLowerCase() === 'get');
  if (isGetMethod) {
    // Query hook
    return `
      /** 
       * ${description || funcName}
       * ${method?.toUpperCase() ?? 'GET'} ${path}
       * @category ${category}
       */
      export function use${name}(
        payload?: ${name}Req | null,
        options?: SWRConfiguration<${name}Res>,
        requestConfig?: AxiosRequestConfig<${name}Req>,
        customHandler?: Handler,
      ) {
        const key = useMemo(() => {
          const {method='GET', path} = ${funcName}.config;
          if (payload !== null && typeof payload === 'object') return buildSortedURL(method+path, payload, stringify);
          return method+path+(payload || '')
        }, [payload]);
        return useSWR(
          key,
          () => {
            if (!payload) return null as unknown as ${name}Res;
            return ${funcName}(payload, requestConfig, customHandler);
          },
          options
        );
      }`;
  } else {
    // Mutation hook
    return `
      /** 
       * ${description || funcName}
       * ${method?.toUpperCase() ?? 'GET'} ${path}
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
        const {method='GET', path} = ${funcName}.config;
        return useSWRMutation(
          method+path,
          (url, { arg }: { arg: ${name}Req | FormData }) => {
            return ${funcName}(arg, requestConfig, customHandler);
          },
          options
        );
      }`;
  }
}

export function generateReactQueryHook(name: string, apiConf: APIConfig) {
  const funcName = name[0].toLowerCase() + name.slice(1);

  const { description = '', category = 'others', isGet, method, path } = apiConf;
  const isGetMethod = isGet ?? (!apiConf.method || apiConf.method.toLowerCase() === 'get');

  if (isGetMethod) {
    return `
      /** 
       * ${description || name}
       * ${method?.toUpperCase() ?? 'GET'} ${path}
       * @category ${category}
       */
      export function use${name}(
        payload?: ${name}Req | null,
        options?: Omit<UndefinedInitialDataOptions<${name}Res | undefined | null, Error>, 'queryKey' | 'queryFn'>,
        queryClient?: QueryClient,
        requestConfig?: AxiosRequestConfig<${name}Req>,
        customHandler?: Handler,
      ) {
        const key = useMemo(() => {
          const {method='GET', path} = ${funcName}.config;
          if (payload !== null && typeof payload === 'object') return buildSortedURL(method+path, payload, stringify);
          return method+path+(payload || '')
        }, [payload]);
        return useQuery(
          {
            ...(options ?? {}),
            queryKey: [key],
            queryFn() {
              if (!payload) return null;
              return ${funcName}(payload, requestConfig, customHandler);
            },
          },
          queryClient || _queryClient
        );
      }`;
  } else {
    return `
    /** 
     * ${description || funcName}
     * ${method?.toUpperCase() ?? 'GET'} ${path}
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
          ...(options ?? {}),
          mutationFn(payload) {
            return ${funcName}(payload, requestConfig, customHandler);
          },
        },
        queryClient || _queryClient
      );
    }`;
  }
}

export function generateVueQueryHook(name: string, apiConf: APIConfig) {
  const funcName = name[0].toLowerCase() + name.slice(1);

  const { description = '', category = 'others', isGet, method, path } = apiConf;
  const isGetMethod = isGet ?? (!apiConf.method || apiConf.method.toLowerCase() === 'get');

  if (isGetMethod) {
    return `
        /** 
         * ${description || funcName}
         * ${method?.toUpperCase() ?? 'GET'} ${path}
         * @category ${category}
         */
        export function use${name}(
          payload?: ${name}Req,
          options?: Partial<UseQueryOptions<${name}Res | undefined, Error>>,
          queryClient?: QueryClient,
          requestConfig?: AxiosRequestConfig<${name}Req>,
          customHandler?: Handler,
        ): UseQueryReturnType<${name}Res | undefined, Error> {
          const isUndefined = typeof payload === 'undefined';
          return useQuery(
            {
              // Disable query if payload is undefined
              enabled: !isUndefined,
              ...(options ?? {}),
              queryKey: [${funcName}.config.path, payload],
              queryFn() {
                if (isUndefined) {
                  // Return a resolved promise so queryFn always returns a Promise
                  return Promise.resolve(undefined);
                }
                return ${funcName}(payload, requestConfig, customHandler);
              },
            },
            queryClient || _queryClient
          );
        }`;
  } else {
    return `
      /** 
       * ${description || funcName}
       * ${method?.toUpperCase() ?? 'GET'} ${path}
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
            ...(options ?? {}),
            mutationFn(payload: ${name}Req | FormData) {
              return ${funcName}(payload, requestConfig, customHandler);
            },
          },
          queryClient || _queryClient
        );
      }`;
  }
}

export function generateSolidQueryHook(name: string, apiConf: APIConfig) {
  const funcName = name[0].toLowerCase() + name.slice(1);

  const { description = '', category = 'others', isGet, method, path } = apiConf;
  const isGetMethod = isGet ?? (!apiConf.method || apiConf.method.toLowerCase() === 'get');

  if (isGetMethod) {
    return `
        /** 
         * ${description || funcName}
         * ${method?.toUpperCase() ?? 'GET'} ${path}
         * @category ${category}
         */
        export function use${name}(
          payload?: ${name}Req,
          options?: Partial<
    Omit<SolidQueryOptions<${name}Res | undefined>, 'queryKey' | 'queryFn' | 'initialData'>
  > & { initialData?: any },
          queryClient?: QueryClient,
          requestConfig?: AxiosRequestConfig<${name}Req>,
          customHandler?: Handler,
        ) {
          return useQuery(() => (
            {
              ...(options ?? {}),
              queryKey: [${funcName}.config.path, payload],
              queryFn() {
                if (typeof payload === 'undefined') return undefined;
                return ${funcName}(payload, requestConfig, customHandler);
              },
            }),
            queryClient || _queryClient
          );
        }`;
  } else {
    return `
      /** 
       * ${description || funcName}
       * ${method?.toUpperCase() ?? 'GET'} ${path}
       * @category ${category}
       */
      export function use${name}(
        options?: ReturnType<UseMutationOptions<
          ${name}Res,
          Error,
          ${name}Req | FormData
        >>,
        queryClient?: QueryClient,
        requestConfig?: AxiosRequestConfig<${name}Req | FormData>,
        customHandler?: Handler,
      ) {
        return useMutation<${name}Res, Error, ${name}Req | FormData>(() => (
          {
            ...(options ?? {}),
            mutationFn(payload) {
              return ${funcName}(payload, requestConfig, customHandler);
            },
          }),
          queryClient || _queryClient
        );
      }`;
  }
}

export function generateSvelteQueryHook(name: string, apiConf: APIConfig) {
  const funcName = name[0].toLowerCase() + name.slice(1);
  const { description = '', category = 'others', isGet, method, path } = apiConf;
  const isGetMethod = isGet ?? (!apiConf.method || apiConf.method.toLowerCase() === 'get');

  if (isGetMethod) {
    return `
        /** 
         * ${description || funcName}
         * ${method?.toUpperCase() ?? 'GET'} ${path}
         * @category ${category}
         */
        export function use${name}(
          payload?: ${name}Req,
          options?: Omit<UndefinedInitialDataOptions<${name}Res | undefined, Error>, 'queryKey' | 'queryFn'>,
          queryClient?: QueryClient,
          requestConfig?: AxiosRequestConfig<${name}Req>,
          customHandler?: Handler,
        ) {
          return createQuery(() => (
            {
              ...(options ?? {}),
              queryKey: [${funcName}.config.path, payload],
              queryFn() {
                if (typeof payload === 'undefined') return undefined;
                return ${funcName}(payload, requestConfig, customHandler);
              },
  }),
  () => queryClient ?? _queryClient
          );
        }`;
  } else {
    return `
      /** 
       * ${description || name}
       * ${method?.toUpperCase() ?? 'GET'} ${path}
       * @category ${category}
       */
      export function use${name}(
        options?: CreateMutationOptions<
          ${name}Res,
          Error,
          ${name}Req | FormData,
          unknown
        >,
        queryClient?: QueryClient,
        requestConfig?: AxiosRequestConfig<${name}Req | FormData>,
        customHandler?: Handler,
      ) {
        return createMutation(() => (
          {
            ...(options ?? {}),
            mutationFn(payload) {
              return ${funcName}(payload, requestConfig, customHandler);
            },
  }),
  () => queryClient ?? _queryClient
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
