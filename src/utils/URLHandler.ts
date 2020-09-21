/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

import {Linking} from 'react-native';

export type ParsedUrlDataType = {
  route: string;
  data: {[key: string]: string};
};

export type ParsedUrlCallbackType = (parsedData: ParsedUrlDataType) => void;

type RawParsedUrlDataType = {
  path: string;
  queryParams: {[key: string]: string};
};

/**
 * Class use to handle depp links scanned or clicked.
 */
export default class URLHandler {
  static SCHEME = 'campus-insat://'; // Urls beginning with this string will be opened in the app

  static CLUB_INFO_URL_PATH = 'club';

  static EVENT_INFO_URL_PATH = 'event';

  static CLUB_INFO_ROUTE = 'club-information';

  static EVENT_INFO_ROUTE = 'planning-information';

  onInitialURLParsed: ParsedUrlCallbackType;

  onDetectURL: ParsedUrlCallbackType;

  constructor(
    onInitialURLParsed: ParsedUrlCallbackType,
    onDetectURL: ParsedUrlCallbackType,
  ) {
    this.onInitialURLParsed = onInitialURLParsed;
    this.onDetectURL = onDetectURL;
  }

  /**
   * Parses the given url to retrieve the corresponding app path and associated arguments.
   *
   * @param url The url to parse
   * @returns {{path: string, queryParams: {}}}
   */
  static parseUrl(url: string): RawParsedUrlDataType | null {
    let parsedData: RawParsedUrlDataType | null = null;
    const urlNoScheme = url.replace(URLHandler.SCHEME, '');
    if (urlNoScheme != null) {
      const params: {[key: string]: string} = {};
      const [path, fullParamsString] = urlNoScheme.split('?');
      if (fullParamsString != null) {
        const paramsStringArray = fullParamsString.split('&');
        paramsStringArray.forEach((paramString: string) => {
          const [key, value] = paramString.split('=');
          if (value != null) {
            params[key] = value;
          }
        });
      }
      if (path != null) {
        parsedData = {path, queryParams: params};
      }
    }
    return parsedData;
  }

  /**
   * Gets routing data corresponding to the given url.
   * If the url does not match any existing route, null will be returned.
   *
   * @param rawParsedUrlData The data just parsed
   * @returns {null}
   */
  static getUrlData(
    rawParsedUrlData: RawParsedUrlDataType | null,
  ): ParsedUrlDataType | null {
    let parsedData: null | ParsedUrlDataType = null;
    if (rawParsedUrlData != null) {
      const {path} = rawParsedUrlData;
      const {queryParams} = rawParsedUrlData;
      if (URLHandler.isClubInformationLink(path)) {
        parsedData = URLHandler.generateClubInformationData(queryParams);
      } else if (URLHandler.isPlanningInformationLink(path)) {
        parsedData = URLHandler.generatePlanningInformationData(queryParams);
      }
    }

    return parsedData;
  }

  /**
   * Checks if the given url is in a valid format
   *
   * @param url The url to check
   * @returns {boolean}
   */
  static isUrlValid(url: string): boolean {
    return this.getUrlData(URLHandler.parseUrl(url)) !== null;
  }

  /**
   * Check if the given path links to the club information screen
   *
   * @param path The url to check
   * @returns {boolean}
   */
  static isClubInformationLink(path: string): boolean {
    return path === URLHandler.CLUB_INFO_URL_PATH;
  }

  /**
   * Check if the given path links to the planning information screen
   *
   * @param path The url to check
   * @returns {boolean}
   */
  static isPlanningInformationLink(path: string): boolean {
    return path === URLHandler.EVENT_INFO_URL_PATH;
  }

  /**
   * Generates data formatted for the club information screen from the url parameters.
   *
   * @param params Url parameters to convert
   * @returns {null|{route: string, data: {clubId: number}}}
   */
  static generateClubInformationData(params: {
    [key: string]: string;
  }): ParsedUrlDataType | null {
    if (params.id != null) {
      const id = parseInt(params.id, 10);
      if (!Number.isNaN(id)) {
        return {
          route: URLHandler.CLUB_INFO_ROUTE,
          data: {clubId: id.toString()},
        };
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
  static generatePlanningInformationData(params: {
    [key: string]: string;
  }): ParsedUrlDataType | null {
    if (params.id != null) {
      const id = parseInt(params.id, 10);
      if (!Number.isNaN(id)) {
        return {
          route: URLHandler.EVENT_INFO_ROUTE,
          data: {eventId: id.toString()},
        };
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
  onUrl = ({url}: {url: string}) => {
    if (url != null) {
      const data = URLHandler.getUrlData(URLHandler.parseUrl(url));
      if (data != null) {
        this.onDetectURL(data);
      }
    }
  };

  /**
   * Gets data from the given url and calls the initial callback with it.
   *
   * @param url The url detected
   */
  onInitialUrl = (url: string | null) => {
    if (url != null) {
      const data = URLHandler.getUrlData(URLHandler.parseUrl(url));
      if (data != null) {
        this.onInitialURLParsed(data);
      }
    }
  };
}
