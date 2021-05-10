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
import { Text } from 'react-native-paper';
import HTML from 'react-native-render-html';
import { GestureResponderEvent, Linking } from 'react-native';

type PropsType = {
  html: string;
};

/**
 * Abstraction layer for Agenda component, using custom configuration
 */
function CustomHTML(props: PropsType) {
  const openWebLink = (_event: GestureResponderEvent, link: string) => {
    Linking.openURL(link);
  };

  const getBasicText = (
    _htmlAttribs: any,
    children: any,
    _convertedCSSStyles: any,
    passProps: any
  ) => {
    return <Text {...passProps}>{children}</Text>;
  };

  const getListBullet = () => {
    return <Text>- </Text>;
  };

  // Surround description with p to allow text styling if the description is not html
  return (
    <HTML
      html={`<p>${props.html}</p>`}
      renderers={{
        p: getBasicText,
        li: getBasicText,
      }}
      listsPrefixesRenderers={{
        ul: getListBullet,
      }}
      ignoredTags={['img']}
      ignoredStyles={['color', 'background-color']}
      onLinkPress={openWebLink}
    />
  );
}

export default CustomHTML;
