import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import TimeAgo from 'react-native-timeago';
import i18n from 'i18n-js';

let moment = require('moment'); //load moment module to set local language
require('moment/locale/fr'); // import moment local language file during the application build
moment.locale('fr');

type Props = {
  date?: Date;
  selectedWash: 'tripodeB' | 'washinsa';
};

const styles = StyleSheet.create({
  card: { marginHorizontal: 5 },
});

function ProximoListHeader(props: Props) {
  const { date, selectedWash } = props;
  let title = i18n.t('screens.proxiwash.washinsa.title');
  if (selectedWash === 'tripodeB') {
    title = i18n.t('screens.proxiwash.tripodeB.title');
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
      />
    </Card>
  );
}

export default ProximoListHeader;
