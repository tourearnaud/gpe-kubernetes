import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// get category
export function useGetAllCategory() {
  const URL = endpoints.categories.getAllCategory;
  const { data } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      categoryList: data || [],
    }),
    [data]
  );

  return memoizedValue;
}

