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
import {List, TouchableRipple, withTheme} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type {PlanexGroupType} from '../../../screens/Planex/GroupSelectionScreen';
import {View} from 'react-native';
import {getPrettierPlanexGroupName} from '../../../utils/Utils';

type PropsType = {
  theme: ReactNativePaper.Theme;
  onPress: () => void;
  onStarPress: () => void;
  item: PlanexGroupType;
  favorites: Array<PlanexGroupType>;
  height: number;
};

class GroupListItem extends React.Component<PropsType> {
  isFav: boolean;

  starRef: {current: null | (Animatable.View & View)};

  constructor(props: PropsType) {
    super(props);
    this.starRef = React.createRef();
    this.isFav = this.isGroupInFavorites(props.favorites);
  }

  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {favorites} = this.props;
    const favChanged = favorites.length !== nextProps.favorites.length;
    let newFavState = this.isFav;
    if (favChanged) {
      newFavState = this.isGroupInFavorites(nextProps.favorites);
    }
    const shouldUpdate = this.isFav !== newFavState;
    this.isFav = newFavState;
    return shouldUpdate;
  }

  onStarPress = () => {
    const {props} = this;
    const ref = this.starRef;
    if (ref.current && ref.current.rubberBand && ref.current.swing) {
      if (this.isFav) {
        ref.current.rubberBand();
      } else {
        ref.current.swing();
      }
    }
    props.onStarPress();
  };

  isGroupInFavorites(favorites: Array<PlanexGroupType>): boolean {
    const {item} = this.props;
    for (let i = 0; i < favorites.length; i += 1) {
      if (favorites[i].id === item.id) {
        return true;
      }
    }
    return false;
  }

  render() {
    const {props} = this;
    const {colors} = props.theme;
    return (
      <List.Item
        title={getPrettierPlanexGroupName(props.item.name)}
        onPress={props.onPress}
        left={(iconProps) => (
          <List.Icon
            color={iconProps.color}
            style={iconProps.style}
            icon="chevron-right"
          />
        )}
        right={(iconProps) => (
          <Animatable.View ref={this.starRef} useNativeDriver>
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
