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

import * as React from 'react';
import { Button, Card, TouchableRipple } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import i18n from 'i18n-js';
import type { FeedPostType } from '../../components/Home/Feed';
import ImageGalleryButton from '../Media/ImageGalleryButton';
import { useNavigation } from '@react-navigation/native';
import GENERAL_STYLES from '../../constants/Styles';
import { MainRoutes } from '../../navigation/MainNavigator';
import { Avatar } from 'react-native-paper';
import CustomHTML from '../Overrides/CustomHTML';

type PropsType = {
  item: FeedPostType;
  height: number;
};

/**
 * Converts a dateString using Unix Timestamp to a formatted date
 *
 * @param dateString {string} The Unix Timestamp representation of a date
 * @return {string} The formatted output date
 */
function getFormattedDate(dateString: number): string {
  const date = new Date(dateString * 1000);
  return date.toLocaleString();
}

const styles = StyleSheet.create({
  image: {
    width: 48,
    height: 48,
  },
  button: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  action: {
    marginLeft: 'auto',
  },
  avatar: {
    backgroundColor: 'transparent',
    marginLeft: 10,
    marginRight: 10,
  },
});

/**
 * Component used to display a feed item
 */
function FeedItem(props: PropsType) {
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate(MainRoutes.FeedInformation, {
      data: item,
      date: getFormattedDate(props.item.date),
    });
  };

  const { item, height } = props;
  const image = item.image !== '' && item.image != null ? item.image : null;
  const cardMargin = 10;
  const cardHeight = height - 2 * cardMargin;
  const imageSize = 250;
  const titleHeight = 80;
  const actionsHeight = 60;
  return (
    <Card
      style={{
        margin: cardMargin,
        height: cardHeight,
      }}
    >
      <TouchableRipple style={GENERAL_STYLES.flex} onPress={onPress}>
        <View>
          <Card.Title
            title={item.title}
            subtitle={getFormattedDate(item.date)}
            left={() => (
              <Avatar.Image
                style={styles.avatar}
                size={64}
                source={{ uri: item.clubLogo }}
              />
            )}
            style={{ height: titleHeight }}
          />
          {image != null ? (
            <ImageGalleryButton
              images={[{ url: image }]}
              style={{
                ...styles.button,
                width: imageSize,
                height: imageSize,
              }}
            />
          ) : null}
          <Card.Content>
            <CustomHTML html={item.content} />
          </Card.Content>
          <Card.Actions style={{ height: actionsHeight }}>
            <Button onPress={onPress} icon="plus" style={styles.action}>
              {i18n.t('screens.home.dashboard.seeMore')}
            </Button>
          </Card.Actions>
        </View>
      </TouchableRipple>
    </Card>
  );
}

export default React.memo(FeedItem, () => true);
