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
import { Button, Card, Text, TouchableRipple } from 'react-native-paper';
import { Image, StyleSheet, View } from 'react-native';
import Autolink from 'react-native-autolink';
import i18n from 'i18n-js';
import type { FeedItemType } from '../../screens/Home/HomeScreen';
import NewsSourcesConstants, {
  AvailablePages,
} from '../../constants/NewsSourcesConstants';
import type { NewsSourceType } from '../../constants/NewsSourcesConstants';
import ImageGalleryButton from '../Media/ImageGalleryButton';
import { useNavigation } from '@react-navigation/native';
import GENERAL_STYLES from '../../constants/Styles';

type PropsType = {
  item: FeedItemType;
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
});

/**
 * Component used to display a feed item
 */
function FeedItem(props: PropsType) {
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate('feed-information', {
      data: item,
      date: getFormattedDate(props.item.time),
    });
  };

  const { item, height } = props;
  const image = item.image !== '' && item.image != null ? item.image : null;
  const pageSource: NewsSourceType =
    NewsSourcesConstants[item.page_id as AvailablePages];
  const cardMargin = 10;
  const cardHeight = height - 2 * cardMargin;
  const imageSize = 250;
  const titleHeight = 80;
  const actionsHeight = 60;
  const textHeight =
    image != null
      ? cardHeight - titleHeight - actionsHeight - imageSize
      : cardHeight - titleHeight - actionsHeight;
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
            title={pageSource.name}
            subtitle={getFormattedDate(item.time)}
            left={() => <Image source={pageSource.icon} style={styles.image} />}
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
            {item.message !== undefined ? (
              <Autolink<typeof Text>
                text={item.message}
                hashtag={'facebook'}
                component={Text}
                style={{ height: textHeight }}
                truncate={32}
                email={true}
                url={true}
                phone={true}
              />
            ) : null}
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
