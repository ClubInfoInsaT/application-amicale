/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useLayoutEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
  Avatar,
  Card,
  Divider,
  List,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import i18n from 'i18n-js';
import CardList from '../../components/Lists/CardList/CardList';
import MaterialHeaderButtons, {
  Item,
} from '../../components/Overrides/CustomHeaderButton';
import { MASCOT_STYLE } from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import CollapsibleFlatList from '../../components/Collapsible/CollapsibleFlatList';
import {
  getCategories,
  ServiceCategoryType,
  SERVICES_CATEGORIES_KEY,
} from '../../utils/Services';
import { useNavigation } from '@react-navigation/native';
import { useLoginState } from '../../context/loginContext';

const styles = StyleSheet.create({
  container: {
    margin: 5,
    marginBottom: 20,
  },
  image: {
    width: 48,
    height: 48,
  },
  icon: {
    backgroundColor: 'transparent',
  },
});

function ServicesScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const isLoggedIn = useLoginState();

  const finalDataset = getCategories(navigation.navigate, isLoggedIn, [
    SERVICES_CATEGORIES_KEY.SPECIAL,
  ]);

  useLayoutEffect(() => {
    const getAboutButton = () => (
      <MaterialHeaderButtons>
        <Item
          title="information"
          iconName="information"
          onPress={() => navigation.navigate('amicale-contact')}
        />
      </MaterialHeaderButtons>
    );
    navigation.setOptions({
      headerRight: getAboutButton,
    });
  }, [navigation]);

  /**
   * Gets the list title image for the list.
   *
   * If the source is a string, we are using an icon.
   * If the source is a number, we are using an internal image.
   *
   * @param source The source image to display. Can be a string for icons or a number for local images
   * @returns {*}
   */
  const getListTitleImage = (source: string | number) => {
    if (typeof source === 'number') {
      return <Image source={source} style={styles.image} />;
    }
    return (
      <Avatar.Icon
        size={48}
        icon={source}
        color={theme.colors.primary}
        style={styles.icon}
      />
    );
  };

  /**
   * A list item showing a list of available services for the current category
   *
   * @param item
   * @returns {*}
   */
  const getRenderItem = ({ item }: { item: ServiceCategoryType }) => {
    return (
      <TouchableRipple
        style={styles.container}
        onPress={() => navigation.navigate('services-section', { data: item })}
      >
        <View>
          <Card.Title
            title={item.title}
            subtitle={item.subtitle}
            left={() => getListTitleImage(item.image)}
            right={() => <List.Icon icon="chevron-right" />}
          />
          <CardList dataset={item.content} isHorizontal />
        </View>
      </TouchableRipple>
    );
  };

  const keyExtractor = (item: ServiceCategoryType): string => item.title;

  return (
    <View>
      <CollapsibleFlatList
        data={finalDataset}
        renderItem={getRenderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={() => <Divider />}
        hasTab
      />
      <MascotPopup
        title={i18n.t('screens.services.mascotDialog.title')}
        message={i18n.t('screens.services.mascotDialog.message')}
        icon="cloud-question"
        buttons={{
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

export default ServicesScreen;
