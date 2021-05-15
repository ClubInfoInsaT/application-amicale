import React, { useContext } from 'react';
import { Collapsible } from 'react-navigation-collapsible';

export type CollapsibleContextType = {
  collapsible?: Collapsible;
  setCollapsible: (collapsible: Collapsible) => void;
};

export const CollapsibleContext = React.createContext<CollapsibleContextType>({
  collapsible: undefined,
  setCollapsible: () => undefined,
});

export function useCollapsible() {
  return useContext(CollapsibleContext);
}
