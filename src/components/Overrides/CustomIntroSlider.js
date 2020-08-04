// @flow

import * as React from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import type {MaterialCommunityIconsGlyphs} from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from 'i18n-js';
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import {Card} from 'react-native-paper';
import Update from '../../constants/Update';
import ThemeManager from '../../managers/ThemeManager';
import Mascot, {MASCOT_STYLE} from '../Mascot/Mascot';

type PropsType = {
  onDone: () => void,
  isUpdate: boolean,
  isAprilFools: boolean,
};

type StateType = {
  currentSlide: number,
};

type IntroSlideType = {
  key: string,
  title: string,
  text: string,
  view: () => React.Node,
  mascotStyle: number,
  colors: [string, string],
};

const styles = StyleSheet.create({
  mainContent: {
    paddingBottom: 100,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
  },
  center: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
});

/**
 * Class used to create intro slides
 */
export default class CustomIntroSlider extends React.Component<
  PropsType,
  StateType,
> {
  sliderRef: {current: null | AppIntroSlider};

  introSlides: Array<IntroSlideType>;

  updateSlides: Array<IntroSlideType>;

  aprilFoolsSlides: Array<IntroSlideType>;

  currentSlides: Array<IntroSlideType>;

  /**
   * Generates intro slides
   */
  constructor() {
    super();
    this.state = {
      currentSlide: 0,
    };
    this.sliderRef = React.createRef();
    this.introSlides = [
      {
        key: '0', // Mascot
        title: i18n.t('intro.slideMain.title'),
        text: i18n.t('intro.slideMain.text'),
        view: this.getWelcomeView,
        mascotStyle: MASCOT_STYLE.NORMAL,
        colors: ['#be1522', '#57080e'],
      },
      {
        key: '1',
        title: i18n.t('intro.slidePlanex.title'),
        text: i18n.t('intro.slidePlanex.text'),
        view: (): React.Node => CustomIntroSlider.getIconView('calendar-clock'),
        mascotStyle: MASCOT_STYLE.INTELLO,
        colors: ['#be1522', '#57080e'],
      },
      {
        key: '2',
        title: i18n.t('intro.slideEvents.title'),
        text: i18n.t('intro.slideEvents.text'),
        view: (): React.Node => CustomIntroSlider.getIconView('calendar-star'),
        mascotStyle: MASCOT_STYLE.HAPPY,
        colors: ['#be1522', '#57080e'],
      },
      {
        key: '3',
        title: i18n.t('intro.slideServices.title'),
        text: i18n.t('intro.slideServices.text'),
        view: (): React.Node =>
          CustomIntroSlider.getIconView('view-dashboard-variant'),
        mascotStyle: MASCOT_STYLE.CUTE,
        colors: ['#be1522', '#57080e'],
      },
      {
        key: '4',
        title: i18n.t('intro.slideDone.title'),
        text: i18n.t('intro.slideDone.text'),
        view: (): React.Node => this.getEndView(),
        mascotStyle: MASCOT_STYLE.COOL,
        colors: ['#9c165b', '#3e042b'],
      },
    ];
    // $FlowFixMe
    this.updateSlides = [];
    for (let i = 0; i < Update.slidesNumber; i += 1) {
      this.updateSlides.push({
        key: i.toString(),
        title: Update.getInstance().titleList[i],
        text: Update.getInstance().descriptionList[i],
        icon: Update.iconList[i],
        colors: Update.colorsList[i],
      });
    }

    this.aprilFoolsSlides = [
      {
        key: '1',
        title: i18n.t('intro.aprilFoolsSlide.title'),
        text: i18n.t('intro.aprilFoolsSlide.text'),
        view: (): React.Node => <View />,
        mascotStyle: MASCOT_STYLE.NORMAL,
        colors: ['#e01928', '#be1522'],
      },
    ];
  }

  /**
   * Render item to be used for the intro introSlides
   *
   * @param item The item to be displayed
   * @param dimensions Dimensions of the item
   */
  getIntroRenderItem = ({
    item,
    dimensions,
  }: {
    item: IntroSlideType,
    dimensions: {width: number, height: number},
  }): React.Node => {
    const {state} = this;
    const index = parseInt(item.key, 10);
    return (
      <LinearGradient
        style={[styles.mainContent, dimensions]}
        colors={item.colors}
        start={{x: 0, y: 0.1}}
        end={{x: 0.1, y: 1}}>
        {state.currentSlide === index ? (
          <View style={{height: '100%', flex: 1}}>
            <View style={{flex: 1}}>{item.view()}</View>
            <Animatable.View animation="fadeIn">
              {index !== 0 && index !== this.introSlides.length - 1 ? (
                <Mascot
                  style={{
                    marginLeft: 30,
                    marginBottom: 0,
                    width: 100,
                    marginTop: -30,
                  }}
                  emotion={item.mascotStyle}
                  animated
                  entryAnimation={{
                    animation: 'slideInLeft',
                    duration: 500,
                  }}
                  loopAnimation={{
                    animation: 'pulse',
                    iterationCount: 'infinite',
                    duration: 2000,
                  }}
                />
              ) : null}
              <View
                style={{
                  marginLeft: 50,
                  width: 0,
                  height: 0,
                  borderLeftWidth: 20,
                  borderRightWidth: 0,
                  borderBottomWidth: 20,
                  borderStyle: 'solid',
                  backgroundColor: 'transparent',
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottomColor: 'rgba(0,0,0,0.60)',
                }}
              />
              <Card
                style={{
                  backgroundColor: 'rgba(0,0,0,0.38)',
                  marginHorizontal: 20,
                  borderColor: 'rgba(0,0,0,0.60)',
                  borderWidth: 4,
                  borderRadius: 10,
                }}>
                <Card.Content>
                  <Animatable.Text
                    animation="fadeIn"
                    delay={100}
                    style={styles.title}>
                    {item.title}
                  </Animatable.Text>
                  <Animatable.Text
                    animation="fadeIn"
                    delay={200}
                    style={styles.text}>
                    {item.text}
                  </Animatable.Text>
                </Card.Content>
              </Card>
            </Animatable.View>
          </View>
        ) : null}
      </LinearGradient>
    );
  };

  getEndView = (): React.Node => {
    return (
      <View style={{flex: 1}}>
        <Mascot
          style={{
            ...styles.center,
            height: '80%',
          }}
          emotion={MASCOT_STYLE.COOL}
          animated
          entryAnimation={{
            animation: 'slideInDown',
            duration: 2000,
          }}
          loopAnimation={{
            animation: 'pulse',
            duration: 2000,
            iterationCount: 'infinite',
          }}
        />
      </View>
    );
  };

  getWelcomeView = (): React.Node => {
    return (
      <View style={{flex: 1}}>
        <Mascot
          style={{
            ...styles.center,
            height: '80%',
          }}
          emotion={MASCOT_STYLE.NORMAL}
          animated
          entryAnimation={{
            animation: 'bounceIn',
            duration: 2000,
          }}
        />
        <Animatable.Text
          useNativeDriver
          animation="fadeInUp"
          duration={500}
          style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: 25,
          }}>
          PABLO
        </Animatable.Text>
        <Animatable.View
          useNativeDriver
          animation="fadeInUp"
          duration={500}
          delay={200}
          style={{
            position: 'absolute',
            bottom: 30,
            right: '20%',
            width: 50,
            height: 50,
          }}>
          <MaterialCommunityIcons
            style={{
              ...styles.center,
              transform: [{rotateZ: '70deg'}],
            }}
            name="undo"
            color="#fff"
            size={40}
          />
        </Animatable.View>
      </View>
    );
  };

  static getIconView(icon: MaterialCommunityIconsGlyphs): React.Node {
    return (
      <View style={{flex: 1}}>
        <Animatable.View style={styles.center} animation="fadeIn">
          <MaterialCommunityIcons name={icon} color="#fff" size={200} />
        </Animatable.View>
      </View>
    );
  }

  static setStatusBarColor(color: string) {
    if (Platform.OS === 'android') StatusBar.setBackgroundColor(color, true);
  }

  onSlideChange = (index: number) => {
    CustomIntroSlider.setStatusBarColor(this.currentSlides[index].colors[0]);
    this.setState({currentSlide: index});
  };

  onSkip = () => {
    CustomIntroSlider.setStatusBarColor(
      this.currentSlides[this.currentSlides.length - 1].colors[0],
    );
    if (this.sliderRef.current != null)
      this.sliderRef.current.goToSlide(this.currentSlides.length - 1);
  };

  onDone = () => {
    const {props} = this;
    CustomIntroSlider.setStatusBarColor(
      ThemeManager.getCurrentTheme().colors.surface,
    );
    props.onDone();
  };

  getRenderNextButton = (): React.Node => {
    return (
      <Animatable.View
        animation="fadeIn"
        style={{
          borderRadius: 25,
          padding: 5,
          backgroundColor: 'rgba(0,0,0,0.2)',
        }}>
        <MaterialCommunityIcons name="arrow-right" color="#fff" size={40} />
      </Animatable.View>
    );
  };

  getRenderDoneButton = (): React.Node => {
    return (
      <Animatable.View
        animation="bounceIn"
        style={{
          borderRadius: 25,
          padding: 5,
          backgroundColor: 'rgb(190,21,34)',
        }}>
        <MaterialCommunityIcons name="check" color="#fff" size={40} />
      </Animatable.View>
    );
  };

  render(): React.Node {
    const {props, state} = this;
    this.currentSlides = this.introSlides;
    if (props.isUpdate) this.currentSlides = this.updateSlides;
    else if (props.isAprilFools) this.currentSlides = this.aprilFoolsSlides;
    CustomIntroSlider.setStatusBarColor(this.currentSlides[0].colors[0]);
    return (
      <AppIntroSlider
        ref={this.sliderRef}
        data={this.currentSlides}
        extraData={state.currentSlide}
        renderItem={this.getIntroRenderItem}
        renderNextButton={this.getRenderNextButton}
        renderDoneButton={this.getRenderDoneButton}
        onDone={this.onDone}
        onSlideChange={this.onSlideChange}
        onSkip={this.onSkip}
      />
    );
  }
}
