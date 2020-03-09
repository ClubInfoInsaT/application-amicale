// @flow

/**
 * Singleton class used to manage themes
 */
export default class AprilFoolsManager {

    static instance: AprilFoolsManager | null = null;

    aprilFoolsEnabled: boolean;

    constructor() {
        let today = new Date();
        this.aprilFoolsEnabled = (today.getDate() === 1 && today.getMonth() === 3);
    }

    /**
     * Get this class instance or create one if none is found
     * @returns {ThemeManager}
     */
    static getInstance(): AprilFoolsManager {
        return AprilFoolsManager.instance === null ?
            AprilFoolsManager.instance = new AprilFoolsManager() :
            AprilFoolsManager.instance;
    }

    static getFakeMenuItem(menu: Object) {
        if (menu[1]["dishes"].length >= 3) {
            menu[1]["dishes"].splice(0, 0, {name: "Coq au vin"});
            menu[1]["dishes"].splice(2, 0, {name: "Pave de loup"});
        } else {
            menu[1]["dishes"].push({name: "Coq au vin"});
            menu[1]["dishes"].push({name: "Pave de loup"});
        }
        return menu;
    }

    static getAprilFoolsTheme(currentTheme : Object) {
        return {
            ...currentTheme,
            colors: {
                ...currentTheme.colors,
                primary: '#00be45',
                accent: '#00be45',
                background: '#50005b',
                tabBackground: "#50005b",
                card: "#50005b",
                surface: "#50005b",
                dividerBackground: '#3e0047',
                textDisabled: '#b9b9b9',

                // Calendar/Agenda
                agendaBackgroundColor: '#5b3e02',
                agendaDayTextColor: '#6d6d6d',
            },
        };
    }

    isAprilFoolsEnabled() {
        return this.aprilFoolsEnabled;
    }

};
