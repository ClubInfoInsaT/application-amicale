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

/* eslint-disable flowtype/require-parameter-type */
// @flow

import * as React from 'react';
import {Text, withTheme} from 'react-native-paper';
import HTML from 'react-native-render-html';
import {Linking} from 'react-native';
import type {CustomThemeType} from '../../managers/ThemeManager';

type PropsType = {
  theme: CustomThemeType,
  html: string,
};

/**
 * Abstraction layer for Agenda component, using custom configuration
 */
class CustomHTML extends React.Component<PropsType> {
  openWebLink = (event: {...}, link: string) => {
    Linking.openURL(link);
  };

  getBasicText = (
    htmlAttribs,
    children,
    convertedCSSStyles,
    passProps,
  ): React.Node => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Text {...passProps}>{children}</Text>;
  };

  getListBullet = (): React.Node => {
    return <Text>- </Text>;
  };

  render(): React.Node {
    const {props} = this;
    // Surround description with p to allow text styling if the description is not html
    return (
      <HTML
        html={`<p>${props.html}</p>`}
        renderers={{
          p: this.getBasicText,
          li: this.getBasicText,
        }}
        listsPrefixesRenderers={{
          ul: this.getListBullet,
        }}
        ignoredTags={['img']}
        ignoredStyles={['color', 'background-color']}
        onLinkPress={this.openWebLink}
      />
    );
  }
}

export default withTheme(CustomHTML);
