// @flow

import {Linking} from 'react-native';

export default class URLHandler {

    static SCHEME = "campus-insat://";

    static CLUB_INFO_URL_PATH = "club";
    static EVENT_INFO_URL_PATH = "event";

    static CLUB_INFO_ROUTE = "club-information";
    static EVENT_INFO_ROUTE = "planning-information";

    onInitialURLParsed: Function;
    onDetectURL: Function;

    constructor(onInitialURLParsed: Function, onDetectURL: Function) {
        this.onInitialURLParsed = onInitialURLParsed;
        this.onDetectURL = onDetectURL;
    }

    listen() {
        Linking.addEventListener('url', this.onUrl);
        Linking.getInitialURL().then(this.onInitialUrl);
    }

    onUrl = ({url}: { url: string }) => {
        if (url != null) {
            let data = URLHandler.getUrlData(URLHandler.parseUrl(url));
            if (data !== null)
                this.onDetectURL(data);
        }
    };

    onInitialUrl = (url: ?string) => {
        if (url != null) {
            let data = URLHandler.getUrlData(URLHandler.parseUrl(url));
            if (data !== null)
                this.onInitialURLParsed(data);
        }
    };

    static parseUrl(url: string) {
        let params = {};
        let path = "";
        let temp = url.replace(URLHandler.SCHEME, "");
        if (temp != null) {
            let array = temp.split("?");
            if (array != null && array.length > 0) {
                path = array[0];
            }
            if (array != null && array.length > 1) {
                let tempParams = array[1].split("&");
                for (let i = 0; i < tempParams.length; i++) {
                    let paramsArray = tempParams[i].split("=");
                    if (paramsArray.length > 1) {
                        params[paramsArray[0]] = paramsArray[1];
                    }
                }
            }
        }
        return {path: path, queryParams: params};
    }

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
        return this.getUrlData(URLHandler.parseUrl(url)) !== null;
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
