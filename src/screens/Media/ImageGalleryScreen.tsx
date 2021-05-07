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
import { IconButton, Text } from 'react-native-paper';
import ImageViewer from 'react-native-image-zoom-viewer';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';
import { StyleSheet, View } from 'react-native';
import { MainStackParamsList } from '../../navigation/MainNavigator';

type ImageGalleryScreenNavigationProp = StackScreenProps<
  MainStackParamsList,
  'gallery'
>;

type Props = ImageGalleryScreenNavigationProp & {
  navigation: StackNavigationProp<any>;
};

const styles = StyleSheet.create({
  closeButtonContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1000,
  },
  closeButtonIcon: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  indicatorContainer: {
    width: '100%',
    height: 50,
    position: 'absolute',
  },
  indicatorText: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: 'white',
    padding: 10,
    borderRadius: 20,
  },
});

class ImageGalleryScreen extends React.Component<Props> {
  images: Array<{ url: string }>;

  closeButtonRef: { current: null | (Animatable.View & View) };

  indicatorRef: { current: null | (Animatable.View & View) };

  controlsShown: boolean;

  constructor(props: Props) {
    super(props);
    this.closeButtonRef = React.createRef();
    this.indicatorRef = React.createRef();
    this.controlsShown = true;
    if (props.route.params) {
      this.images = props.route.params.images;
    } else {
      this.images = [];
    }
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  getRenderHeader = () => {
    return (
      <Animatable.View
        ref={this.closeButtonRef}
        useNativeDriver
        style={styles.closeButtonContainer}
      >
        <IconButton
          onPress={this.goBack}
          icon="close"
          size={30}
          color={'white'}
          style={styles.closeButtonIcon}
        />
      </Animatable.View>
    );
  };

  getRenderIndicator = (currentIndex?: number, allSize?: number) => {
    if (currentIndex != null && allSize != null && allSize !== 1) {
      return (
        <Animatable.View
          ref={this.indicatorRef}
          useNativeDriver
          style={styles.indicatorContainer}
        >
          <Text style={styles.indicatorText}>
            {currentIndex}/{allSize}
          </Text>
        </Animatable.View>
      );
    }
    return <View />;
  };

  onImageClick = () => {
    if (this.controlsShown) {
      this.hideControls();
    } else {
      this.showControls();
    }
    this.controlsShown = !this.controlsShown;
  };

  hideControls() {
    if (this.closeButtonRef.current && this.closeButtonRef.current.fadeOutUp) {
      this.closeButtonRef.current.fadeOutUp(200);
    }
    if (this.indicatorRef.current && this.indicatorRef.current.fadeOutUp) {
      this.indicatorRef.current.fadeOutUp(300);
    }
  }

  showControls() {
    if (this.closeButtonRef.current && this.closeButtonRef.current.fadeInDown) {
      this.closeButtonRef.current.fadeInDown(300);
    }
    if (this.indicatorRef.current && this.indicatorRef.current.fadeInDown) {
      this.indicatorRef.current.fadeInDown(400);
    }
  }

  render() {
    return (
      <ImageViewer
        useNativeDriver
        imageUrls={this.images}
        enableSwipeDown
        onSwipeDown={this.goBack}
        renderHeader={this.getRenderHeader}
        renderIndicator={this.getRenderIndicator}
        pageAnimateTime={100}
        onClick={this.onImageClick}
        doubleClickInterval={250}
      />
    );
  }
}

export default ImageGalleryScreen;
