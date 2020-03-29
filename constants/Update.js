import i18n from "i18n-js";

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
    static number = 5;
    // Change the icon to be displayed on the update slide
    static icon = 'surround-sound-2-0';

    static instance: Update | null = null;

    title: string;
    description: string;

    /**
     * Init translations
     */
    constructor() {
        this.title = i18n.t('intro.updateSlide.title');
        this.description = i18n.t('intro.updateSlide.text');
    }

    /**
     * Get this class instance or create one if none is found
     *
     * @returns {Update}
     */
    static getInstance(): Update {
        return Update.instance === null ?
            Update.instance = new Update() :
            Update.instance;
    }

};
