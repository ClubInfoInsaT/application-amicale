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

import React, { useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { FAB, IconButton, Surface, useTheme } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { TAB_BAR_HEIGHT } from '../Tabbar/CustomTabBar';
import { useNavigation } from '@react-navigation/core';
import { useCollapsible } from '../../context/CollapsibleContext';

type Props = {
  onPress: (action: string, data?: string) => void;
  seekAttention: boolean;
};

const DISPLAY_MODES = {
  DAY: 'agendaDay',
  WEEK: 'agendaWeek',
  MONTH: 'month',
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '5%',
    width: '90%',
  },
  surface: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    elevation: 2,
  },
  fabContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    top: '-25%',
  },
  side: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 5,
  },
});

const DISPLAY_MODE_ICONS = {
  [DISPLAY_MODES.DAY]: 'calendar-text',
  [DISPLAY_MODES.WEEK]: 'calendar-week',
  [DISPLAY_MODES.MONTH]: 'calendar-range',
};

function PlanexBottomBar(props: Props) {
  const navigation = useNavigation();
  const theme = useTheme();
  const [currentMode, setCurrentMode] = useState(DISPLAY_MODES.WEEK);

  const { collapsible } = useCollapsible();

  const changeDisplayMode = () => {
    let newMode;
    switch (currentMode) {
      case DISPLAY_MODES.DAY:
        newMode = DISPLAY_MODES.WEEK;
        break;
      case DISPLAY_MODES.WEEK:
        newMode = DISPLAY_MODES.MONTH;
        break;
      case DISPLAY_MODES.MONTH:
        newMode = DISPLAY_MODES.DAY;
        break;
      default:
        newMode = DISPLAY_MODES.WEEK;
        break;
    }
    setCurrentMode(newMode);
    props.onPress('changeView', newMode);
  };

  let translateY: number | Animated.AnimatedInterpolation = 0;
  let opacity: number | Animated.AnimatedInterpolation = 1;
  let scale: number | Animated.AnimatedInterpolation = 1;
  if (collapsible) {
    translateY = Animated.multiply(-3, collapsible.translateY);
    opacity = Animated.subtract(1, collapsible.progress);
    scale = Animated.add(
      0.5,
      Animated.multiply(0.5, Animated.subtract(1, collapsible.progress))
    );
  }

  const buttonColor = theme.colors.primary;
  return (
    <Animated.View
      style={{
        ...styles.container,
        bottom: 10 + TAB_BAR_HEIGHT,
        transform: [{ translateY: translateY }, { scale: scale }],
        opacity: opacity,
      }}
    >
      <Surface style={styles.surface}>
        <View style={styles.fabContainer}>
          <Animatable.View
            style={styles.fab}
            animation={props.seekAttention ? 'bounce' : undefined}
            easing={'ease-out'}
            iterationDelay={500}
            iterationCount={'infinite'}
            useNativeDriver={true}
          >
            <FAB
              icon={'account-clock'}
              onPress={() => navigation.navigate('group-select')}
            />
          </Animatable.View>
        </View>
        <View style={styles.side}>
          <IconButton
            icon={DISPLAY_MODE_ICONS[currentMode]}
            color={buttonColor}
            onPress={changeDisplayMode}
          />
          <IconButton
            icon="clock-in"
            color={buttonColor}
            style={styles.icon}
            onPress={() => props.onPress('today')}
          />
        </View>
        <View style={styles.side}>
          <IconButton
            icon="chevron-left"
            color={buttonColor}
            onPress={() => props.onPress('prev')}
          />
          <IconButton
            icon="chevron-right"
            color={buttonColor}
            style={styles.icon}
            onPress={() => props.onPress('next')}
          />
        </View>
      </Surface>
    </Animated.View>
  );
}

export default PlanexBottomBar;
