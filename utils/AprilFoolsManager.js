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
        menu[1]["dishes"].splice(2, 0, {name: "Coq au vin"});
        menu[1]["dishes"].splice(1, 0, {name: "Pave de loup"});
        menu[1]["dishes"].splice(0, 0, {name: "Béranger à point"});
        menu[1]["dishes"].splice(0, 0, {name: "Pieds d'Arnaud"});
        return menu;
    }

    static getAprilFoolsTheme(currentTheme: Object) {
        return {
            ...currentTheme,
            colors: {
                ...currentTheme.colors,
                primary: '#00be45',
                accent: '#00be45',
                background: '#d02eee',
                tabIcon: "#380d43",
                card: "#eed639",
                surface: "#eed639",
                dividerBackground: '#c72ce4',
                textDisabled: '#b9b9b9',

                // Calendar/Agenda
                agendaBackgroundColor: '#c72ce4',
                agendaDayTextColor: '#6d6d6d',
            },
        };
    }

    isAprilFoolsEnabled() {
        return this.aprilFoolsEnabled;
    }

};
