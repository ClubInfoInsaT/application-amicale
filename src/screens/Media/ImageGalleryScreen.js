// @flow

import * as React from 'react';
import {IconButton, Text} from 'react-native-paper';
import ImageViewer from 'react-native-image-zoom-viewer';
import {StackNavigationProp} from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';

type PropsType = {
  navigation: StackNavigationProp,
  route: {params: {images: Array<{url: string}>}},
};

class ImageGalleryScreen extends React.Component<PropsType> {
  images: Array<{url: string}>;

  closeButtonRef: {current: null | Animatable.View};

  indicatorRef: {current: null | Animatable.View};

  controlsShown: boolean;

  constructor(props: PropsType) {
    super(props);
    this.closeButtonRef = React.createRef();
    this.indicatorRef = React.createRef();
    this.controlsShown = true;
    if (props.route.params != null) this.images = props.route.params.images;
  }

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  getRenderHeader = (): React.Node => {
    return (
      <Animatable.View
        ref={this.closeButtonRef}
        useNativeDriver
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1000,
        }}>
        <IconButton
          onPress={this.goBack}
          icon="close"
          size={30}
          style={{backgroundColor: 'rgba(0,0,0,0.6)'}}
        />
      </Animatable.View>
    );
  };

  getRenderIndicator = (
    currentIndex?: number,
    allSize?: number,
  ): React.Node => {
    if (currentIndex != null && allSize != null && allSize !== 1)
      return (
        <Animatable.View
          ref={this.indicatorRef}
          useNativeDriver
          style={{
            width: '100%',
            height: 50,
            position: 'absolute',
          }}>
          <Text
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 'auto',
              marginBottom: 'auto',
              fontSize: 15,
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: 10,
              borderRadius: 20,
            }}>
            {currentIndex}/{allSize}
          </Text>
        </Animatable.View>
      );
    return null;
  };

  onImageClick = () => {
    if (this.controlsShown) this.hideControls();
    else this.showControls();
    this.controlsShown = !this.controlsShown;
  };

  hideControls() {
    if (this.closeButtonRef.current != null)
      this.closeButtonRef.current.fadeOutUp(200);
    if (this.indicatorRef.current != null)
      this.indicatorRef.current.fadeOutUp(300);
  }

  showControls() {
    if (this.closeButtonRef.current != null)
      this.closeButtonRef.current.fadeInDown(300);
    if (this.indicatorRef.current != null)
      this.indicatorRef.current.fadeInDown(400);
  }

  render(): React.Node {
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
