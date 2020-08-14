// @flow

import * as React from 'react';
import i18n from 'i18n-js';
import type {IntroSlideType} from '../components/Overrides/CustomIntroSlider';
import MascotIntroWelcome from '../components/Intro/MascotIntroWelcome';
import IntroIcon from '../components/Intro/IconIntro';

/**
 * Singleton used to manage update slides.
 * Must be a singleton because it uses translations.
 *
 * Change values in this class to change the update slide.
 * You will also need to update those translations:
 * <ul>
 *     <li>intro.updateSlide.title</li>
 *     <li>intro.updateSlide.text</li>
 * </ul>
 */
export default class Update {
  // Increment the number to show the update slide
  static number = 7;

  updateSlides: Array<IntroSlideType>;

  /**
   * Init translations
   */
  constructor() {
    this.updateSlides = [
      {
        key: '0',
        title: i18n.t(`intro.updateSlide0.title`),
        text: i18n.t(`intro.updateSlide0.text`),
        view: (): React.Node => <MascotIntroWelcome />,
        colors: ['#be1522', '#57080e'],
      },
      {
        key: '1',
        title: i18n.t(`intro.updateSlide1.title`),
        text: i18n.t(`intro.updateSlide1.text`),
        view: (): React.Node => <IntroIcon icon="account-heart-outline" />,
        colors: ['#9c165b', '#3e042b'],
      },
    ];
  }

  getUpdateSlides(): Array<IntroSlideType> {
    return this.updateSlides;
  }
}
