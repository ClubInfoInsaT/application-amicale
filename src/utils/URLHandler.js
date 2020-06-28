// @flow

import {Linking} from 'react-native';

/**
 * Class use to handle depp links scanned or clicked.
 */
export default class URLHandler {

    static SCHEME = "campus-insat://"; // Urls beginning with this string will be opened in the app

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

    /**
     * Parses the given url to retrieve the corresponding app path and associated arguments.
     *
     * @param url The url to parse
     * @returns {{path: string, queryParams: {}}}
     */
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

    /**
     * Gets routing data corresponding to the given url.
     * If the url does not match any existing route, null will be returned.
     *
     * @param path Url path
     * @param queryParams Url parameters
     * @returns {null}
     */
    static getUrlData({path, queryParams}: { path: string, queryParams: { [key: string]: string } }) {
        let data = null;
        if (path !== null) {
            if (URLHandler.isClubInformationLink(path))
                data = URLHandler.generateClubInformationData(queryParams);
            else if (URLHandler.isPlanningInformationLink(path))
                data = URLHandler.generatePlanningInformationData(queryParams);
        }
        return data;
    }

    /**
     * Checks if the given url is in a valid format
     *
     * @param url The url to check
     * @returns {boolean}
     */
    static isUrlValid(url: string) {
        return this.getUrlData(URLHandler.parseUrl(url)) !== null;
    }

    /**
     * Check if the given path links to the club information screen
     *
     * @param path The url to check
     * @returns {boolean}
     */
    static isClubInformationLink(path: string) {
        return path === URLHandler.CLUB_INFO_URL_PATH;
    }

    /**
     * Check if the given path links to the planning information screen
     *
     * @param path The url to check
     * @returns {boolean}
     */
    static isPlanningInformationLink(path: string) {
        return path === URLHandler.EVENT_INFO_URL_PATH;
    }

    /**
     * Generates data formatted for the club information screen from the url parameters.
     *
     * @param params Url parameters to convert
     * @returns {null|{route: string, data: {clubId: number}}}
     */
    static generateClubInformationData(params: Object): Object | null {
        if (params !== undefined && params.id !== undefined) {
            let id = parseInt(params.id);
            if (!isNaN(id)) {
                return {route: URLHandler.CLUB_INFO_ROUTE, data: {clubId: id}};
            }
        }
        return null;
    }

    /**
     * Generates data formatted for the planning information screen from the url parameters.
     *
     * @param params Url parameters to convert
     * @returns {null|{route: string, data: {clubId: number}}}
     */
    static generatePlanningInformationData(params: Object): Object | null {
        if (params !== undefined && params.id !== undefined) {
            let id = parseInt(params.id);
            if (!isNaN(id)) {
                return {route: URLHandler.EVENT_INFO_ROUTE, data: {eventId: id}};
            }
        }
        return null;
    }

    /**
     * Starts listening to events.
     *
     * There are 2 types of event.
     *
     * A classic event, triggered while the app is active.
     * An initial event, called when the app was opened by clicking on a link
     *
     */
    listen() {
        Linking.addEventListener('url', this.onUrl);
        Linking.getInitialURL().then(this.onInitialUrl);
    }

    /**
     * Gets data from the given url and calls the classic callback with it.
     *
     * @param url The url detected
     */
    onUrl = ({url}: { url: string }) => {
        if (url != null) {
            let data = URLHandler.getUrlData(URLHandler.parseUrl(url));
            if (data !== null)
                this.onDetectURL(data);
        }
    };

    /**
     * Gets data from the given url and calls the initial callback with it.
     *
     * @param url The url detected
     */
    onInitialUrl = (url: ?string) => {
        if (url != null) {
            let data = URLHandler.getUrlData(URLHandler.parseUrl(url));
            if (data !== null)
                this.onInitialURLParsed(data);
        }
    };

}
