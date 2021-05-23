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

import Urls from '../constants/Urls';
import { API_REQUEST_CODES, REQUEST_STATUS } from './Requests';

// export const ERROR_TYPE = {
//   SUCCESS: 0,
//   BAD_CREDENTIALS: 1,
//   BAD_TOKEN: 2,
//   NO_CONSENT: 3,
//   TOKEN_SAVE: 4,
//   TOKEN_RETRIEVE: 5,
//   BAD_INPUT: 400,
//   FORBIDDEN: 403,
//   CONNECTION_ERROR: 404,
//   SERVER_ERROR: 500,
//   UNKNOWN: 999,
// };

export type ApiDataLoginType = {
  token: string;
};

type ApiResponseType<T> = {
  status: REQUEST_STATUS;
  error?: API_REQUEST_CODES;
  data?: T;
};

export type ApiRejectType = {
  status: REQUEST_STATUS;
  code?: API_REQUEST_CODES;
};

/**
 * Checks if the given API response is valid.
 *
 * For a request to be valid, it must match the response_format as defined in this file.
 *
 * @param response
 * @returns {boolean}
 */
export function isApiResponseValid<T>(response: ApiResponseType<T>): boolean {
  return (
    response != null &&
    response.error != null &&
    response.data != null &&
    typeof response.data === 'object'
  );
}

/**
 * Sends a request to the Amicale Website backend
 *
 * In case of failure, the promise will be rejected with the error code.
 * In case of success, the promise will return the data object.
 *
 * @param path The API path from the API endpoint
 * @param method The HTTP method to use (GET or POST)
 * @param params The params to use for this request
 * @returns {Promise<T>}
 */
export async function apiRequest<T>(
  path: string,
  method: string,
  params?: object,
  token?: string
): Promise<T> {
  return new Promise(
    (resolve: (data: T) => void, reject: (error: ApiRejectType) => void) => {
      let requestParams = {};
      if (params != null) {
        requestParams = { ...params };
      }
      if (token) {
        requestParams = { ...requestParams, token: token };
      }

      fetch(Urls.amicale.api + path, {
        method,
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(requestParams),
      })
        .then((response: Response) => {
          const status = response.status;
          if (status === REQUEST_STATUS.SUCCESS) {
            return response.json().then(
              (data): ApiResponseType<T> => {
                return { status: status, error: data.error, data: data.data };
              }
            );
          } else {
            return { status: status };
          }
        })
        .then((response: ApiResponseType<T>) => {
          if (isApiResponseValid(response) && response.data) {
            if (response.error === API_REQUEST_CODES.SUCCESS) {
              resolve(response.data);
            } else {
              reject({
                status: REQUEST_STATUS.SUCCESS,
                code: response.error,
              });
            }
          } else {
            reject({
              status: response.status,
            });
          }
        })
        .catch(() => {
          reject({
            status: REQUEST_STATUS.CONNECTION_ERROR,
          });
        });
    }
  );
}

export async function connectToAmicale(email: string, password: string) {
  return new Promise(
    (
      resolve: (token: string) => void,
      reject: (error: ApiRejectType) => void
    ) => {
      const data = {
        email,
        password,
      };
      apiRequest<ApiDataLoginType>('password', 'POST', data)
        .then((response: ApiDataLoginType) => {
          if (response.token != null) {
            resolve(response.token);
          } else {
            reject({
              status: REQUEST_STATUS.SERVER_ERROR,
            });
          }
        })
        .catch((err) => {
          reject(err);
        });
    }
  );
}

/**
 * Reads data from the given url and returns it.
 *
 * Only use this function for non API calls.
 * For Amicale API calls, please use the apiRequest function.
 *
 * If no data was found, returns an empty object
 *
 * @param url The urls to fetch data from
 * @return Promise<any>
 */
export async function readData<T>(url: string): Promise<T> {
  return new Promise((resolve: (response: T) => void, reject: () => void) => {
    fetch(url)
      .then(async (response: Response): Promise<any> => response.json())
      .then((data: T) => resolve(data))
      .catch(() => reject());
  });
}
