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
import { Animated, Dimensions, ViewStyle } from 'react-native';
import ImageListItem from './ImageListItem';
import CardListItem from './CardListItem';
import type { ServiceItemType } from '../../../managers/ServicesManager';

type PropsType = {
  dataset: Array<ServiceItemType>;
  isHorizontal?: boolean;
  contentContainerStyle?: ViewStyle;
};

export default class CardList extends React.Component<PropsType> {
  static defaultProps = {
    isHorizontal: false,
    contentContainerStyle: null,
  };

  windowWidth: number;

  horizontalItemSize: number;

  constructor(props: PropsType) {
    super(props);
    this.windowWidth = Dimensions.get('window').width;
    this.horizontalItemSize = this.windowWidth / 4; // So that we can fit 3 items, and a part of the 4th => user knows he can scroll
  }

  getRenderItem = ({ item }: { item: ServiceItemType }) => {
    const { props } = this;
    if (props.isHorizontal) {
      return (
        <ImageListItem
          item={item}
          key={item.title}
          width={this.horizontalItemSize}
        />
      );
    }
    return <CardListItem item={item} key={item.title} />;
  };

  keyExtractor = (item: ServiceItemType): string => item.key;

  render() {
    const { props } = this;
    let containerStyle = {};
    if (props.isHorizontal) {
      containerStyle = {
        height: this.horizontalItemSize + 50,
        justifyContent: 'space-around',
      };
    }
    return (
      <Animated.FlatList
        data={props.dataset}
        renderItem={this.getRenderItem}
        keyExtractor={this.keyExtractor}
        numColumns={props.isHorizontal ? undefined : 2}
        horizontal={props.isHorizontal}
        contentContainerStyle={
          props.isHorizontal ? containerStyle : props.contentContainerStyle
        }
        pagingEnabled={props.isHorizontal}
        snapToInterval={
          props.isHorizontal ? (this.horizontalItemSize + 5) * 3 : undefined
        }
      />
    );
  }
}
