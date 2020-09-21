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
import {Animated} from 'react-native';
import type {CollapsibleComponentPropsType} from './CollapsibleComponent';
import CollapsibleComponent from './CollapsibleComponent';

type PropsType = {
  ...CollapsibleComponentPropsType,
};

// eslint-disable-next-line react/prefer-stateless-function
class CollapsibleFlatList extends React.Component<PropsType> {
  render(): React.Node {
    const {props} = this;
    return (
      <CollapsibleComponent // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        component={Animated.FlatList}>
        {props.children}
      </CollapsibleComponent>
    );
  }
}

export default CollapsibleFlatList;
