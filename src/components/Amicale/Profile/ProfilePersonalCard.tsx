import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Divider,
  List,
  useTheme,
} from 'react-native-paper';
import Urls from '../../../constants/Urls';
import { ProfileDataType } from '../../../screens/Amicale/ProfileScreen';
import i18n from 'i18n-js';
import { MainRoutes } from '../../../navigation/MainNavigator';

type Props = {
  profile?: ProfileDataType;
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  icon: {
    backgroundColor: 'transparent',
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

function getFieldValue(field?: string): string {
  return field ? field : i18n.t('screens.profile.noData');
}

export default function ProfilePersonalCard(props: Props) {
  const { profile } = props;
  const theme = useTheme();
  const navigation = useNavigation();

  function getPersonalListItem(field: string | undefined, icon: string) {
    const title = field != null ? getFieldValue(field) : ':(';
    const subtitle = field != null ? '' : getFieldValue(field);
    return (
      <List.Item
        title={title}
        description={subtitle}
        left={(leftProps) => (
          <List.Icon
            style={leftProps.style}
            icon={icon}
            color={field != null ? leftProps.color : theme.colors.textDisabled}
          />
        )}
      />
    );
  }

  function getBirthdayDisplayString() {
    let display = i18n.t(
      profile?.minor ? 'screens.profile.minor' : 'screens.profile.nonMinor'
    );

    if (profile?.birthday) display += `(${profile.birthday})`;
    return display;
  }

  return (
    <Card style={styles.card}>
      <Card.Title
        title={`${profile?.firstName} ${profile?.lastName}`}
        subtitle={profile?.email}
        left={(iconProps) => (
          <Avatar.Icon
            size={iconProps.size}
            icon="account"
            color={theme.colors.primary}
            style={styles.icon}
          />
        )}
      />
      <Card.Content>
        <Divider />
        <List.Section>
          <List.Subheader>
            {i18n.t('screens.profile.personalInformation')}
          </List.Subheader>
          {getPersonalListItem(getBirthdayDisplayString(), 'cake-variant')}
          {getPersonalListItem(profile?.phone, 'phone')}
          {getPersonalListItem(profile?.email, 'email')}
          {getPersonalListItem(profile?.groupInsa, 'school')}
        </List.Section>
        <Divider />
        <Card.Actions>
          <Button
            icon="account-edit"
            mode="contained"
            onPress={() => {
              navigation.navigate(MainRoutes.Website, {
                host: Urls.websites.amicale,
                path: profile?.link,
                title: i18n.t('screens.websites.amicale'),
              });
            }}
            style={styles.editButton}
          >
            {i18n.t('screens.profile.editInformation')}
          </Button>
        </Card.Actions>
      </Card.Content>
    </Card>
  );
}
