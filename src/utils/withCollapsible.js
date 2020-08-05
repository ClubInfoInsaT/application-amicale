// @flow

import * as React from 'react';
import {useCollapsibleStack} from 'react-navigation-collapsible';

/**
 * Function used to manipulate Collapsible Hooks from a class.
 *
 * Usage :
 *
 * export withCollapsible(Component)
 *
 * replacing Component with the one you want to use.
 * This component will then receive the collapsibleStack prop.
 *
 * @param Component The component to use Collapsible with
 * @returns {React.ComponentType<any>}
 */
export default function withCollapsible(
  // eslint-disable-next-line flowtype/no-weak-types
  Component: React.ComponentType<any>,
  // eslint-disable-next-line flowtype/no-weak-types
): React$AbstractComponent<any, any> {
  // eslint-disable-next-line flowtype/no-weak-types
  return React.forwardRef((props: any, ref: any): React.Node => {
    return (
      <Component
        collapsibleStack={useCollapsibleStack()}
        ref={ref}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    );
  });
}
