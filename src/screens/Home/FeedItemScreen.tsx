/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import MaterialHeaderButtons, {
  Item,
} from '../../components/Overrides/CustomHeaderButton';
import { TAB_BAR_HEIGHT } from '../../components/Tabbar/CustomTabBar';
import CollapsibleScrollView from '../../components/Collapsible/CollapsibleScrollView';
import ImageGalleryButton from '../../components/Media/ImageGalleryButton';
import {
  MainRoutes,
  MainStackParamsList,
} from '../../navigation/MainNavigator';
import { useNavigation } from '@react-navigation/core';
import CustomHTML from '../../components/Overrides/CustomHTML';
import { Avatar } from 'react-native-paper';

type Props = StackScreenProps<MainStackParamsList, MainRoutes.FeedInformation>;

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  image: {
    width: 48,
    height: 48,
  },
  button: {
    width: 250,
    height: 250,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  avatar: {
    backgroundColor: 'transparent',
    marginLeft: 10,
    marginRight: 10,
  },
});

/**
 * Function defining a feed item page.
 */
function FeedItemScreen(props: Props) {
  const navigation = useNavigation();
  const { data } = props.route.params;
  const post = data;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: getHeaderButton,
    });
  });

  const getHeaderButton = () => {
    return (
      <MaterialHeaderButtons>
        <Item
          title="main"
          iconName="facebook"
          color="#2e88fe"
          // onPress={onOutLinkPress}
        />
      </MaterialHeaderButtons>
    );
  };

  return (
    <CollapsibleScrollView style={styles.container} hasTab>
      <Card.Title
        title={post.title}
        subtitle={post.clubName}
        left={() => (
          <Avatar.Image
            style={styles.avatar}
            size={64}
            source={{ uri: post.clubLogo }}
          />
        )}
        style={{ height: 80 }}
      />
      {data.image ? (
        <ImageGalleryButton
          images={[{ url: data.image }]}
          style={styles.button}
        />
      ) : null}
      <Card.Content style={{ paddingBottom: TAB_BAR_HEIGHT + 20 }}>
        <CustomHTML html={data.content} />
      </Card.Content>
    </CollapsibleScrollView>
  );
}

export default FeedItemScreen;
