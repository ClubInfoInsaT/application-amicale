// @flow

import * as React from 'react';
import {Linking, View} from 'react-native';
import {Avatar, Card, Text, withTheme} from 'react-native-paper';
import ImageModal from 'react-native-image-modal';
import Autolink from 'react-native-autolink';
import {StackNavigationProp} from '@react-navigation/stack';
import MaterialHeaderButtons, {
  Item,
} from '../../components/Overrides/CustomHeaderButton';
import CustomTabBar from '../../components/Tabbar/CustomTabBar';
import type {FeedItemType} from './HomeScreen';
import CollapsibleScrollView from '../../components/Collapsible/CollapsibleScrollView';

type PropsType = {
  navigation: StackNavigationProp,
  route: {params: {data: FeedItemType, date: string}},
};

const ICON_AMICALE = require('../../../assets/amicale.png');

const NAME_AMICALE = 'Amicale INSA Toulouse';

/**
 * Class defining a feed item page.
 */
class FeedItemScreen extends React.Component<PropsType> {
  displayData: FeedItemType;

  date: string;

  constructor(props: PropsType) {
    super(props);
    this.displayData = props.route.params.data;
    this.date = props.route.params.date;
  }

  componentDidMount() {
    const {props} = this;
    props.navigation.setOptions({
      headerRight: this.getHeaderButton,
    });
  }

  /**
   * Opens the feed item out link in browser or compatible app
   */
  onOutLinkPress = () => {
    Linking.openURL(this.displayData.permalink_url);
  };

  /**
   * Gets the out link header button
   *
   * @returns {*}
   */
  getHeaderButton = (): React.Node => {
    return (
      <MaterialHeaderButtons>
        <Item
          title="main"
          iconName="facebook"
          color="#2e88fe"
          onPress={this.onOutLinkPress}
        />
      </MaterialHeaderButtons>
    );
  };

  render(): React.Node {
    const hasImage =
      this.displayData.full_picture !== '' &&
      this.displayData.full_picture != null;
    return (
      <CollapsibleScrollView style={{margin: 5}} hasTab>
        <Card.Title
          title={NAME_AMICALE}
          subtitle={this.date}
          left={(): React.Node => (
            <Avatar.Image
              size={48}
              source={ICON_AMICALE}
              style={{backgroundColor: 'transparent'}}
            />
          )}
        />
        {hasImage ? (
          <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
            <ImageModal
              resizeMode="contain"
              imageBackgroundColor="#000"
              style={{
                width: 250,
                height: 250,
              }}
              source={{
                uri: this.displayData.full_picture,
              }}
            />
          </View>
        ) : null}
        <Card.Content style={{paddingBottom: CustomTabBar.TAB_BAR_HEIGHT + 20}}>
          {this.displayData.message !== undefined ? (
            <Autolink
              text={this.displayData.message}
              hashtag="facebook"
              component={Text}
            />
          ) : null}
        </Card.Content>
      </CollapsibleScrollView>
    );
  }
}

export default withTheme(FeedItemScreen);
