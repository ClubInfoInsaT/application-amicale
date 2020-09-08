// @flow

import * as React from 'react';
import {
  Title,
  Button,
  Card,
  Avatar,
  withTheme,
  Paragraph,
} from 'react-native-paper';
import i18n from 'i18n-js';
import CollapsibleScrollView from '../../components/Collapsible/CollapsibleScrollView';
import type {CardTitleIconPropsType} from '../../constants/PaperStyles';
import AsyncStorageManager from '../../managers/AsyncStorageManager';
import ThemeManager from '../../managers/ThemeManager';
import type {CustomThemeType} from '../../managers/ThemeManager';

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

type StateType = {
  selectedWash: string,
  currentTheme: CustomThemeType,
};

/**
 * Class defining the proxiwash settings screen.
 */
class ProxiwashSettingsScreen extends React.Component<null, StateType> {
  constructor() {
    super();
    this.state = {
      selectedWash: AsyncStorageManager.getString(
        AsyncStorageManager.PREFERENCES.selectedWash.key,
      ),
    };
  }

  /**
   * Saves the value for the proxiwash reminder notification time
   *
   * @param value The value to store
   */
  onSelectWashValueChange = (value: string) => {
    if (value != null) {
      this.setState({selectedWash: value});
      AsyncStorageManager.set(
        AsyncStorageManager.PREFERENCES.selectedWash.key,
        value,
      );
    }
  };

  getCardItem(item: LaverieType): React.Node {
    const {selectedWash} = this.state;
    const onSelectWashValueChange = (): void =>
      this.onSelectWashValueChange(item.id);
    let cardStyle = {
      margin: 5,
    };
    if (selectedWash === item.id) {
      cardStyle = {
        margin: 5,
        backgroundColor: ThemeManager.getCurrentTheme().colors
          .proxiwashUnknownColor,
      };
    }
    return (
      <Card style={cardStyle}>
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
        <Card.Actions>
          <Button onPress={onSelectWashValueChange}>Select</Button>
        </Card.Actions>
      </Card>
    );
  }

  render(): React.Node {
    return (
      <CollapsibleScrollView style={{padding: 5}} hasTab>
        {this.getCardItem(PROXIWASH_DATA.washinsa)}
        {this.getCardItem(PROXIWASH_DATA.tripodeB)}
      </CollapsibleScrollView>
    );
  }
}

export default withTheme(ProxiwashSettingsScreen);
