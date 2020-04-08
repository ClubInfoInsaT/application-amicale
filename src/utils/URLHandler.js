// @flow

import {Linking} from 'expo';

export default class URLHandler {

    static CLUB_INFO_ROUTE = "club-information";
    static EVENT_INFO_ROUTE = "planning-information";

    onInitialURLParsed: Function;
    onDetectURL: Function;

    constructor(onInitialURLParsed: Function, onDetectURL: Function) {
        this.onInitialURLParsed = onInitialURLParsed;
        this.onDetectURL = onDetectURL;
    }

    listen() {
        console.log(Linking.makeUrl('main/home/club-information', {clubId: 1}));
        Linking.addEventListener('url', this.onUrl);
        Linking.parseInitialURLAsync().then(this.onInitialUrl);
    }

    onUrl = ({url}: Object) => {
        let data = this.getUrlData(Linking.parse(url));
        if (data !== null)
            this.onDetectURL(data);
    };

    onInitialUrl = ({path, queryParams}: Object) => {
        let data = this.getUrlData({path, queryParams});
        if (data !== null)
            this.onInitialURLParsed(data);
    };

    getUrlData({path, queryParams}: Object) {
        let data = null;
        if (path !== null) {
            let pathArray = path.split('/');
            if (this.isClubInformationLink(pathArray))
                data = this.generateClubInformationData(queryParams);
            else if (this.isPlanningInformationLink(pathArray))
                data = this.generatePlanningInformationData(queryParams);
        }
        return data;
    }

    isClubInformationLink(pathArray: Array<string>) {
        return pathArray[0] === "main" && pathArray[1] === "home" && pathArray[2] === "club-information";
    }

    isPlanningInformationLink(pathArray: Array<string>) {
        return pathArray[0] === "main" && pathArray[1] === "home" && pathArray[2] === "planning-information";
    }

    generateClubInformationData(params: Object): Object | null {
        if (params !== undefined && params.clubId !== undefined) {
            let id = parseInt(params.clubId);
            if (!isNaN(id)) {
                return {route: URLHandler.CLUB_INFO_ROUTE, data: {clubId: id}};
            }
        }
        return null;
    }

    generatePlanningInformationData(params: Object): Object | null {
        if (params !== undefined && params.eventId !== undefined) {
            let id = parseInt(params.eventId);
            if (!isNaN(id)) {
                return {route: URLHandler.EVENT_INFO_ROUTE, data: {eventId: id}};
            }
        }
        return null;
    }

}
