// @flow

import * as React from 'react';
import {Avatar, Text, withTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import i18n from 'i18n-js';
import type {CustomThemeType} from '../../../managers/ThemeManager';

type PropsType = {
  theme: CustomThemeType,
  title: string,
  isDryer: boolean,
  nbAvailable: number,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    marginTop: 20,
  },
  icon: {
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

/**
 * Component used to display a proxiwash item, showing machine progression and state
 */
class ProxiwashListItem extends React.Component<PropsType> {
  shouldComponentUpdate(nextProps: PropsType): boolean {
    const {props} = this;
    return (
      nextProps.theme.dark !== props.theme.dark ||
      nextProps.nbAvailable !== props.nbAvailable
    );
  }

  render(): React.Node {
    const {props} = this;
    const subtitle = `${props.nbAvailable} ${
      props.nbAvailable <= 1
        ? i18n.t('screens.proxiwash.numAvailable')
        : i18n.t('screens.proxiwash.numAvailablePlural')
    }`;
    const iconColor =
      props.nbAvailable > 0
        ? props.theme.colors.success
        : props.theme.colors.primary;
    return (
      <View style={styles.container}>
        <Avatar.Icon
          icon={props.isDryer ? 'tumble-dryer' : 'washing-machine'}
          color={iconColor}
          style={styles.icon}
        />
        <View style={{justifyContent: 'center'}}>
          <Text style={styles.text}>{props.title}</Text>
          <Text style={{color: props.theme.colors.subtitle}}>{subtitle}</Text>
        </View>
      </View>
    );
  }
}

export default withTheme(ProxiwashListItem);
