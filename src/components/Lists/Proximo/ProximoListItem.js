// @flow

import * as React from 'react';
import {Avatar, List, Text, withTheme} from 'react-native-paper';
import i18n from 'i18n-js';
import type {ProximoArticleType} from '../../../screens/Services/Proximo/ProximoMainScreen';

type PropsType = {
  onPress: () => void,
  color: string,
  item: ProximoArticleType,
  height: number,
};

class ProximoListItem extends React.Component<PropsType> {
  shouldComponentUpdate(): boolean {
    return false;
  }

  render(): React.Node {
    const {props} = this;
    return (
      <List.Item
        title={props.item.name}
        description={`${props.item.quantity} ${i18n.t(
          'screens.proximo.inStock',
        )}`}
        descriptionStyle={{color: props.color}}
        onPress={props.onPress}
        left={(): React.Node => (
          <Avatar.Image
            style={{backgroundColor: 'transparent'}}
            size={64}
            source={{uri: props.item.image}}
          />
        )}
        right={(): React.Node => (
          <Text style={{fontWeight: 'bold'}}>{props.item.price}€</Text>
        )}
        style={{
          height: props.height,
          justifyContent: 'center',
        }}
      />
    );
  }
}

export default withTheme(ProximoListItem);
