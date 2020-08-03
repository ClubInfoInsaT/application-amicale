// @flow

import * as React from 'react';
import {Animated, Dimensions} from 'react-native';
import type {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheet';
import ImageListItem from './ImageListItem';
import CardListItem from './CardListItem';
import type {ServiceItemType} from '../../../managers/ServicesManager';

type PropsType = {
  dataset: Array<ServiceItemType>,
  isHorizontal?: boolean,
  contentContainerStyle?: ViewStyle | null,
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
    this.horizontalItemSize = this.windowWidth / 4; // So that we can fit 3 items and a part of the 4th => user knows he can scroll
  }

  getRenderItem = ({item}: {item: ServiceItemType}): React.Node => {
    const {props} = this;
    if (props.isHorizontal)
      return (
        <ImageListItem
          item={item}
          key={item.title}
          width={this.horizontalItemSize}
        />
      );
    return <CardListItem item={item} key={item.title} />;
  };

  keyExtractor = (item: ServiceItemType): string => item.key;

  render(): React.Node {
    const {props} = this;
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
          props.isHorizontal ? (this.horizontalItemSize + 5) * 3 : null
        }
      />
    );
  }
}
