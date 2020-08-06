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
import type {CustomThemeType} from '../../../managers/ThemeManager';

type PropsType = {
  item: PlanexGroupCategoryType,
  favorites: Array<PlanexGroupType>,
  onGroupPress: (PlanexGroupType) => void,
  onFavoritePress: (PlanexGroupType) => void,
  currentSearchString: string,
  height: number,
  theme: CustomThemeType,
};

const LIST_ITEM_HEIGHT = 64;
const REPLACE_REGEX = /_/g;

class GroupListAccordion extends React.Component<PropsType> {
  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {props} = this;
    return (
      nextProps.currentSearchString !== props.currentSearchString ||
      nextProps.favorites.length !== props.favorites.length ||
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
        favorites={props.favorites}
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
          title={item.name.replace(REPLACE_REGEX, ' ')}
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
          unmountWhenCollapsed={item.id !== 0} // Only render list if expanded for increased performance
          opened={props.currentSearchString.length > 0}>
          <FlatList
            data={this.getData()}
            extraData={props.currentSearchString + props.favorites.length}
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
