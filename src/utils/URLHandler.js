// @flow

import {Linking} from 'expo';

export default class URLHandler {

    static CLUB_INFO_URL_PATH = "club";
    static EVENT_INFO_URL_PATH = "event";

    static CLUB_INFO_ROUTE = "home-club-information";
    static EVENT_INFO_ROUTE = "home-planning-information";

    onInitialURLParsed: Function;
    onDetectURL: Function;

    constructor(onInitialURLParsed: Function, onDetectURL: Function) {
        this.onInitialURLParsed = onInitialURLParsed;
        this.onDetectURL = onDetectURL;
    }

    listen() {
        Linking.addEventListener('url', this.onUrl);
        Linking.parseInitialURLAsync().then(this.onInitialUrl);
    }

    onUrl = ({url}: Object) => {
        let data = URLHandler.getUrlData(Linking.parse(url));
        if (data !== null)
            this.onDetectURL(data);
    };

    onInitialUrl = ({path, queryParams}: Object) => {
        let data = URLHandler.getUrlData({path, queryParams});
        if (data !== null)
            this.onInitialURLParsed(data);
    };

    static getUrlData({path, queryParams}: Object) {
        let data = null;
        if (path !== null) {
            if (URLHandler.isClubInformationLink(path))
                data = URLHandler.generateClubInformationData(queryParams);
            else if (URLHandler.isPlanningInformationLink(path))
                data = URLHandler.generatePlanningInformationData(queryParams);
        }
        return data;
    }

    static isUrlValid(url: string) {
        return this.getUrlData(Linking.parse(url)) !== null;
    }

    static isClubInformationLink(path: string) {
        return path === URLHandler.CLUB_INFO_URL_PATH;
    }

    static isPlanningInformationLink(path: string) {
        return path === URLHandler.EVENT_INFO_URL_PATH;
    }

    static generateClubInformationData(params: Object): Object | null {
        if (params !== undefined && params.id !== undefined) {
            let id = parseInt(params.id);
            if (!isNaN(id)) {
                return {route: URLHandler.CLUB_INFO_ROUTE, data: {clubId: id}};
            }
        }
        return null;
    }

    static generatePlanningInformationData(params: Object): Object | null {
        if (params !== undefined && params.id !== undefined) {
            let id = parseInt(params.id);
            if (!isNaN(id)) {
                return {route: URLHandler.EVENT_INFO_ROUTE, data: {eventId: id}};
            }
        }
        return null;
    }

}
