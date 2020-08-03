// @flow

import * as React from 'react';
import {Image, View} from 'react-native';
import {
  Avatar,
  Card,
  Divider,
  List,
  TouchableRipple,
  withTheme,
} from 'react-native-paper';
import i18n from 'i18n-js';
import {StackNavigationProp} from '@react-navigation/stack';
import CardList from '../../components/Lists/CardList/CardList';
import type {CustomTheme} from '../../managers/ThemeManager';
import MaterialHeaderButtons, {
  Item,
} from '../../components/Overrides/CustomHeaderButton';
import {MASCOT_STYLE} from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import AsyncStorageManager from '../../managers/AsyncStorageManager';
import ServicesManager, {
  SERVICES_CATEGORIES_KEY,
} from '../../managers/ServicesManager';
import CollapsibleFlatList from '../../components/Collapsible/CollapsibleFlatList';
import type {ServiceCategoryType} from '../../managers/ServicesManager';

type PropsType = {
  navigation: StackNavigationProp,
  theme: CustomTheme,
};

class ServicesScreen extends React.Component<PropsType> {
  finalDataset: Array<ServiceCategoryType>;

  constructor(props: PropsType) {
    super(props);
    const services = new ServicesManager(props.navigation);
    this.finalDataset = services.getCategories([
      SERVICES_CATEGORIES_KEY.SPECIAL,
    ]);
  }

  componentDidMount() {
    const {props} = this;
    props.navigation.setOptions({
      headerRight: this.getAboutButton,
    });
  }

  getAboutButton = (): React.Node => (
    <MaterialHeaderButtons>
      <Item
        title="information"
        iconName="information"
        onPress={this.onAboutPress}
      />
    </MaterialHeaderButtons>
  );

  onAboutPress = () => {
    const {props} = this;
    props.navigation.navigate('amicale-contact');
  };

  /**
   * Gets the list title image for the list.
   *
   * If the source is a string, we are using an icon.
   * If the source is a number, we are using an internal image.
   *
   * @param source The source image to display. Can be a string for icons or a number for local images
   * @returns {*}
   */
  getListTitleImage(source: string | number): React.Node {
    const {props} = this;
    if (typeof source === 'number')
      return (
        <Image
          size={48}
          source={source}
          style={{
            width: 48,
            height: 48,
          }}
        />
      );
    return (
      <Avatar.Icon
        size={48}
        icon={source}
        color={props.theme.colors.primary}
        style={{backgroundColor: 'transparent'}}
      />
    );
  }

  /**
   * A list item showing a list of available services for the current category
   *
   * @param item
   * @returns {*}
   */
  getRenderItem = ({item}: {item: ServiceCategoryType}): React.Node => {
    const {props} = this;
    return (
      <TouchableRipple
        style={{
          margin: 5,
          marginBottom: 20,
        }}
        onPress={() => {
          props.navigation.navigate('services-section', {data: item});
        }}>
        <View>
          <Card.Title
            title={item.title}
            subtitle={item.subtitle}
            left={(): React.Node => this.getListTitleImage(item.image)}
            right={({size}: {size: number}): React.Node => (
              <List.Icon size={size} icon="chevron-right" />
            )}
          />
          <CardList dataset={item.content} isHorizontal />
        </View>
      </TouchableRipple>
    );
  };

  keyExtractor = (item: ServiceCategoryType): string => item.title;

  render(): React.Node {
    return (
      <View>
        <CollapsibleFlatList
          data={this.finalDataset}
          renderItem={this.getRenderItem}
          keyExtractor={this.keyExtractor}
          ItemSeparatorComponent={(): React.Node => <Divider />}
          hasTab
        />
        <MascotPopup
          prefKey={AsyncStorageManager.PREFERENCES.servicesShowBanner.key}
          title={i18n.t('screens.services.mascotDialog.title')}
          message={i18n.t('screens.services.mascotDialog.message')}
          icon="cloud-question"
          buttons={{
            action: null,
            cancel: {
              message: i18n.t('screens.services.mascotDialog.button'),
              icon: 'check',
            },
          }}
          emotion={MASCOT_STYLE.WINK}
        />
      </View>
    );
  }
}

export default withTheme(ServicesScreen);
