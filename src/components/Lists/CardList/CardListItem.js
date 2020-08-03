// @flow

import * as React from 'react';
import {Caption, Card, Paragraph, TouchableRipple} from 'react-native-paper';
import {View} from 'react-native';
import type {ServiceItemType} from '../../../managers/ServicesManager';

type PropsType = {
  item: ServiceItemType,
};

export default class CardListItem extends React.Component<PropsType> {
  shouldComponentUpdate(): boolean {
    return false;
  }

  render(): React.Node {
    const {props} = this;
    const {item} = props;
    const source =
      typeof item.image === 'number' ? item.image : {uri: item.image};
    return (
      <Card
        style={{
          width: '40%',
          margin: 5,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
        <TouchableRipple style={{flex: 1}} onPress={item.onPress}>
          <View>
            <Card.Cover style={{height: 80}} source={source} />
            <Card.Content>
              <Paragraph>{item.title}</Paragraph>
              <Caption>{item.subtitle}</Caption>
            </Card.Content>
          </View>
        </TouchableRipple>
      </Card>
    );
  }
}
