// @flow

import * as React from 'react';
import {Button, Card, Text, TouchableRipple} from 'react-native-paper';
import {Image, View} from 'react-native';
import Autolink from 'react-native-autolink';
import i18n from 'i18n-js';
import ImageModal from 'react-native-image-modal';
import {StackNavigationProp} from '@react-navigation/stack';
import type {FeedItemType} from '../../screens/Home/HomeScreen';

const ICON_AMICALE = require('../../../assets/amicale.png');

type PropsType = {
  navigation: StackNavigationProp,
  item: FeedItemType,
  title: string,
  subtitle: string,
  height: number,
};

/**
 * Component used to display a feed item
 */
class FeedItem extends React.Component<PropsType> {
  shouldComponentUpdate(): boolean {
    return false;
  }

  onPress = () => {
    const {props} = this;
    props.navigation.navigate('feed-information', {
      data: props.item,
      date: props.subtitle,
    });
  };

  render(): React.Node {
    const {props} = this;
    const {item} = props;
    const hasImage =
      item.full_picture !== '' && item.full_picture !== undefined;

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
              title={props.title}
              subtitle={props.subtitle}
              left={(): React.Node => (
                <Image
                  size={48}
                  source={ICON_AMICALE}
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
                    uri: item.full_picture,
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
