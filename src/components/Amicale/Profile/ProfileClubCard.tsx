import React from 'react';
import { Card, Avatar, Divider, useTheme, List } from 'react-native-paper';
import i18n from 'i18n-js';
import { FlatList, StyleSheet } from 'react-native';
import { ProfileClubType } from '../../../screens/Amicale/ProfileScreen';
import { useNavigation } from '@react-navigation/core';
import { MainRoutes } from '../../../navigation/MainNavigator';

type Props = {
  clubs?: Array<ProfileClubType>;
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  icon: {
    backgroundColor: 'transparent',
  },
});

export default function ProfileClubCard(props: Props) {
  const theme = useTheme();
  const navigation = useNavigation();

  const clubKeyExtractor = (item: ProfileClubType) => item.name;

  const getClubListItem = ({ item }: { item: ProfileClubType }) => {
    const onPress = () =>
      navigation.navigate(MainRoutes.ClubInformation, {
        type: 'id',
        clubId: item.id,
      });
    let description = i18n.t('screens.profile.isMember');
    let icon = (leftProps: {
      color: string;
      style: {
        marginLeft: number;
        marginRight: number;
        marginVertical?: number;
      };
    }) => (
      <List.Icon
        color={leftProps.color}
        style={leftProps.style}
        icon="chevron-right"
      />
    );
    if (item.is_manager) {
      description = i18n.t('screens.profile.isManager');
      icon = (leftProps) => (
        <List.Icon
          style={leftProps.style}
          icon="star"
          color={theme.colors.primary}
        />
      );
    }
    return (
      <List.Item
        title={item.name}
        description={description}
        left={icon}
        onPress={onPress}
      />
    );
  };

  function getClubList(list: Array<ProfileClubType> | undefined) {
    if (!list) {
      return null;
    }

    list.sort((a) => (a.is_manager ? -1 : 1));
    return (
      <FlatList
        renderItem={getClubListItem}
        keyExtractor={clubKeyExtractor}
        data={list}
      />
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Title
        title={i18n.t('screens.profile.clubs')}
        subtitle={i18n.t('screens.profile.clubsSubtitle')}
        left={(iconProps) => (
          <Avatar.Icon
            size={iconProps.size}
            icon="account-group"
            color={theme.colors.primary}
            style={styles.icon}
          />
        )}
      />
      <Card.Content>
        <Divider />
        {getClubList(props.clubs)}
      </Card.Content>
    </Card>
  );
}
