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

import * as React from 'react';
import { useTheme } from 'react-native-paper';
import {
  useCollapsibleHeader,
  UseCollapsibleOptions,
} from 'react-navigation-collapsible';

export default function withCollapsible<T>(
  Component: React.ComponentType<any>,
  options?: UseCollapsibleOptions
) {
  return function WrappedComponent(props: T) {
    const theme = useTheme();
    if (!options?.config?.collapsedColor) {
      options = {
        ...options,
        config: {
          ...options?.config,
          collapsedColor: theme.colors.surface,
        },
      };
    }
    const collapsible = useCollapsibleHeader(options);
    return <Component {...props} collapsible={collapsible} />;
  };
}
