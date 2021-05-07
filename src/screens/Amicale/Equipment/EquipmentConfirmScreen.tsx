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
import {
  Caption,
  Card,
  Headline,
  Paragraph,
  Title,
  useTheme,
} from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import i18n from 'i18n-js';
import { getRelativeDateString } from '../../../utils/EquipmentBooking';
import CollapsibleScrollView from '../../../components/Collapsible/CollapsibleScrollView';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamsList } from '../../../navigation/MainNavigator';
import GENERAL_STYLES from '../../../constants/Styles';

type EquipmentConfirmScreenNavigationProp = StackScreenProps<
  MainStackParamsList,
  'equipment-confirm'
>;

type Props = EquipmentConfirmScreenNavigationProp;

const styles = StyleSheet.create({
  card: {
    margin: 5,
  },
  titleContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  title: {
    textAlign: 'center',
  },
  caption: {
    textAlign: 'center',
    lineHeight: 35,
    marginLeft: 10,
  },
  subtitle: {
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
  },
});

function EquipmentConfirmScreen(props: Props) {
  const theme = useTheme();
  const item = props.route.params?.item;
  const dates = props.route.params?.dates;

  if (item != null && dates != null) {
    const start = new Date(dates[0]);
    const end = new Date(dates[1]);
    let buttonText;
    if (start == null) {
      buttonText = i18n.t('screens.equipment.booking');
    } else if (end != null && start.getTime() !== end.getTime()) {
      buttonText = i18n.t('screens.equipment.bookingPeriod', {
        begin: getRelativeDateString(start),
        end: getRelativeDateString(end),
      });
    } else {
      buttonText = i18n.t('screens.equipment.bookingDay', {
        date: getRelativeDateString(start),
      });
    }
    return (
      <CollapsibleScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <View style={GENERAL_STYLES.flex}>
              <View style={styles.titleContainer}>
                <Headline style={styles.title}>{item.name}</Headline>
                <Caption style={styles.caption}>
                  ({i18n.t('screens.equipment.bail', { cost: item.caution })})
                </Caption>
              </View>
            </View>
            <Title style={{ color: theme.colors.success, ...styles.subtitle }}>
              {buttonText}
            </Title>
            <Paragraph style={styles.text}>
              {i18n.t('screens.equipment.bookingConfirmedMessage')}
            </Paragraph>
          </Card.Content>
        </Card>
      </CollapsibleScrollView>
    );
  }
  return null;
}

export default EquipmentConfirmScreen;
