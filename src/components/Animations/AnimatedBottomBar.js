// @flow

import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {FAB, IconButton, Surface, withTheme} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import {StackNavigationProp} from '@react-navigation/stack';
import AutoHideHandler from '../../utils/AutoHideHandler';
import CustomTabBar from '../Tabbar/CustomTabBar';
import type {CustomTheme} from '../../managers/ThemeManager';

const AnimatedFAB = Animatable.createAnimatableComponent(FAB);

type PropsType = {
  navigation: StackNavigationProp,
  theme: CustomTheme,
  onPress: (action: string, data?: string) => void,
  seekAttention: boolean,
};

type StateType = {
  currentMode: string,
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
});

class AnimatedBottomBar extends React.Component<PropsType, StateType> {
  ref: {current: null | Animatable.View};

  hideHandler: AutoHideHandler;

  displayModeIcons: {[key: string]: string};

  constructor() {
    super();
    this.state = {
      currentMode: DISPLAY_MODES.WEEK,
    };
    this.ref = React.createRef();
    this.hideHandler = new AutoHideHandler(false);
    this.hideHandler.addListener(this.onHideChange);

    this.displayModeIcons = {};
    this.displayModeIcons[DISPLAY_MODES.DAY] = 'calendar-text';
    this.displayModeIcons[DISPLAY_MODES.WEEK] = 'calendar-week';
    this.displayModeIcons[DISPLAY_MODES.MONTH] = 'calendar-range';
  }

  shouldComponentUpdate(nextProps: PropsType, nextState: StateType): boolean {
    const {props, state} = this;
    return (
      nextProps.seekAttention !== props.seekAttention ||
      nextState.currentMode !== state.currentMode
    );
  }

  onHideChange = (shouldHide: boolean) => {
    if (this.ref.current != null) {
      if (shouldHide) this.ref.current.fadeOutDown(500);
      else this.ref.current.fadeInUp(500);
    }
  };

  onScroll = (event: SyntheticEvent<EventTarget>) => {
    this.hideHandler.onScroll(event);
  };

  changeDisplayMode = () => {
    const {props, state} = this;
    let newMode;
    switch (state.currentMode) {
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
    this.setState({currentMode: newMode});
    props.onPress('changeView', newMode);
  };

  render(): React.Node {
    const {props, state} = this;
    const buttonColor = props.theme.colors.primary;
    return (
      <Animatable.View
        ref={this.ref}
        useNativeDriver
        style={{
          ...styles.container,
          bottom: 10 + CustomTabBar.TAB_BAR_HEIGHT,
        }}>
        <Surface style={styles.surface}>
          <View style={styles.fabContainer}>
            <AnimatedFAB
              animation={props.seekAttention ? 'bounce' : undefined}
              easing="ease-out"
              iterationDelay={500}
              iterationCount="infinite"
              useNativeDriver
              style={styles.fab}
              icon="account-clock"
              onPress={(): void => props.navigation.navigate('group-select')}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <IconButton
              icon={this.displayModeIcons[state.currentMode]}
              color={buttonColor}
              onPress={this.changeDisplayMode}
            />
            <IconButton
              icon="clock-in"
              color={buttonColor}
              style={{marginLeft: 5}}
              onPress={(): void => props.onPress('today')}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <IconButton
              icon="chevron-left"
              color={buttonColor}
              onPress={(): void => props.onPress('prev')}
            />
            <IconButton
              icon="chevron-right"
              color={buttonColor}
              style={{marginLeft: 5}}
              onPress={(): void => props.onPress('next')}
            />
          </View>
        </Surface>
      </Animatable.View>
    );
  }
}

export default withTheme(AnimatedBottomBar);
