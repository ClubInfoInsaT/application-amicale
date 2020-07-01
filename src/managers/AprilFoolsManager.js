// @flow

import type {Machine} from "../screens/Proxiwash/ProxiwashScreen";

/**
 * Singleton class used to manage april fools
 */
export default class AprilFoolsManager {

    static instance: AprilFoolsManager | null = null;
    static fakeMachineNumber = [
        "",
        "cos(ln(1))",
        "0,5⁻¹",
        "567/189",
        "√2×√8",
        "√50×sin(9π/4)",
        "⌈π+e⌉",
        "div(rot(B))+7",
        "4×cosh(0)+4",
        "8-(-i)²",
        "|5√2+5√2i|",
        "1×10¹+1×10⁰",
        "Re(√192e^(iπ/6))",
    ];
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

    /**
     * Adds fake menu entries
     *
     * @param menu
     * @returns {Object}
     */
    static getFakeMenuItem(menu: Array<{dishes: Array<{name: string}>}>) {
        menu[1]["dishes"].splice(4, 0, {name: "Coq au vin"});
        menu[1]["dishes"].splice(2, 0, {name: "Bat'Soupe"});
        menu[1]["dishes"].splice(1, 0, {name: "Pave de loup"});
        menu[1]["dishes"].splice(0, 0, {name: "Béranger à point"});
        menu[1]["dishes"].splice(0, 0, {name: "Pieds d'Arnaud"});
        return menu;
    }

    /**
     * Changes proxiwash dryers order
     *
     * @param dryers
     */
    static getNewProxiwashDryerOrderedList(dryers: Array<Machine> | null) {
        if (dryers != null) {
            let second = dryers[1];
            dryers.splice(1, 1);
            dryers.push(second);
        }
    }

    /**
     * Changes proxiwash washers order
     *
     * @param washers
     */
    static getNewProxiwashWasherOrderedList(washers: Array<Machine> | null) {
        if (washers != null) {
            let first = washers[0];
            let second = washers[1];
            let fifth = washers[4];
            let ninth = washers[8];
            washers.splice(8, 1, second);
            washers.splice(4, 1, ninth);
            washers.splice(1, 1, first);
            washers.splice(0, 1, fifth);
        }
    }

    /**
     * Gets the new display number for the given machine number
     *
     * @param number
     * @returns {string}
     */
    static getProxiwashMachineDisplayNumber(number: number) {
        return AprilFoolsManager.fakeMachineNumber[number];
    }

    /**
     * Gets the new and ugly april fools theme
     *
     * @param currentTheme
     * @returns {{colors: {textDisabled: string, agendaDayTextColor: string, surface: string, background: string, dividerBackground: string, accent: string, agendaBackgroundColor: string, tabIcon: string, card: string, primary: string}}}
     */
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
