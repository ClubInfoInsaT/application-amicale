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
  Button,
  Card,
  Paragraph,
  Portal,
  withTheme,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import {
  BackHandler,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Mascot from './Mascot';
import SpeechArrow from './SpeechArrow';
import AsyncStorageManager from '../../managers/AsyncStorageManager';
import GENERAL_STYLES from '../../constants/Styles';

type PropsType = {
  theme: ReactNativePaper.Theme;
  icon: string;
  title: string;
  message: string;
  buttons: {
    action?: {
      message: string;
      icon?: string;
      color?: string;
      onPress?: () => void;
    };
    cancel?: {
      message: string;
      icon?: string;
      color?: string;
      onPress?: () => void;
    };
  };
  emotion: number;
  visible?: boolean;
  prefKey?: string;
};

type StateType = {
  shouldRenderDialog: boolean; // Used to stop rendering after hide animation
  dialogVisible: boolean;
};

const styles = StyleSheet.create({
  speechBubbleContainer: {
    marginLeft: '10%',
    marginRight: '10%',
  },
  speechBubbleCard: {
    borderWidth: 4,
    borderRadius: 10,
  },
  speechBubbleIcon: {
    backgroundColor: 'transparent',
  },
  speechBubbleText: {
    marginBottom: 10,
  },
  actionsContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    ...GENERAL_STYLES.centerHorizontal,
    marginBottom: 10,
  },
  background: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: '100%',
    height: '100%',
  },
  container: {
    marginTop: -80,
    width: '100%',
  },
});

/**
 * Component used to display a popup with the mascot.
 */
class MascotPopup extends React.Component<PropsType, StateType> {
  mascotSize: number;

  windowWidth: number;

  windowHeight: number;

  constructor(props: PropsType) {
    super(props);

    this.windowWidth = Dimensions.get('window').width;
    this.windowHeight = Dimensions.get('window').height;

    this.mascotSize = Dimensions.get('window').height / 6;

    if (props.visible != null) {
      this.state = {
        shouldRenderDialog: props.visible,
        dialogVisible: props.visible,
      };
    } else if (props.prefKey != null) {
      const visible = AsyncStorageManager.getBool(props.prefKey);
      this.state = {
        shouldRenderDialog: visible,
        dialogVisible: visible,
      };
    } else {
      this.state = {
        shouldRenderDialog: false,
        dialogVisible: false,
      };
    }
  }

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.onBackButtonPressAndroid
    );
  }

  shouldComponentUpdate(nextProps: PropsType, nextState: StateType): boolean {
    // TODO this is so dirty it shouldn't even work
    const { props, state } = this;
    if (nextProps.visible) {
      this.state.shouldRenderDialog = true;
      this.state.dialogVisible = true;
    } else if (
      nextProps.visible !== props.visible ||
      (!nextState.dialogVisible &&
        nextState.dialogVisible !== state.dialogVisible)
    ) {
      this.state.dialogVisible = false;
      setTimeout(this.onAnimationEnd, 300);
    }
    return true;
  }

  onAnimationEnd = () => {
    this.setState({
      shouldRenderDialog: false,
    });
  };

  onBackButtonPressAndroid = (): boolean => {
    const { state, props } = this;
    if (state.dialogVisible) {
      const { cancel } = props.buttons;
      const { action } = props.buttons;
      if (cancel) {
        this.onDismiss(cancel.onPress);
      } else if (action) {
        this.onDismiss(action.onPress);
      } else {
        this.onDismiss();
      }

      return true;
    }
    return false;
  };

  getSpeechBubble() {
    const { state, props } = this;
    return (
      <Animatable.View
        style={styles.speechBubbleContainer}
        useNativeDriver
        animation={state.dialogVisible ? 'bounceInLeft' : 'bounceOutLeft'}
        duration={state.dialogVisible ? 1000 : 300}
      >
        <SpeechArrow
          style={{ marginLeft: this.mascotSize / 3 }}
          size={20}
          color={props.theme.colors.mascotMessageArrow}
        />
        <Card
          style={{
            borderColor: props.theme.colors.mascotMessageArrow,
            ...styles.speechBubbleCard,
          }}
        >
          <Card.Title
            title={props.title}
            left={
              props.icon != null
                ? () => (
                    <Avatar.Icon
                      size={48}
                      style={styles.speechBubbleIcon}
                      color={props.theme.colors.primary}
                      icon={props.icon}
                    />
                  )
                : undefined
            }
          />
          <Card.Content
            style={{
              maxHeight: this.windowHeight / 3,
            }}
          >
            <ScrollView>
              <Paragraph style={styles.speechBubbleText}>
                {props.message}
              </Paragraph>
            </ScrollView>
          </Card.Content>

          <Card.Actions style={styles.actionsContainer}>
            {this.getButtons()}
          </Card.Actions>
        </Card>
      </Animatable.View>
    );
  }

  getMascot() {
    const { props, state } = this;
    return (
      <Animatable.View
        useNativeDriver
        animation={state.dialogVisible ? 'bounceInLeft' : 'bounceOutLeft'}
        duration={state.dialogVisible ? 1500 : 200}
      >
        <Mascot
          style={{ width: this.mascotSize }}
          animated
          emotion={props.emotion}
        />
      </Animatable.View>
    );
  }

  getButtons() {
    const { props } = this;
    const { action } = props.buttons;
    const { cancel } = props.buttons;
    return (
      <View style={GENERAL_STYLES.center}>
        {action != null ? (
          <Button
            style={styles.button}
            mode="contained"
            icon={action.icon}
            color={action.color}
            onPress={() => {
              this.onDismiss(action.onPress);
            }}
          >
            {action.message}
          </Button>
        ) : null}
        {cancel != null ? (
          <Button
            style={styles.button}
            mode="contained"
            icon={cancel.icon}
            color={cancel.color}
            onPress={() => {
              this.onDismiss(cancel.onPress);
            }}
          >
            {cancel.message}
          </Button>
        ) : null}
      </View>
    );
  }

  getBackground() {
    const { props, state } = this;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.onDismiss(props.buttons.cancel?.onPress);
        }}
      >
        <Animatable.View
          style={styles.background}
          useNativeDriver
          animation={state.dialogVisible ? 'fadeIn' : 'fadeOut'}
          duration={state.dialogVisible ? 300 : 300}
        />
      </TouchableWithoutFeedback>
    );
  }

  onDismiss = (callback?: () => void) => {
    const { prefKey } = this.props;
    if (prefKey != null) {
      AsyncStorageManager.set(prefKey, false);
      this.setState({ dialogVisible: false });
    }
    if (callback != null) {
      callback();
    }
  };

  render() {
    const { shouldRenderDialog } = this.state;
    if (shouldRenderDialog) {
      return (
        <Portal>
          {this.getBackground()}
          <View style={GENERAL_STYLES.centerVertical}>
            <View style={styles.container}>
              {this.getMascot()}
              {this.getSpeechBubble()}
            </View>
          </View>
        </Portal>
      );
    }
    return null;
  }
}

export default withTheme(MascotPopup);
