import i18n from "i18n-js";

export default class Update {

    static number = 5;
    static icon = 'surround-sound-2-0';

    static instance: Update | null = null;

    constructor() {
        this.title = i18n.t('intro.updateSlide.title');
        this.description = i18n.t('intro.updateSlide.text');
    }

    /**
     * Get this class instance or create one if none is found
     * @returns {Update}
     */
    static getInstance(): Update {
        return Update.instance === null ?
            Update.instance = new Update() :
            Update.instance;
    }

};
