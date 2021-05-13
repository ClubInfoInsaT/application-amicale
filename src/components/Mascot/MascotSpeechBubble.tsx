import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Avatar, Button, Card, Paragraph, useTheme } from 'react-native-paper';
import GENERAL_STYLES from '../../constants/Styles';
import SpeechArrow from './SpeechArrow';

export type MascotSpeechBubbleProps = {
  icon: string;
  title: string;
  message: string;
  visible?: boolean;
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
};

type Props = MascotSpeechBubbleProps & {
  onDismiss: (callback?: () => void) => void;
  speechArrowPos: number;
  bubbleMaxHeight: number;
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
});

export default function MascotSpeechBubble(props: Props) {
  const theme = useTheme();
  const getButtons = () => {
    const { action, cancel } = props.buttons;
    return (
      <View style={GENERAL_STYLES.center}>
        {action ? (
          <Button
            style={styles.button}
            mode="contained"
            icon={action.icon}
            color={action.color}
            onPress={() => {
              props.onDismiss(action.onPress);
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
              props.onDismiss(cancel.onPress);
            }}
          >
            {cancel.message}
          </Button>
        ) : null}
      </View>
    );
  };

  return (
    <Animatable.View
      style={styles.speechBubbleContainer}
      useNativeDriver={true}
      animation={props.visible ? 'bounceInLeft' : 'bounceOutLeft'}
      duration={props.visible ? 1000 : 300}
    >
      <SpeechArrow
        style={{ marginLeft: props.speechArrowPos }}
        size={20}
        color={theme.colors.mascotMessageArrow}
      />
      <Card
        style={{
          borderColor: theme.colors.mascotMessageArrow,
          ...styles.speechBubbleCard,
        }}
      >
        <Card.Title
          title={props.title}
          left={
            props.icon
              ? () => (
                  <Avatar.Icon
                    size={48}
                    style={styles.speechBubbleIcon}
                    color={theme.colors.primary}
                    icon={props.icon}
                  />
                )
              : undefined
          }
        />
        <Card.Content
          style={{
            maxHeight: props.bubbleMaxHeight,
          }}
        >
          <ScrollView>
            <Paragraph style={styles.speechBubbleText}>
              {props.message}
            </Paragraph>
          </ScrollView>
        </Card.Content>

        <Card.Actions style={styles.actionsContainer}>
          {getButtons()}
        </Card.Actions>
      </Card>
    </Animatable.View>
  );
}
