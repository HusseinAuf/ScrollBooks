import { useQuery } from "@tanstack/react-query";

export const useQueryList = (queryKey: any[], queryFn: any, options = {}) => {
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn,
    select: (data: any) => data,
    ...options,
  });
  return {
    data: response?.data?.data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};
