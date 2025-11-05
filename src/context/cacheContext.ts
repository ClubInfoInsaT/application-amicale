import React, { useContext } from 'react';
import { PlanexGroupsType } from '../screens/Planex/GroupSelectionScreen';


export type CacheType = {
  planex?: {
    groups?: PlanexGroupsType;
  };
};

export type CacheContextType = {
  cache: CacheType | undefined;
  setCache: (newCache: CacheType) => void;
  resetCache: () => void;
};

export const CacheContext = React.createContext<CacheContextType>({
  cache: undefined,
  setCache: () => undefined,
  resetCache: () => undefined,
});

export function useCache() {
  return useContext(CacheContext);
}


export function useCachedPlanexGroups() {
  const { cache, setCache } = useCache();
  const groups = cache?.planex?.groups;
  const setGroups = (newGroups: PlanexGroupsType) => {
    setCache({
      planex: {
        groups: newGroups,
      },
    });
  };
  return { groups, setGroups };
}
