// @flow

import * as React from 'react';
import {TouchableRipple, withTheme} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import {Image} from 'react-native-animatable';
import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {CustomThemeType} from '../../managers/ThemeManager';

type PropsType = {
  navigation: StackNavigationProp,
  images: Array<{url: string}>,
  theme: CustomThemeType,
  style: ViewStyleProp,
};

class ImageGalleryButton extends React.Component<PropsType> {
  onPress = () => {
    const {navigation, images} = this.props;
    navigation.navigate('gallery', {images});
  };

  render(): React.Node {
    const {style, images} = this.props;
    return (
      <TouchableRipple onPress={this.onPress} style={style}>
        <Image
          resizeMode="contain"
          source={{uri: images[0].url}}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </TouchableRipple>
    );
  }
}

export default withTheme(ImageGalleryButton);
