// @flow

import * as React from 'react';
import {Image, View} from 'react-native';
import i18n from 'i18n-js';
import {Card, Avatar, Paragraph, Title} from 'react-native-paper';
import CollapsibleScrollView from '../../components/Collapsible/CollapsibleScrollView';
import type {CardTitleIconPropsType} from '../../constants/PaperStyles';
import ProxiwashConstants from '../../constants/ProxiwashConstants';

const LOGO = 'https://etud.insa-toulouse.fr/~amicale_app/images/Proxiwash.png';

export type LaundromatType = {
  id: string,
  title: string,
  subtitle: string,
  description: string,
  tarif: string,
  paymentMethods: string,
  icon: string,
  url: string,
};

/**
 * Class defining the proxiwash about screen.
 */
export default class ProxiwashAboutScreen extends React.Component<null> {
  static getCardItem(item: LaundromatType): React.Node {
    return (
      <Card style={{margin: 5}}>
        <Card.Title
          title={i18n.t(item.title)}
          subtitle={i18n.t(item.subtitle)}
          left={(iconProps: CardTitleIconPropsType): React.Node => (
            <Avatar.Icon size={iconProps.size} icon={item.icon} />
          )}
        />
        <Card.Content>
          <Paragraph>{i18n.t(item.description)}</Paragraph>
          <Title>{i18n.t('screens.proxiwash.tariffs')}</Title>
          <Paragraph>{i18n.t(item.tarif)}</Paragraph>
          <Title>{i18n.t('screens.proxiwash.paymentMethods')}</Title>
          <Paragraph>{i18n.t(item.paymentMethods)}</Paragraph>
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

        {ProxiwashAboutScreen.getCardItem(ProxiwashConstants.washinsa)}

        {ProxiwashAboutScreen.getCardItem(ProxiwashConstants.tripodeB)}

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
