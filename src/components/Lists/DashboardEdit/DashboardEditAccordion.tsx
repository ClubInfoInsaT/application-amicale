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
import { FlatList, Image, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DashboardEditItem from './DashboardEditItem';
import AnimatedAccordion from '../../Animations/AnimatedAccordion';
import type {
  ServiceCategoryType,
  ServiceItemType,
} from '../../../managers/ServicesManager';

type PropsType = {
  item: ServiceCategoryType;
  activeDashboard: Array<string>;
  onPress: (service: ServiceItemType) => void;
};

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
  },
});

const LIST_ITEM_HEIGHT = 64;

function DashboardEditAccordion(props: PropsType) {
  const theme = useTheme();

  const getRenderItem = ({ item }: { item: ServiceItemType }) => {
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

  const getItemLayout = (
    _data: Array<ServiceItemType> | null | undefined,
    index: number
  ): { length: number; offset: number; index: number } => ({
    length: LIST_ITEM_HEIGHT,
    offset: LIST_ITEM_HEIGHT * index,
    index,
  });

  const { item } = props;
  return (
    <View>
      <AnimatedAccordion
        title={item.title}
        left={() =>
          typeof item.image === 'number' ? (
            <Image source={item.image} style={styles.image} />
          ) : (
            <MaterialCommunityIcons
              name={item.image}
              color={theme.colors.primary}
              size={40}
            />
          )
        }
      >
        <FlatList
          data={item.content}
          extraData={props.activeDashboard.toString()}
          renderItem={getRenderItem}
          listKey={item.key}
          // Performance props, see https://reactnative.dev/docs/optimizing-flatlist-configuration
          getItemLayout={getItemLayout}
          removeClippedSubviews
        />
      </AnimatedAccordion>
    </View>
  );
}

export default DashboardEditAccordion;
