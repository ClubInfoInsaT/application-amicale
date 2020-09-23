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
import {
  Avatar,
  Caption,
  List,
  ProgressBar,
  Surface,
  Text,
  withTheme,
} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import i18n from 'i18n-js';
import * as Animatable from 'react-native-animatable';
import ProxiwashConstants, {
  MachineStates,
} from '../../../constants/ProxiwashConstants';
import AprilFoolsManager from '../../../managers/AprilFoolsManager';
import type {ProxiwashMachineType} from '../../../screens/Proxiwash/ProxiwashScreen';

type PropsType = {
  item: ProxiwashMachineType;
  theme: ReactNativePaper.Theme;
  onPress: (
    title: string,
    item: ProxiwashMachineType,
    isDryer: boolean,
  ) => void;
  isWatched: boolean;
  isDryer: boolean;
  height: number;
};

const AnimatedIcon = Animatable.createAnimatableComponent(Avatar.Icon);

const styles = StyleSheet.create({
  container: {
    margin: 5,
    justifyContent: 'center',
    elevation: 1,
  },
  icon: {
    backgroundColor: 'transparent',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    borderRadius: 4,
  },
});

/**
 * Component used to display a proxiwash item, showing machine progression and state
 */
class ProxiwashListItem extends React.Component<PropsType> {
  stateStrings: {[key in MachineStates]: string} = {
    [MachineStates.AVAILABLE]: i18n.t('screens.proxiwash.states.ready'),
    [MachineStates.RUNNING]: i18n.t('screens.proxiwash.states.running'),
    [MachineStates.RUNNING_NOT_STARTED]: i18n.t(
      'screens.proxiwash.states.runningNotStarted',
    ),
    [MachineStates.FINISHED]: i18n.t('screens.proxiwash.states.finished'),
    [MachineStates.UNAVAILABLE]: i18n.t('screens.proxiwash.states.broken'),
    [MachineStates.ERROR]: i18n.t('screens.proxiwash.states.error'),
    [MachineStates.UNKNOWN]: i18n.t('screens.proxiwash.states.unknown'),
  };

  stateColors: {[key: string]: string};

  title: string;

  titlePopUp: string;

  constructor(props: PropsType) {
    super(props);
    this.stateColors = {};

    let displayNumber = props.item.number;
    const displayMaxWeight = props.item.maxWeight;
    if (AprilFoolsManager.getInstance().isAprilFoolsEnabled()) {
      displayNumber = AprilFoolsManager.getProxiwashMachineDisplayNumber(
        parseInt(props.item.number, 10),
      );
    }

    this.title = props.isDryer
      ? i18n.t('screens.proxiwash.dryer')
      : i18n.t('screens.proxiwash.washer');
    this.title += ` n°${displayNumber}`;
    this.titlePopUp = `${this.title} - ${displayMaxWeight} kg`;
  }

  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {props} = this;
    return (
      nextProps.theme.dark !== props.theme.dark ||
      nextProps.item.state !== props.item.state ||
      nextProps.item.donePercent !== props.item.donePercent ||
      nextProps.isWatched !== props.isWatched
    );
  }

  onListItemPress = () => {
    const {props} = this;
    props.onPress(this.titlePopUp, props.item, props.isDryer);
  };

  updateStateColors() {
    const {props} = this;
    const {colors} = props.theme;
    this.stateColors[MachineStates.AVAILABLE] = colors.proxiwashReadyColor;
    this.stateColors[MachineStates.RUNNING] = colors.proxiwashRunningColor;
    this.stateColors[MachineStates.RUNNING_NOT_STARTED] =
      colors.proxiwashRunningNotStartedColor;
    this.stateColors[MachineStates.FINISHED] = colors.proxiwashFinishedColor;
    this.stateColors[MachineStates.UNAVAILABLE] = colors.proxiwashBrokenColor;
    this.stateColors[MachineStates.ERROR] = colors.proxiwashErrorColor;
    this.stateColors[MachineStates.UNKNOWN] = colors.proxiwashUnknownColor;
  }

  render() {
    const {props} = this;
    const {colors} = props.theme;
    const machineState = props.item.state;
    const isRunning = machineState === MachineStates.RUNNING;
    const isReady = machineState === MachineStates.AVAILABLE;
    const description = isRunning
      ? `${props.item.startTime}/${props.item.endTime}`
      : '';
    const stateIcon = ProxiwashConstants.stateIcons[machineState];
    const stateString = this.stateStrings[machineState];
    let progress;
    if (isRunning && props.item.donePercent !== '') {
      progress = parseFloat(props.item.donePercent) / 100;
    } else if (isRunning) {
      progress = 0;
    } else {
      progress = 1;
    }

    const icon = props.isWatched ? (
      <AnimatedIcon
        icon="bell-ring"
        animation="rubberBand"
        useNativeDriver
        size={50}
        color={colors.primary}
        style={styles.icon}
      />
    ) : (
      <AnimatedIcon
        icon={props.isDryer ? 'tumble-dryer' : 'washing-machine'}
        animation={isRunning ? 'pulse' : undefined}
        iterationCount="infinite"
        easing="linear"
        duration={1000}
        useNativeDriver
        size={40}
        color={colors.text}
        style={styles.icon}
      />
    );
    this.updateStateColors();
    return (
      <Surface
        style={{
          ...styles.container,
          height: props.height,
          borderRadius: 4,
        }}>
        {!isReady ? (
          <ProgressBar
            style={{
              ...styles.progressBar,
              height: props.height,
            }}
            progress={progress}
            color={this.stateColors[machineState]}
          />
        ) : null}
        <List.Item
          title={this.title}
          description={description}
          style={{
            height: props.height,
            justifyContent: 'center',
          }}
          onPress={this.onListItemPress}
          left={() => icon}
          right={() => (
            <View style={{flexDirection: 'row'}}>
              <View style={{justifyContent: 'center'}}>
                <Text
                  style={
                    machineState === MachineStates.FINISHED
                      ? {fontWeight: 'bold'}
                      : {}
                  }>
                  {stateString}
                </Text>
                {machineState === MachineStates.RUNNING ? (
                  <Caption>{props.item.remainingTime} min</Caption>
                ) : null}
              </View>
              <View style={{justifyContent: 'center'}}>
                <Avatar.Icon
                  icon={stateIcon}
                  color={colors.text}
                  size={30}
                  style={styles.icon}
                />
              </View>
            </View>
          )}
        />
      </Surface>
    );
  }
}

export default withTheme(ProxiwashListItem);
