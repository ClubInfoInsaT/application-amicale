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
import type {CustomTheme} from '../../../managers/ThemeManager';
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
  theme: CustomTheme,
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
