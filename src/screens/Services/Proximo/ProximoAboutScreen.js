// @flow

import * as React from 'react';
import {Image, View} from 'react-native';
import i18n from 'i18n-js';
import {Card, Avatar, Paragraph, Text} from 'react-native-paper';
import CustomTabBar from '../../../components/Tabbar/CustomTabBar';
import CollapsibleScrollView from '../../../components/Collapsible/CollapsibleScrollView';
import type {CardTitleIconPropsType} from '../../../constants/PaperStyles';

const LOGO = 'https://etud.insa-toulouse.fr/~amicale_app/images/Proximo.png';

/**
 * Class defining the proximo about screen.
 */
// eslint-disable-next-line react/prefer-stateless-function
export default class ProximoAboutScreen extends React.Component<null> {
  render(): React.Node {
    return (
      <CollapsibleScrollView style={{padding: 5}}>
        <View
          style={{
            width: '100%',
            height: 100,
            marginTop: 20,
            marginBottom: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: LOGO}}
            style={{height: '100%', width: '100%', resizeMode: 'contain'}}
          />
        </View>
        <Text>{i18n.t('screens.proximo.description')}</Text>
        <Card style={{margin: 5}}>
          <Card.Title
            title={i18n.t('screens.proximo.openingHours')}
            left={(iconProps: CardTitleIconPropsType): React.Node => (
              <Avatar.Icon size={iconProps.size} icon="clock-outline" />
            )}
          />
          <Card.Content>
            <Paragraph>18h30 - 19h30</Paragraph>
          </Card.Content>
        </Card>
        <Card
          style={{margin: 5, marginBottom: CustomTabBar.TAB_BAR_HEIGHT + 20}}>
          <Card.Title
            title={i18n.t('screens.proximo.paymentMethods')}
            left={(iconProps: CardTitleIconPropsType): React.Node => (
              <Avatar.Icon size={iconProps.size} icon="cash" />
            )}
          />
          <Card.Content>
            <Paragraph>
              {i18n.t('screens.proximo.paymentMethodsDescription')}
            </Paragraph>
          </Card.Content>
        </Card>
      </CollapsibleScrollView>
    );
  }
}
