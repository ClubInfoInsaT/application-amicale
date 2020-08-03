// @flow

import * as React from 'react';
import {Image, View} from 'react-native';
import {Card, List, Text, withTheme} from 'react-native-paper';
import i18n from 'i18n-js';
import Autolink from 'react-native-autolink';
import CollapsibleScrollView from '../../../components/Collapsible/CollapsibleScrollView';
import AMICALE_ICON from '../../../../assets/amicale.png';

const CONTACT_LINK = 'clubs@amicale-insat.fr';

// eslint-disable-next-line react/prefer-stateless-function
class ClubAboutScreen extends React.Component<null> {
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
            source={AMICALE_ICON}
            style={{flex: 1, resizeMode: 'contain'}}
            resizeMode="contain"
          />
        </View>
        <Text>{i18n.t('screens.clubs.about.text')}</Text>
        <Card style={{margin: 5}}>
          <Card.Title
            title={i18n.t('screens.clubs.about.title')}
            subtitle={i18n.t('screens.clubs.about.subtitle')}
            left={({size}: {size: number}): React.Node => (
              <List.Icon size={size} icon="information" />
            )}
          />
          <Card.Content>
            <Text>{i18n.t('screens.clubs.about.message')}</Text>
            <Autolink text={CONTACT_LINK} component={Text} />
          </Card.Content>
        </Card>
      </CollapsibleScrollView>
    );
  }
}

export default withTheme(ClubAboutScreen);
