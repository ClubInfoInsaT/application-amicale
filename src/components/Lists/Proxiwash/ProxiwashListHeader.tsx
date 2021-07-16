import React from 'react';
import { Linking, StyleSheet } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Paragraph,
  Text,
  useTheme,
} from 'react-native-paper';
import TimeAgo from 'react-native-timeago';
import i18n from 'i18n-js';
import { useNavigation } from '@react-navigation/core';
import { MainRoutes } from '../../../navigation/MainNavigator';
import ProxiwashConstants from '../../../constants/ProxiwashConstants';
import { ProxiwashInfoType } from '../../../screens/Proxiwash/ProxiwashScreen';
import * as Animatable from 'react-native-animatable';

let moment = require('moment'); //load moment module to set local language
require('moment/locale/fr'); // import moment local language file during the application build
moment.locale('fr');

type Props = {
  date?: Date;
  selectedWash: 'tripodeB' | 'washinsa';
  info?: ProxiwashInfoType;
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 5,
  },
  messageCard: {
    marginTop: 50,
    marginBottom: 10,
  },
  actions: {
    justifyContent: 'center',
  },
});

function ProxiwashListHeader(props: Props) {
  const navigation = useNavigation();
  const theme = useTheme();
  const { date, selectedWash } = props;
  let title = i18n.t('screens.proxiwash.washinsa.title');
  let icon = ProxiwashConstants.washinsa.icon;
  if (selectedWash === 'tripodeB') {
    title = i18n.t('screens.proxiwash.tripodeB.title');
    icon = ProxiwashConstants.tripodeB.icon;
  }
  const message = props.info?.message;
  return (
    <>
      <Card style={styles.card}>
        <Card.Title
          title={title}
          subtitle={
            date ? (
              <Text>
                {i18n.t('screens.proxiwash.updated')}
                <TimeAgo time={date} interval={2000} />
              </Text>
            ) : null
          }
          left={(iconProps) => (
            <Avatar.Icon icon={icon} size={iconProps.size} />
          )}
        />
        <Card.Actions style={styles.actions}>
          <Button
            mode={'contained'}
            onPress={() => navigation.navigate(MainRoutes.Settings)}
            icon={'swap-horizontal'}
          >
            {i18n.t('screens.proxiwash.switch')}
          </Button>
        </Card.Actions>
      </Card>
      {message ? (
        <Card
          style={{
            ...styles.card,
            ...styles.messageCard,
          }}
        >
          <Animatable.View
            useNativeDriver={false}
            animation={'flash'}
            iterationCount={'infinite'}
            duration={2000}
          >
            <Card.Title
              title={i18n.t('screens.proxiwash.errors.title')}
              titleStyle={{
                color: theme.colors.primary,
              }}
              left={(iconProps) => (
                <Avatar.Icon icon={'alert'} size={iconProps.size} />
              )}
            />
          </Animatable.View>
          <Card.Content>
            <Paragraph
              style={{
                color: theme.colors.warning,
              }}
            >
              {message}
            </Paragraph>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <Button
              mode={'contained'}
              onPress={() =>
                Linking.openURL(ProxiwashConstants[selectedWash].webPageUrl)
              }
              icon={'open-in-new'}
            >
              {i18n.t('screens.proxiwash.errors.button')}
            </Button>
          </Card.Actions>
        </Card>
      ) : null}
    </>
  );
}

export default ProxiwashListHeader;
