// @flow

import * as React from 'react';
import {Button, Card, Text, TouchableRipple} from 'react-native-paper';
import {Image, View} from 'react-native';
import Autolink from 'react-native-autolink';
import i18n from 'i18n-js';
import ImageModal from 'react-native-image-modal';
import {StackNavigationProp} from '@react-navigation/stack';
import type {FeedItemType} from '../../screens/Home/HomeScreen';
import NewsSourcesConstants from '../../constants/NewsSourcesConstants';
import type {NewsSourceType} from '../../constants/NewsSourcesConstants';

type PropsType = {
  navigation: StackNavigationProp,
  item: FeedItemType,
  height: number,
};

/**
 * Component used to display a feed item
 */
class FeedItem extends React.Component<PropsType> {
  /**
   * Converts a dateString using Unix Timestamp to a formatted date
   *
   * @param dateString {string} The Unix Timestamp representation of a date
   * @return {string} The formatted output date
   */
  static getFormattedDate(dateString: number): string {
    const date = new Date(dateString * 1000);
    return date.toLocaleString();
  }

  shouldComponentUpdate(): boolean {
    return false;
  }

  onPress = () => {
    const {item, navigation} = this.props;
    navigation.navigate('feed-information', {
      data: item,
      date: FeedItem.getFormattedDate(item.time),
    });
  };

  render(): React.Node {
    const {props} = this;
    const {item} = props;
    const hasImage = item.image !== '' && item.image != null;
    const pageSource: NewsSourceType = NewsSourcesConstants[item.page_id];
    const cardMargin = 10;
    const cardHeight = props.height - 2 * cardMargin;
    const imageSize = 250;
    const titleHeight = 80;
    const actionsHeight = 60;
    const textHeight = hasImage
      ? cardHeight - titleHeight - actionsHeight - imageSize
      : cardHeight - titleHeight - actionsHeight;
    return (
      <Card
        style={{
          margin: cardMargin,
          height: cardHeight,
        }}>
        <TouchableRipple style={{flex: 1}} onPress={this.onPress}>
          <View>
            <Card.Title
              title={pageSource.name}
              subtitle={FeedItem.getFormattedDate(item.time)}
              left={(): React.Node => (
                <Image
                  size={48}
                  source={pageSource.icon}
                  style={{
                    width: 48,
                    height: 48,
                  }}
                />
              )}
              style={{height: titleHeight}}
            />
            {hasImage ? (
              <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                <ImageModal
                  resizeMode="contain"
                  imageBackgroundColor="#000"
                  style={{
                    width: imageSize,
                    height: imageSize,
                  }}
                  source={{
                    uri: item.image,
                  }}
                />
              </View>
            ) : null}
            <Card.Content>
              {item.message !== undefined ? (
                <Autolink
                  text={item.message}
                  hashtag="facebook"
                  component={Text}
                  style={{height: textHeight}}
                />
              ) : null}
            </Card.Content>
            <Card.Actions style={{height: actionsHeight}}>
              <Button
                onPress={this.onPress}
                icon="plus"
                style={{marginLeft: 'auto'}}>
                {i18n.t('screens.home.dashboard.seeMore')}
              </Button>
            </Card.Actions>
          </View>
        </TouchableRipple>
      </Card>
    );
  }
}

export default FeedItem;
