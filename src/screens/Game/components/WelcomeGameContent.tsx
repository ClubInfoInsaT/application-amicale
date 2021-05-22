import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Card,
  Divider,
  Headline,
  Paragraph,
  useTheme,
} from 'react-native-paper';
import Mascot, { MASCOT_STYLE } from '../../../components/Mascot/Mascot';
import SpeechArrow from '../../../components/Mascot/SpeechArrow';
import i18n from 'i18n-js';

const styles = StyleSheet.create({
  welcomeMascot: {
    width: '40%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  welcomeCard: {
    borderWidth: 2,
    marginLeft: 10,
    marginRight: 10,
  },
  speechArrow: {
    marginLeft: '60%',
  },
  welcomeText: {
    textAlign: 'center',
    marginTop: 10,
  },
  centertext: {
    textAlign: 'center',
  },
});

export default function WelcomeGameContent() {
  const theme = useTheme();
  return (
    <View>
      <Mascot emotion={MASCOT_STYLE.COOL} style={styles.welcomeMascot} />
      <SpeechArrow
        style={styles.speechArrow}
        size={20}
        color={theme.colors.mascotMessageArrow}
      />
      <Card
        style={{
          borderColor: theme.colors.mascotMessageArrow,
          ...styles.welcomeCard,
        }}
      >
        <Card.Content>
          <Headline
            style={{
              color: theme.colors.primary,
              ...styles.centertext,
            }}
          >
            {i18n.t('screens.game.welcomeTitle')}
          </Headline>
          <Divider />
          <Paragraph style={styles.welcomeText}>
            {i18n.t('screens.game.welcomeMessage')}
          </Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
}
