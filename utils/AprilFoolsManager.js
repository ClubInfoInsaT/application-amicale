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

    static getFakeEvent() {
        return {
            category_id: 1,
            club: "Coucou",
            date_begin: "2020-04-01 20:30:00",
            date_end: "2020-04-01 23:59:00",
            description: "Trop génial",
            id: "-1",
            logo: null,
            title: "Super event trop whoaou",
            url: null
        };
    }

    static getFakeMenuItem(menu: Object) {
        if (menu[1]["dishes"].length >= 3) {
            menu[1]["dishes"].splice(0, 0, {name: "Truc à la con"});
            menu[1]["dishes"].splice(2, 0, {name: "Autre truc à la con"});
        } else {
            menu[1]["dishes"].push({name: "Truc à la con"});
            menu[1]["dishes"].push({name: "Autre truc à la con"});
        }
        return menu;
    }

    static getAprilFoolsTheme(currentTheme : Object) {
        return {
            ...currentTheme,
            colors: {
                ...currentTheme.colors,
                primary: '#bebe03',
                accent: '#bebe03',
                background: '#5b3e02',
                tabBackground: "#5b3e02",
                card: "#5b3e02",
                surface: "#5b3e02",
                dividerBackground: '#362201',
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
