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

// @flow

import * as React from 'react';
import {
  Button,
  Caption,
  Card,
  Headline,
  Paragraph,
  withTheme,
} from 'react-native-paper';
import {View} from 'react-native';
import i18n from 'i18n-js';
import type {CustomThemeType} from '../../../managers/ThemeManager';
import type {DeviceType} from './EquipmentListScreen';
import {getRelativeDateString} from '../../../utils/EquipmentBooking';
import CollapsibleScrollView from '../../../components/Collapsible/CollapsibleScrollView';

type PropsType = {
  route: {
    params?: {
      item?: DeviceType,
      dates: [string, string],
    },
  },
  theme: CustomThemeType,
};

class EquipmentConfirmScreen extends React.Component<PropsType> {
  item: DeviceType | null;

  dates: [string, string] | null;

  constructor(props: PropsType) {
    super(props);
    if (props.route.params != null) {
      if (props.route.params.item != null) this.item = props.route.params.item;
      else this.item = null;
      if (props.route.params.dates != null)
        this.dates = props.route.params.dates;
      else this.dates = null;
    }
  }

  render(): React.Node {
    const {item, dates, props} = this;
    if (item != null && dates != null) {
      const start = new Date(dates[0]);
      const end = new Date(dates[1]);
      let buttonText;
      if (start == null) buttonText = i18n.t('screens.equipment.booking');
      else if (end != null && start.getTime() !== end.getTime())
        buttonText = i18n.t('screens.equipment.bookingPeriod', {
          begin: getRelativeDateString(start),
          end: getRelativeDateString(end),
        });
      else
        buttonText = i18n.t('screens.equipment.bookingDay', {
          date: getRelativeDateString(start),
        });
      return (
        <CollapsibleScrollView>
          <Card style={{margin: 5}}>
            <Card.Content>
              <View style={{flex: 1}}>
                <View
                  style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  <Headline style={{textAlign: 'center'}}>{item.name}</Headline>
                  <Caption
                    style={{
                      textAlign: 'center',
                      lineHeight: 35,
                      marginLeft: 10,
                    }}>
                    ({i18n.t('screens.equipment.bail', {cost: item.caution})})
                  </Caption>
                </View>
              </View>
              <Button
                icon="check-circle-outline"
                color={props.theme.colors.success}
                mode="text">
                {buttonText}
              </Button>
              <Paragraph style={{textAlign: 'center'}}>
                {i18n.t('screens.equipment.bookingConfirmedMessage')}
              </Paragraph>
            </Card.Content>
          </Card>
        </CollapsibleScrollView>
      );
    }
    return null;
  }
}

export default withTheme(EquipmentConfirmScreen);
