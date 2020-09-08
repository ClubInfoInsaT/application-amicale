// @flow

import * as React from 'react';
import {Image, View} from 'react-native';
import i18n from 'i18n-js';
import {Card, Avatar, Paragraph, Title} from 'react-native-paper';
import CollapsibleScrollView from '../../components/Collapsible/CollapsibleScrollView';
import type {CardTitleIconPropsType} from '../../constants/PaperStyles';

const LOGO = 'https://etud.insa-toulouse.fr/~amicale_app/images/Proxiwash.png';

/**
 * Class defining the proxiwash about screen.
 */
// eslint-disable-next-line react/prefer-stateless-function
export default class ProxiwashAboutScreen extends React.Component<null> {
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
