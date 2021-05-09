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

import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import i18n from 'i18n-js';
import { Card, Avatar, Paragraph, Text } from 'react-native-paper';
import { TAB_BAR_HEIGHT } from '../../../components/Tabbar/CustomTabBar';
import CollapsibleScrollView from '../../../components/Collapsible/CollapsibleScrollView';
import Urls from '../../../constants/Urls';

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  imageContainer: {
    width: '100%',
    height: 100,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  card: {
    margin: 5,
  },
});

/**
 * Class defining the proximo about screen.
 */
export default function ProximoAboutScreen() {
  return (
    <CollapsibleScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: Urls.images.proximo }} style={styles.image} />
      </View>
      <Text>{i18n.t('screens.proximo.description')}</Text>
      <Card style={styles.card}>
        <Card.Title
          title={i18n.t('screens.proximo.openingHours')}
          left={(iconProps) => (
            <Avatar.Icon size={iconProps.size} icon="clock-outline" />
          )}
        />
        <Card.Content>
          <Paragraph>18h30 - 19h30</Paragraph>
        </Card.Content>
      </Card>
      <Card
        style={{
          ...styles.card,
          marginBottom: TAB_BAR_HEIGHT + 20,
        }}
      >
        <Card.Title
          title={i18n.t('screens.proximo.paymentMethods')}
          left={(iconProps) => (
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
