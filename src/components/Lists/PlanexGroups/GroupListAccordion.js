// @flow

import * as React from 'react';
import {List, withTheme} from 'react-native-paper';
import {FlatList, View} from 'react-native';
import {stringMatchQuery} from '../../../utils/Search';
import GroupListItem from './GroupListItem';
import AnimatedAccordion from '../../Animations/AnimatedAccordion';
import type {
  PlanexGroupType,
  PlanexGroupCategoryType,
} from '../../../screens/Planex/GroupSelectionScreen';
import type {CustomTheme} from '../../../managers/ThemeManager';

type PropsType = {
  item: PlanexGroupCategoryType,
  onGroupPress: (PlanexGroupType) => void,
  onFavoritePress: (PlanexGroupType) => void,
  currentSearchString: string,
  favoriteNumber: number,
  height: number,
  theme: CustomTheme,
};

const LIST_ITEM_HEIGHT = 64;

class GroupListAccordion extends React.Component<PropsType> {
  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {props} = this;
    return (
      nextProps.currentSearchString !== props.currentSearchString ||
      nextProps.favoriteNumber !== props.favoriteNumber ||
      nextProps.item.content.length !== props.item.content.length
    );
  }

  getRenderItem = ({item}: {item: PlanexGroupType}): React.Node => {
    const {props} = this;
    const onPress = () => {
      props.onGroupPress(item);
    };
    const onStarPress = () => {
      props.onFavoritePress(item);
    };
    return (
      <GroupListItem
        height={LIST_ITEM_HEIGHT}
        item={item}
        onPress={onPress}
        onStarPress={onStarPress}
      />
    );
  };

  getData(): Array<PlanexGroupType> {
    const {props} = this;
    const originalData = props.item.content;
    const displayData = [];
    originalData.forEach((data: PlanexGroupType) => {
      if (stringMatchQuery(data.name, props.currentSearchString))
        displayData.push(data);
    });
    return displayData;
  }

  itemLayout = (
    data: ?Array<PlanexGroupType>,
    index: number,
  ): {length: number, offset: number, index: number} => ({
    length: LIST_ITEM_HEIGHT,
    offset: LIST_ITEM_HEIGHT * index,
    index,
  });

  keyExtractor = (item: PlanexGroupType): string => item.id.toString();

  render(): React.Node {
    const {props} = this;
    const {item} = this.props;
    return (
      <View>
        <AnimatedAccordion
          title={item.name}
          style={{
            height: props.height,
            justifyContent: 'center',
          }}
          left={({size}: {size: number}): React.Node =>
            item.id === 0 ? (
              <List.Icon
                size={size}
                icon="star"
                color={props.theme.colors.tetrisScore}
              />
            ) : null
          }
          unmountWhenCollapsed // Only render list if expanded for increased performance
          opened={props.item.id === 0 || props.currentSearchString.length > 0}>
          {/* $FlowFixMe */}
          <FlatList
            data={this.getData()}
            extraData={props.currentSearchString}
            renderItem={this.getRenderItem}
            keyExtractor={this.keyExtractor}
            listKey={item.id.toString()}
            // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
            getItemLayout={this.itemLayout}
            removeClippedSubviews
          />
        </AnimatedAccordion>
      </View>
    );
  }
}

export default withTheme(GroupListAccordion);
