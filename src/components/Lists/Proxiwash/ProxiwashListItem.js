// @flow

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
import ProxiwashConstants from '../../../constants/ProxiwashConstants';
import AprilFoolsManager from '../../../managers/AprilFoolsManager';
import type {CustomTheme} from '../../../managers/ThemeManager';
import type {ProxiwashMachineType} from '../../../screens/Proxiwash/ProxiwashScreen';

type PropsType = {
  item: ProxiwashMachineType,
  theme: CustomTheme,
  onPress: (
    title: string,
    item: ProxiwashMachineType,
    isDryer: boolean,
  ) => void,
  isWatched: boolean,
  isDryer: boolean,
  height: number,
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
  stateColors: {[key: string]: string};

  stateStrings: {[key: string]: string};

  title: string;

  constructor(props: PropsType) {
    super(props);
    this.stateColors = {};
    this.stateStrings = {};

    this.updateStateStrings();

    let displayNumber = props.item.number;
    if (AprilFoolsManager.getInstance().isAprilFoolsEnabled())
      displayNumber = AprilFoolsManager.getProxiwashMachineDisplayNumber(
        parseInt(props.item.number, 10),
      );

    this.title = props.isDryer
      ? i18n.t('screens.proxiwash.dryer')
      : i18n.t('screens.proxiwash.washer');
    this.title += ` n°${displayNumber}`;
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
    props.onPress(this.title, props.item, props.isDryer);
  };

  updateStateStrings() {
    this.stateStrings[ProxiwashConstants.machineStates.AVAILABLE] = i18n.t(
      'screens.proxiwash.states.ready',
    );
    this.stateStrings[ProxiwashConstants.machineStates.RUNNING] = i18n.t(
      'screens.proxiwash.states.running',
    );
    this.stateStrings[
      ProxiwashConstants.machineStates.RUNNING_NOT_STARTED
    ] = i18n.t('screens.proxiwash.states.runningNotStarted');
    this.stateStrings[ProxiwashConstants.machineStates.FINISHED] = i18n.t(
      'screens.proxiwash.states.finished',
    );
    this.stateStrings[ProxiwashConstants.machineStates.UNAVAILABLE] = i18n.t(
      'screens.proxiwash.states.broken',
    );
    this.stateStrings[ProxiwashConstants.machineStates.ERROR] = i18n.t(
      'screens.proxiwash.states.error',
    );
    this.stateStrings[ProxiwashConstants.machineStates.UNKNOWN] = i18n.t(
      'screens.proxiwash.states.unknown',
    );
  }

  updateStateColors() {
    const {props} = this;
    const {colors} = props.theme;
    this.stateColors[ProxiwashConstants.machineStates.AVAILABLE] =
      colors.proxiwashReadyColor;
    this.stateColors[ProxiwashConstants.machineStates.RUNNING] =
      colors.proxiwashRunningColor;
    this.stateColors[ProxiwashConstants.machineStates.RUNNING_NOT_STARTED] =
      colors.proxiwashRunningNotStartedColor;
    this.stateColors[ProxiwashConstants.machineStates.FINISHED] =
      colors.proxiwashFinishedColor;
    this.stateColors[ProxiwashConstants.machineStates.UNAVAILABLE] =
      colors.proxiwashBrokenColor;
    this.stateColors[ProxiwashConstants.machineStates.ERROR] =
      colors.proxiwashErrorColor;
    this.stateColors[ProxiwashConstants.machineStates.UNKNOWN] =
      colors.proxiwashUnknownColor;
  }

  render(): React.Node {
    const {props} = this;
    const {colors} = props.theme;
    const machineState = props.item.state;
    const isRunning = machineState === ProxiwashConstants.machineStates.RUNNING;
    const isReady = machineState === ProxiwashConstants.machineStates.AVAILABLE;
    const description = isRunning
      ? `${props.item.startTime}/${props.item.endTime}`
      : '';
    const stateIcon = ProxiwashConstants.stateIcons[machineState];
    const stateString = this.stateStrings[machineState];
    let progress;
    if (isRunning && props.item.donePercent !== '')
      progress = parseFloat(props.item.donePercent) / 100;
    else if (isRunning) progress = 0;
    else progress = 1;

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
          left={(): React.Node => icon}
          right={(): React.Node => (
            <View style={{flexDirection: 'row'}}>
              <View style={{justifyContent: 'center'}}>
                <Text
                  style={
                    machineState === ProxiwashConstants.machineStates.FINISHED
                      ? {fontWeight: 'bold'}
                      : {}
                  }>
                  {stateString}
                </Text>
                {machineState === ProxiwashConstants.machineStates.RUNNING ? (
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
