// @flow

import * as React from 'react';
import {
  Avatar,
  Card,
  Text,
  TouchableRipple,
  withTheme,
} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import i18n from 'i18n-js';
import type {CustomThemeType} from '../../managers/ThemeManager';

type PropsType = {
  eventNumber: number,
  clickAction: () => void,
  theme: CustomThemeType,
  children?: React.Node,
};

const styles = StyleSheet.create({
  card: {
    width: 'auto',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  avatar: {
    backgroundColor: 'transparent',
  },
});

/**
 * Component used to display a dashboard item containing a preview event
 */
class EventDashBoardItem extends React.Component<PropsType> {
  static defaultProps = {
    children: null,
  };

  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {props} = this;
    return (
      nextProps.theme.dark !== props.theme.dark ||
      nextProps.eventNumber !== props.eventNumber
    );
  }

  render(): React.Node {
    const {props} = this;
    const {colors} = props.theme;
    const isAvailable = props.eventNumber > 0;
    const iconColor = isAvailable ? colors.planningColor : colors.textDisabled;
    const textColor = isAvailable ? colors.text : colors.textDisabled;
    let subtitle;
    if (isAvailable) {
      subtitle = (
        <Text>
          <Text style={{fontWeight: 'bold'}}>{props.eventNumber}</Text>
          <Text>
            {props.eventNumber > 1
              ? i18n.t('screens.home.dashboard.todayEventsSubtitlePlural')
              : i18n.t('screens.home.dashboard.todayEventsSubtitle')}
          </Text>
        </Text>
      );
    } else subtitle = i18n.t('screens.home.dashboard.todayEventsSubtitleNA');
    return (
      <Card style={styles.card}>
        <TouchableRipple style={{flex: 1}} onPress={props.clickAction}>
          <View>
            <Card.Title
              title={i18n.t('screens.home.dashboard.todayEventsTitle')}
              titleStyle={{color: textColor}}
              subtitle={subtitle}
              subtitleStyle={{color: textColor}}
              left={(): React.Node => (
                <Avatar.Icon
                  icon="calendar-range"
                  color={iconColor}
                  size={60}
                  style={styles.avatar}
                />
              )}
            />
            <Card.Content>{props.children}</Card.Content>
          </View>
        </TouchableRipple>
      </Card>
    );
  }
}

export default withTheme(EventDashBoardItem);
