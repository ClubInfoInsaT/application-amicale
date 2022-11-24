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
import { useTheme, Text } from 'react-native-paper';
import HTML, {
  TBlock,
  TText,
  CustomRendererProps,
} from 'react-native-render-html';
import {
  Dimensions,
  GestureResponderEvent,
  Linking,
  StyleProp,
  TextStyle,
} from 'react-native';

type PropsType = {
  html: string;
};

/**
 * Abstraction layer for Agenda component, using custom configuration
 */
function CustomHTML(props: PropsType) {
  const theme = useTheme();
  const openWebLink = (_event: GestureResponderEvent, link: string) => {
    Linking.openURL(link);
  };

  // Why is this so complex?? I just want to replace the default Text element with the one
  // from react-native-paper
  // Might need to read the doc a bit more: https://meliorence.github.io/react-native-render-html/
  // For now this seems to work
  const getBasicText = (rendererProps: CustomRendererProps<TBlock>) => {
    if (!rendererProps.tnode.children[0]) return <Text />;
    let textNodes = rendererProps.tnode.children[0].children.map((child, i) => {
      const text = child as TText;
      const tag = text.tagName;
      const style: StyleProp<TextStyle> = {
        fontWeight: tag === 'strong' || tag === 'b' ? 'bold' : 'normal',
        fontStyle: tag === 'em' || tag === 'i' ? 'italic' : 'normal',
        color: tag === 'a' ? 'blue' : undefined,
      };
      const onPress =
        tag === 'a' && text.domNode && text.domNode.attribs.href
          ? (_event: GestureResponderEvent) =>
              openWebLink(_event, text.domNode.attribs.href)
          : () => {};
      return (
        <Text style={style} key={i} onPress={onPress}>
          {text.data}
        </Text>
      );
    });
    return <Text>{textNodes}</Text>;
  };

  return (
    <HTML
      // Surround description with p to allow text styling if the description is not html
      source={{ html: `<p>${props.html}</p>` }}
      // Use Paper Text instead of React
      renderers={{
        p: getBasicText,
        li: getBasicText,
        // em: getBasicText,
      }}
      // Sometimes we have images inside the text, just ignore them
      // Default linebreaks are sufficient.
      ignoredDomTags={['img', 'br']}
      // Ignore text color
      ignoredStyles={['color', 'backgroundColor']}
      contentWidth={Dimensions.get('window').width - 50}
      renderersProps={{
        a: {
          onPress: openWebLink,
        },
        ul: {
          markerTextStyle: {
            color: theme.colors.text,
          },
        },
      }}
    />
  );
}

export default CustomHTML;
