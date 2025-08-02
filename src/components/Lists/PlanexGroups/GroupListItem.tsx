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

import React, { useRef } from 'react';
import { List, TouchableRipple, useTheme } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { PlanexGroupType } from '../../../screens/Planex/GroupSelectionScreen';
import { StyleSheet, View } from 'react-native';
import { getPrettierPlanexGroupName } from '../../../utils/Utils';

type Props = {
  onPress: () => void;
  onStarPress: () => void;
  onEditPress: () => void;
  item: PlanexGroupType;
  isFav: boolean;
  height: number;
  subtitle?: string;
};

function GroupListItem(props: Props) {
  const theme = useTheme();

  const starRef = useRef<Animatable.View & View>(null);

  return (
    <List.Item
      title={getPrettierPlanexGroupName(props.item.name)}
      description={props.subtitle}
      onPress={props.onPress}
      left={(iconProps) => (
        <List.Icon
          color={iconProps.color}
          style={iconProps.style}
          icon={'chevron-right'}
        />
      )}
      right={(iconProps) => (
        <View style={styles.iconsView}>
          {props.isFav && (
            <TouchableRipple
              onPress={props.onEditPress}
              style={styles.iconContainer}
              borderless={true}
            >
              <MaterialCommunityIcons
                size={24}
                style={styles.icon}
                name="pencil"
                color={theme.colors.primary}
              />
            </TouchableRipple>
          )}
          <Animatable.View
            ref={starRef}
            useNativeDriver={true}
            animation={props.isFav ? 'rubberBand' : undefined}
          >
            <TouchableRipple
              onPress={props.onStarPress}
              style={styles.iconContainer}
            >
              <MaterialCommunityIcons
                size={30}
                style={styles.icon}
                name="star"
                color={props.isFav ? theme.colors.tetrisScore : iconProps.color}
              />
            </TouchableRipple>
          </Animatable.View>
        </View>
      )}
      style={{
        height: props.height,
        ...styles.item,
      }}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    justifyContent: 'center',
  },
  icon: {
    padding: 10,
  },
  iconContainer: {
    marginRight: 10,
    marginLeft: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  iconsView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default React.memo(
  GroupListItem,
  (pp: Props, np: Props) =>
    pp.isFav === np.isFav && pp.onStarPress === np.onStarPress
);
