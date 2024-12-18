/*
 * Copyright (c) 2019 - 2021 Arnaud Vergnet.
 * Copyright (c) 2021 - 2025 Paul ALNET.
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

import React from 'react';
import { SectionListData, StyleSheet } from 'react-native';
import i18n from 'i18n-js';
import { Headline, useTheme } from 'react-native-paper';
import { View } from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import WebSectionList from '../../components/Screens/WebSectionList';
import FeedItem from '../../components/Home/FeedItem';
import GENERAL_STYLES from '../../constants/Styles';
import { useAuthenticatedRequest } from '../../context/loginContext';

const FEED_ITEM_HEIGHT = 500;

const REFRESH_TIME = 1000 * 20; // Refresh every 20 seconds

export type FeedPostType = {
  id: number;
  clubId: number;
  clubName: string;
  clubLogo: string; // URL
  date: number; // Unix timestamp
  title: string;
  content: string; // HTML
  image: string | null; // URL
};

type FeedResponseType = {
  posts: Array<FeedPostType>;
  next: string; // URL to next page
  canReact: boolean; // Can the user react to the posts
};

const styles = StyleSheet.create({
  sectionHeader: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 10,
  },
  sectionHeaderEmpty: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  content: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

function Feed() {
  const theme = useTheme();

  const request = useAuthenticatedRequest<FeedResponseType>('feed');

  const getRenderItem = ({ item }: { item: FeedPostType }) => (
    <FeedItem item={item} height={FEED_ITEM_HEIGHT} />
  );

  const getRenderSectionHeader = (data: {
    section: SectionListData<FeedPostType>;
  }) => {
    const icon = data.section.icon;
    if (data.section.data.length > 0) {
      return (
        <Headline style={styles.sectionHeader}>{data.section.title}</Headline>
      );
    }
    return (
      <View>
        <Headline
          style={{
            ...styles.sectionHeaderEmpty,
            color: theme.colors.textDisabled,
          }}
        >
          {data.section.title}
        </Headline>
        {icon ? (
          <MaterialCommunityIcons
            name={icon}
            size={100}
            color={theme.colors.textDisabled}
            style={GENERAL_STYLES.center}
          />
        ) : null}
      </View>
    );
  };

  /**
   * Creates the dataset to be used in the FlatList
   *
   * @param fetchedData
   * @param isLoading
   * @return {*}
   */
  const createDataset = (
    fetchedData: FeedResponseType | undefined,
    isLoading: boolean
  ): Array<{
    title: string;
    data: [] | Array<FeedPostType>;
    icon?: string;
    id: string;
  }> => {
    let currentNewFeed: Array<FeedPostType> = [];
    if (fetchedData && fetchedData.posts) {
      currentNewFeed = fetchedData.posts;
    }
    if (currentNewFeed.length > 0) {
      return [
        {
          title: i18n.t('screens.home.feedTitle'),
          data: currentNewFeed,
          id: 'feed',
        },
      ];
    }
    return [
      {
        title: isLoading
          ? i18n.t('screens.home.feedLoading')
          : i18n.t('screens.home.feedError'),
        data: [],
        icon: isLoading ? undefined : 'access-point-network-off',
        id: 'feed',
      },
    ];
  };

  return (
    <View style={styles.content}>
      <WebSectionList
        request={request}
        createDataset={createDataset}
        autoRefreshTime={REFRESH_TIME}
        refreshOnFocus={true}
        renderItem={getRenderItem}
        itemHeight={FEED_ITEM_HEIGHT}
        //onScroll={onScroll}
        renderSectionHeader={getRenderSectionHeader}
      />
    </View>
  );
}

export default Feed;
