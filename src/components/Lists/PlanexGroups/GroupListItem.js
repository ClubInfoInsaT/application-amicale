// @flow

import * as React from 'react';
import {IconButton, List, withTheme} from 'react-native-paper';
import type {CustomThemeType} from '../../../managers/ThemeManager';
import type {PlanexGroupType} from '../../../screens/Planex/GroupSelectionScreen';

type PropsType = {
  theme: CustomThemeType,
  onPress: () => void,
  onStarPress: () => void,
  item: PlanexGroupType,
  favorites: Array<PlanexGroupType>,
  height: number,
};

const REPLACE_REGEX = /_/g;

class GroupListItem extends React.Component<PropsType> {
  isFav: boolean;

  constructor(props: PropsType) {
    super(props);
    this.isFav = this.isGroupInFavorites(props.favorites);
  }

  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {favorites} = this.props;
    const favChanged = favorites.length !== nextProps.favorites.length;
    let newFavState = this.isFav;
    if (favChanged) newFavState = this.isGroupInFavorites(nextProps.favorites);
    const shouldUpdate = this.isFav !== newFavState;
    this.isFav = newFavState;
    return shouldUpdate;
  }

  isGroupInFavorites(favorites: Array<PlanexGroupType>): boolean {
    const {item} = this.props;
    for (let i = 0; i < favorites.length; i += 1) {
      if (favorites[i].id === item.id) return true;
    }
    return false;
  }

  render(): React.Node {
    const {props} = this;
    const {colors} = props.theme;
    return (
      <List.Item
        title={props.item.name.replace(REPLACE_REGEX, ' ')}
        onPress={props.onPress}
        left={({size}: {size: number}): React.Node => (
          <List.Icon size={size} icon="chevron-right" />
        )}
        right={({size, color}: {size: number, color: string}): React.Node => (
          <IconButton
            size={size}
            icon="star"
            onPress={props.onStarPress}
            color={this.isFav ? colors.tetrisScore : color}
          />
        )}
        style={{
          height: props.height,
          justifyContent: 'center',
        }}
      />
    );
  }
}

export default withTheme(GroupListItem);
