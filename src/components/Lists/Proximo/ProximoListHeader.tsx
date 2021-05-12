import React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import TimeAgo from 'react-native-timeago';
import i18n from 'i18n-js';
import { useNavigation } from '@react-navigation/core';
import { MainRoutes } from '../../../navigation/MainNavigator';
import ProxiwashConstants from '../../../constants/ProxiwashConstants';

let moment = require('moment'); //load moment module to set local language
require('moment/locale/fr'); // import moment local language file during the application build
moment.locale('fr');

type Props = {
  date?: Date;
  selectedWash: 'tripodeB' | 'washinsa';
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 5,
  },
  actions: {
    justifyContent: 'center',
  },
});

function ProximoListHeader(props: Props) {
  const navigation = useNavigation();
  const { date, selectedWash } = props;
  let title = i18n.t('screens.proxiwash.washinsa.title');
  let icon = ProxiwashConstants.washinsa.icon;
  if (selectedWash === 'tripodeB') {
    title = i18n.t('screens.proxiwash.tripodeB.title');
    icon = ProxiwashConstants.tripodeB.icon;
  }
  return (
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
        left={(iconProps) => <Avatar.Icon icon={icon} size={iconProps.size} />}
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
  );
}

export default ProximoListHeader;
