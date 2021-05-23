import React, { useState } from 'react';
import { Collapsible } from 'react-navigation-collapsible';
import {
  CollapsibleContext,
  CollapsibleContextType,
} from '../../context/CollapsibleContext';

type Props = {
  children: React.ReactChild;
};

export default function CollapsibleProvider(props: Props) {
  const setCollapsible = (collapsible: Collapsible) => {
    setCurrentCollapsible((prevState) => ({
      ...prevState,
      collapsible,
    }));
  };

  const [currentCollapsible, setCurrentCollapsible] =
    useState<CollapsibleContextType>({
      collapsible: undefined,
      setCollapsible: setCollapsible,
    });

  return (
    <CollapsibleContext.Provider value={currentCollapsible}>
      {props.children}
    </CollapsibleContext.Provider>
  );
}
