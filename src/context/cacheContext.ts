import React, { useContext } from 'react';
import { PlanexGroupsType } from '../screens/Planex/GroupSelectionScreen';
import { ArticlesType } from '../screens/Services/Proximo/ProximoListScreen';
import { CategoriesType } from '../screens/Services/Proximo/ProximoMainScreen';

export type CacheType = {
  proximo?: {
    articles?: ArticlesType;
    categories?: CategoriesType;
  };
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

export function useCachedProximoCategories() {
  const { cache, setCache } = useCache();
  const categories = cache?.proximo?.categories;
  const setCategories = (newCategories: CategoriesType) => {
    setCache({
      proximo: {
        categories: newCategories,
        articles: cache?.proximo?.articles,
      },
    });
  };
  return { categories, setCategories };
}

export function useCachedProximoArticles() {
  const { cache, setCache } = useCache();
  const articles = cache?.proximo?.articles;
  const setArticles = (newArticles: ArticlesType) => {
    setCache({
      proximo: {
        categories: cache?.proximo?.categories,
        articles: newArticles,
      },
    });
  };
  return { articles, setArticles };
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
