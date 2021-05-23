import React from 'react';
import { Avatar, Card, List, useTheme } from 'react-native-paper';
import i18n from 'i18n-js';
import { StyleSheet } from 'react-native';

type Props = {
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
  const state = props.valid === true;
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
            title={
              state
                ? i18n.t('screens.profile.membershipPayed')
                : i18n.t('screens.profile.membershipNotPayed')
            }
            left={(leftProps) => (
              <List.Icon
                style={leftProps.style}
                color={state ? theme.colors.success : theme.colors.danger}
                icon={state ? 'check' : 'close'}
              />
            )}
          />
        </List.Section>
      </Card.Content>
    </Card>
  );
}
