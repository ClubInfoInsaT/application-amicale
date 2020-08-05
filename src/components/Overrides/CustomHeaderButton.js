// @flow

import * as React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {HeaderButton, HeaderButtons} from 'react-navigation-header-buttons';
import {withTheme} from 'react-native-paper';
import type {CustomThemeType} from '../../managers/ThemeManager';

const MaterialHeaderButton = (props: {
  theme: CustomThemeType,
  color: string,
}): React.Node => {
  const {color, theme} = props;
  return (
    // $FlowFixMe
    <HeaderButton
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      IconComponent={MaterialCommunityIcons}
      iconSize={26}
      color={color != null ? color : theme.colors.text}
    />
  );
};

const MaterialHeaderButtons = (props: {...}): React.Node => {
  return (
    // $FlowFixMe
    <HeaderButtons
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      HeaderButtonComponent={withTheme(MaterialHeaderButton)}
    />
  );
};

export default MaterialHeaderButtons;

export {Item} from 'react-navigation-header-buttons';
