/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

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
