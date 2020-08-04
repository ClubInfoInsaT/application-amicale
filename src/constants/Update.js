// @flow

import i18n from 'i18n-js';

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
  static number = 6;

  // Change the number of slides to display
  static slidesNumber = 4;

  // Change the icons to be displayed on the update slide
  static iconList = ['star', 'clock', 'qrcode-scan', 'account'];

  static colorsList = [
    ['#e01928', '#be1522'],
    ['#7c33ec', '#5e11d1'],
    ['#337aec', '#114ed1'],
    ['#e01928', '#be1522'],
  ];

  static instance: Update | null = null;

  titleList: Array<string>;

  descriptionList: Array<string>;

  /**
   * Init translations
   */
  constructor() {
    this.titleList = [];
    this.descriptionList = [];
    for (let i = 0; i < Update.slidesNumber; i += 1) {
      this.titleList.push(i18n.t(`intro.updateSlide${i}.title`));
      this.descriptionList.push(i18n.t(`intro.updateSlide${i}.text`));
    }
  }

  /**
   * Get this class instance or create one if none is found
   *
   * @returns {Update}
   */
  static getInstance(): Update {
    if (Update.instance == null) Update.instance = new Update();
    return Update.instance;
  }
}
