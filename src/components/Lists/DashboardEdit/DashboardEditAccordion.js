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
import {withTheme} from 'react-native-paper';
import {FlatList, Image, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DashboardEditItem from './DashboardEditItem';
import AnimatedAccordion from '../../Animations/AnimatedAccordion';
import type {
  ServiceCategoryType,
  ServiceItemType,
} from '../../../managers/ServicesManager';
import type {CustomThemeType} from '../../../managers/ThemeManager';

type PropsType = {
  item: ServiceCategoryType,
  activeDashboard: Array<string>,
  onPress: (service: ServiceItemType) => void,
  theme: CustomThemeType,
};

const LIST_ITEM_HEIGHT = 64;

class DashboardEditAccordion extends React.Component<PropsType> {
  getRenderItem = ({item}: {item: ServiceItemType}): React.Node => {
    const {props} = this;
    return (
      <DashboardEditItem
        height={LIST_ITEM_HEIGHT}
        item={item}
        isActive={props.activeDashboard.includes(item.key)}
        onPress={() => {
          props.onPress(item);
        }}
      />
    );
  };

  getItemLayout = (
    data: ?Array<ServiceItemType>,
    index: number,
  ): {length: number, offset: number, index: number} => ({
    length: LIST_ITEM_HEIGHT,
    offset: LIST_ITEM_HEIGHT * index,
    index,
  });

  render(): React.Node {
    const {props} = this;
    const {item} = props;
    return (
      <View>
        <AnimatedAccordion
          title={item.title}
          left={(): React.Node =>
            typeof item.image === 'number' ? (
              <Image
                source={item.image}
                style={{
                  width: 40,
                  height: 40,
                }}
              />
            ) : (
              <MaterialCommunityIcons
                // $FlowFixMe
                name={item.image}
                color={props.theme.colors.primary}
                size={40}
              />
            )
          }>
          {/* $FlowFixMe */}
          <FlatList
            data={item.content}
            extraData={props.activeDashboard.toString()}
            renderItem={this.getRenderItem}
            listKey={item.key}
            // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
            getItemLayout={this.getItemLayout}
            removeClippedSubviews
          />
        </AnimatedAccordion>
      </View>
    );
  }
}

export default withTheme(DashboardEditAccordion);
