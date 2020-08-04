// @flow

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
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Mascot from './Mascot';
import type {CustomTheme} from '../../managers/ThemeManager';
import SpeechArrow from './SpeechArrow';
import AsyncStorageManager from '../../managers/AsyncStorageManager';

type PropsType = {
  theme: CustomTheme,
  icon: string,
  title: string,
  message: string,
  buttons: {
    action: {
      message: string,
      icon: string | null,
      color: string | null,
      onPress?: () => void,
    },
    cancel: {
      message: string,
      icon: string | null,
      color: string | null,
      onPress?: () => void,
    },
  },
  emotion: number,
  visible?: boolean,
  prefKey?: string,
};

type StateType = {
  shouldRenderDialog: boolean, // Used to stop rendering after hide animation
  dialogVisible: boolean,
};

/**
 * Component used to display a popup with the mascot.
 */
class MascotPopup extends React.Component<PropsType, StateType> {
  static defaultProps = {
    visible: null,
    prefKey: null,
  };

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

  componentDidMount(): * {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.onBackButtonPressAndroid,
    );
  }

  shouldComponentUpdate(nextProps: PropsType, nextState: StateType): boolean {
    const {props, state} = this;
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
    const {state, props} = this;
    if (state.dialogVisible) {
      const {cancel} = props.buttons;
      const {action} = props.buttons;
      if (cancel != null) this.onDismiss(cancel.onPress);
      else this.onDismiss(action.onPress);
      return true;
    }
    return false;
  };

  getSpeechBubble(): React.Node {
    const {state, props} = this;
    return (
      <Animatable.View
        style={{
          marginLeft: '10%',
          marginRight: '10%',
        }}
        useNativeDriver
        animation={state.dialogVisible ? 'bounceInLeft' : 'bounceOutLeft'}
        duration={state.dialogVisible ? 1000 : 300}>
        <SpeechArrow
          style={{marginLeft: this.mascotSize / 3}}
          size={20}
          color={props.theme.colors.mascotMessageArrow}
        />
        <Card
          style={{
            borderColor: props.theme.colors.mascotMessageArrow,
            borderWidth: 4,
            borderRadius: 10,
          }}>
          <Card.Title
            title={props.title}
            left={
              props.icon != null
                ? (): React.Node => (
                    <Avatar.Icon
                      size={48}
                      style={{backgroundColor: 'transparent'}}
                      color={props.theme.colors.primary}
                      icon={props.icon}
                    />
                  )
                : null
            }
          />
          <Card.Content
            style={{
              maxHeight: this.windowHeight / 3,
            }}>
            <ScrollView>
              <Paragraph style={{marginBottom: 10}}>{props.message}</Paragraph>
            </ScrollView>
          </Card.Content>

          <Card.Actions style={{marginTop: 10, marginBottom: 10}}>
            {this.getButtons()}
          </Card.Actions>
        </Card>
      </Animatable.View>
    );
  }

  getMascot(): React.Node {
    const {props, state} = this;
    return (
      <Animatable.View
        useNativeDriver
        animation={state.dialogVisible ? 'bounceInLeft' : 'bounceOutLeft'}
        duration={state.dialogVisible ? 1500 : 200}>
        <Mascot
          style={{width: this.mascotSize}}
          animated
          emotion={props.emotion}
        />
      </Animatable.View>
    );
  }

  getButtons(): React.Node {
    const {props} = this;
    const {action} = props.buttons;
    const {cancel} = props.buttons;
    return (
      <View
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 'auto',
          marginBottom: 'auto',
        }}>
        {action != null ? (
          <Button
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: 10,
            }}
            mode="contained"
            icon={action.icon}
            color={action.color}
            onPress={() => {
              this.onDismiss(action.onPress);
            }}>
            {action.message}
          </Button>
        ) : null}
        {cancel != null ? (
          <Button
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            mode="contained"
            icon={cancel.icon}
            color={cancel.color}
            onPress={() => {
              this.onDismiss(cancel.onPress);
            }}>
            {cancel.message}
          </Button>
        ) : null}
      </View>
    );
  }

  getBackground(): React.Node {
    const {props, state} = this;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.onDismiss(props.buttons.cancel.onPress);
        }}>
        <Animatable.View
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.7)',
            width: '100%',
            height: '100%',
          }}
          useNativeDriver
          animation={state.dialogVisible ? 'fadeIn' : 'fadeOut'}
          duration={state.dialogVisible ? 300 : 300}
        />
      </TouchableWithoutFeedback>
    );
  }

  onDismiss = (callback?: () => void) => {
    const {prefKey} = this.props;
    if (prefKey != null) {
      AsyncStorageManager.set(prefKey, false);
      this.setState({dialogVisible: false});
    }
    if (callback != null) callback();
  };

  render(): React.Node {
    const {shouldRenderDialog} = this.state;
    if (shouldRenderDialog) {
      return (
        <Portal>
          {this.getBackground()}
          <View
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
            }}>
            <View
              style={{
                marginTop: -80,
                width: '100%',
              }}>
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
