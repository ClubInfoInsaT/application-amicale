// @flow

import * as React from 'react';
import {List, TouchableRipple, withTheme} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type {CustomThemeType} from '../../../managers/ThemeManager';
import type {PlanexGroupType} from '../../../screens/Planex/GroupSelectionScreen';
import type {ListIconPropsType} from '../../../constants/PaperStyles';

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

  starRef: null | Animatable.View;

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

  onStarPress = () => {
    const {props} = this;
    const ref = this.starRef;
    if (ref != null) {
      if (this.isFav) ref.rubberBand();
      else ref.swing();
    }
    props.onStarPress();
  };

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
        left={(iconProps: ListIconPropsType): React.Node => (
          <List.Icon
            color={iconProps.color}
            style={iconProps.style}
            icon="chevron-right"
          />
        )}
        right={(iconProps: ListIconPropsType): React.Node => (
          <Animatable.View
            ref={(ref: Animatable.View) => {
              this.starRef = ref;
            }}
            useNativeDriver>
            <TouchableRipple
              onPress={this.onStarPress}
              style={{
                marginRight: 10,
                marginLeft: 'auto',
                marginTop: 'auto',
                marginBottom: 'auto',
              }}>
              <MaterialCommunityIcons
                size={30}
                style={{padding: 10}}
                name="star"
                color={this.isFav ? colors.tetrisScore : iconProps.color}
              />
            </TouchableRipple>
          </Animatable.View>
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
