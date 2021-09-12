import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Button, Card, Divider, Paragraph } from 'react-native-paper';
import Mascot, { MASCOT_STYLE } from '../../Mascot/Mascot';
import i18n from 'i18n-js';
import { StyleSheet } from 'react-native';
import CardList from '../../Lists/CardList/CardList';
import { getAmicaleServices, SERVICES_KEY } from '../../../utils/Services';
import { MainRoutes } from '../../../navigation/MainNavigator';

type Props = {
  firstname?: string;
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  editButton: {
    marginLeft: 'auto',
  },
  mascot: {
    width: 60,
  },
  title: {
    marginLeft: 10,
  },
});

function ProfileWelcomeCard(props: Props) {
  const navigation = useNavigation();
  return (
    <Card style={styles.card}>
      <Card.Title
        title={i18n.t('screens.profile.welcomeTitle', {
          name: props.firstname,
        })}
        left={() => (
          <Mascot
            style={styles.mascot}
            emotion={MASCOT_STYLE.COOL}
            animated
            entryAnimation={{
              animation: 'bounceIn',
              duration: 1000,
            }}
          />
        )}
        titleStyle={styles.title}
      />
      <Card.Content>
        <Divider />
        <Paragraph>{i18n.t('screens.profile.welcomeDescription')}</Paragraph>
        <CardList
          dataset={getAmicaleServices(
            (route) => navigation.navigate(route),
            true,
            [SERVICES_KEY.PROFILE]
          )}
          isHorizontal={true}
        />
        <Paragraph>{i18n.t('screens.profile.welcomeFeedback')}</Paragraph>
        <Divider />
        <Card.Actions>
          <Button
            icon="bug"
            mode="contained"
            onPress={() => {
              navigation.navigate(MainRoutes.Feedback);
            }}
            style={styles.editButton}
          >
            {i18n.t('screens.feedback.homeButtonTitle')}
          </Button>
        </Card.Actions>
      </Card.Content>
    </Card>
  );
}

export default React.memo(
  ProfileWelcomeCard,
  (pp, np) => pp.firstname === np.firstname
);
