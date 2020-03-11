// @flow

/**
 * Singleton class used to manage themes
 */
export default class AprilFoolsManager {

    static instance: AprilFoolsManager | null = null;

    aprilFoolsEnabled: boolean;

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
        menu[1]["dishes"].splice(4, 0, {name: "Coq au vin"});
        menu[1]["dishes"].splice(2, 0, {name: "Bat'Soupe"});
        menu[1]["dishes"].splice(1, 0, {name: "Pave de loup"});
        menu[1]["dishes"].splice(0, 0, {name: "Béranger à point"});
        menu[1]["dishes"].splice(0, 0, {name: "Pieds d'Arnaud"});
        return menu;
    }

    static getNewProxiwashDryerOrderedList(dryers: Array<Object>) {
        if (dryers !== undefined) {
            let second = dryers[1];
            dryers.splice(1, 1);
            dryers.push(second);
        }
    }

    static getNewProxiwashWasherOrderedList(washers: Array<Object>) {
        if (washers !== undefined) {
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

    static getProxiwashMachineDisplayNumber(number: number) {
        return AprilFoolsManager.fakeMachineNumber[number];
    }

    isAprilFoolsEnabled() {
        return this.aprilFoolsEnabled;
    }

};
