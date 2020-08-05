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
