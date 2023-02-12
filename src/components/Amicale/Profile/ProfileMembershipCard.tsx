import React from 'react';
import { Avatar, Card, List, useTheme, Text } from 'react-native-paper';
import i18n from 'i18n-js';
import { StyleSheet } from 'react-native';
import { COTISATION } from '../../../screens/Amicale/ProfileScreen';

type Props = {
  cotisation?: COTISATION;
  valid?: boolean;
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  icon: {
    backgroundColor: 'transparent',
  },
});

export default function ProfileMembershipCard(props: Props) {
  const theme = useTheme();
  let state;
  switch (props?.cotisation) {
    case COTISATION.NONE:
      state = i18n.t('screens.profile.membershipNotPaid');
      break;
    case COTISATION.SEMESTER_1:
      state = i18n.t('screens.profile.membershipPaidSemester1');
      break;
    case COTISATION.SEMESTER_2:
      state = i18n.t('screens.profile.membershipPaidSemester2');
      break;
    case COTISATION.YEARLY:
      state = i18n.t('screens.profile.membershipPaidYearly');
      break;
    case COTISATION.PERMANENT:
      state = i18n.t('screens.profile.membershipPermanent');
      break;
    default:
      state = i18n.t('screens.profile.membershipNotPaid');
  }
  return (
    <Card style={styles.card}>
      <Card.Title
        title={i18n.t('screens.profile.membership')}
        subtitle={i18n.t('screens.profile.membershipSubtitle')}
        left={(iconProps) => (
          <Avatar.Icon
            size={iconProps.size}
            icon="credit-card"
            color={theme.colors.primary}
            style={styles.icon}
          />
        )}
      />
      <Card.Content>
        <List.Section>
          <List.Item
            title={state}
            description={
              props?.valid
                ? undefined
                : i18n.t('screens.profile.membershipNotPaidInstruction')
            }
            left={(leftProps) => (
              <List.Icon
                style={leftProps.style}
                color={props.valid ? theme.colors.success : theme.colors.danger}
                icon={props.valid ? 'check' : 'close'}
              />
            )}
          />
        </List.Section>
      </Card.Content>
    </Card>
  );
}
