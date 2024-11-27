import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// get category
export function useGetAllAge() {
  const URL = endpoints.age.getAllAge;
  const { data } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      ageList: data || [],
    }),
    [data]
  );

  return memoizedValue;
}

