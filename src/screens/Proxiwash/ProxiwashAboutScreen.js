// @flow

import * as React from 'react';
import {Image, View} from 'react-native';
import i18n from 'i18n-js';
import {Card, Avatar, Paragraph, Title} from 'react-native-paper';
import CollapsibleScrollView from '../../components/Collapsible/CollapsibleScrollView';
import type {CardTitleIconPropsType} from '../../constants/PaperStyles';

const LOGO = 'https://etud.insa-toulouse.fr/~amicale_app/images/Proxiwash.png';

export type LaverieType = {
  id: string,
  title: string,
  subtitle: string,
  description: string,
  tarif: string,
  paymentMethods: string,
  icon: string,
  url: string,
};

export const PROXIWASH_DATA = {
  washinsa: {
    id: 'washinsa',
    title: i18n.t('screens.proxiwash.washinsa.title'),
    subtitle: i18n.t('screens.proxiwash.washinsa.subtitle'),
    description: i18n.t('screens.proxiwash.washinsa.description'),
    tarif: i18n.t('screens.proxiwash.washinsa.tariff'),
    paymentMethods: i18n.t('screens.proxiwash.washinsa.paymentMethods'),
    icon: 'school-outline',
    url:
      'https://etud.insa-toulouse.fr/~amicale_app/v2/washinsa/washinsa_data.json',
  },
  tripodeB: {
    id: 'tripodeB',
    title: i18n.t('screens.proxiwash.tripodeB.title'),
    subtitle: i18n.t('screens.proxiwash.tripodeB.subtitle'),
    description: i18n.t('screens.proxiwash.tripodeB.description'),
    tarif: i18n.t('screens.proxiwash.tripodeB.tariff'),
    paymentMethods: i18n.t('screens.proxiwash.tripodeB.paymentMethods'),
    icon: 'domain',
    url:
      'https://etud.insa-toulouse.fr/~amicale_app/v2/washinsa/tripode_b_data.json',
  },
};

/**
 * Class defining the proxiwash about screen.
 */
export default class ProxiwashAboutScreen extends React.Component<null> {
  static getCardItem(item: LaverieType): React.Node {
    return (
      <Card style={{margin: 5}}>
        <Card.Title
          title={item.title}
          subtitle={item.subtitle}
          left={(iconProps: CardTitleIconPropsType): React.Node => (
            <Avatar.Icon size={iconProps.size} icon={item.icon} />
          )}
        />
        <Card.Content>
          <Paragraph>{item.description}</Paragraph>
          <Title>{i18n.t('screens.proxiwash.tariffs')}</Title>
          <Paragraph>{item.tarif}</Paragraph>
          <Title>{i18n.t('screens.proxiwash.paymentMethods')}</Title>
          <Paragraph>{item.paymentMethods}</Paragraph>
        </Card.Content>
      </Card>
    );
  }

  render(): React.Node {
    return (
      <CollapsibleScrollView style={{padding: 5}} hasTab>
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

        {ProxiwashAboutScreen.getCardItem(PROXIWASH_DATA.washinsa)}

        {ProxiwashAboutScreen.getCardItem(PROXIWASH_DATA.tripodeB)}

        <Card style={{margin: 5}}>
          <Card.Title
            title={i18n.t('screens.proxiwash.dryer')}
            left={(iconProps: CardTitleIconPropsType): React.Node => (
              <Avatar.Icon size={iconProps.size} icon="tumble-dryer" />
            )}
          />
          <Card.Content>
            <Title>{i18n.t('screens.proxiwash.procedure')}</Title>
            <Paragraph>{i18n.t('screens.proxiwash.dryerProcedure')}</Paragraph>
            <Title>{i18n.t('screens.proxiwash.tips')}</Title>
            <Paragraph>{i18n.t('screens.proxiwash.dryerTips')}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={{margin: 5}}>
          <Card.Title
            title={i18n.t('screens.proxiwash.washer')}
            left={(iconProps: CardTitleIconPropsType): React.Node => (
              <Avatar.Icon size={iconProps.size} icon="washing-machine" />
            )}
          />
          <Card.Content>
            <Title>{i18n.t('screens.proxiwash.procedure')}</Title>
            <Paragraph>{i18n.t('screens.proxiwash.washerProcedure')}</Paragraph>
            <Title>{i18n.t('screens.proxiwash.tips')}</Title>
            <Paragraph>{i18n.t('screens.proxiwash.washerTips')}</Paragraph>
          </Card.Content>
        </Card>
      </CollapsibleScrollView>
    );
  }
}
