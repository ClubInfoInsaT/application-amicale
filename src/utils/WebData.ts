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
import { API_RESPONSE_CODE, RESPONSE_HTTP_STATUS } from './Requests';
import packageJson from '../../package.json';

export type ApiDataLoginType = {
  token: string;
};

type ApiResponse<T> = {
  status: RESPONSE_HTTP_STATUS;
  code: API_RESPONSE_CODE;
  message?: string;
  data: T;
};

// Custom error class for API errors
// Thrown whenever an API request fails, server-side or client-side (e.g. network error)
export class ApiError extends Error {
  code: API_RESPONSE_CODE;
  status: RESPONSE_HTTP_STATUS;
  message: string;

  constructor(
    code?: API_RESPONSE_CODE,
    status?: RESPONSE_HTTP_STATUS,
    message?: string
  ) {
    super(message);
    this.code = code || API_RESPONSE_CODE.UNKNOWN;
    this.status = status || RESPONSE_HTTP_STATUS.UNKNOWN;
    this.message = message || 'An undetermined error occurred';
  }
}

/**
 * Sends a request to the Amicale Website backend
 *
 * In case of failure, the promise will be rejected with the error code, status and message.
 * In case of success, the promise will return the data object.
 *
 * @param path The API path from the API endpoint
 * @param method The HTTP method to use (GET or POST)
 * @param body OPTIONAL: The body to send with the request
 * @param token OPTIONAL: The token to use for authentication
 * @throws ApiError
 * @returns {Promise<T>}
 */
export async function apiRequest<T>(
  path: string,
  method: string,
  body?: object,
  token?: string
): Promise<T> {
  return new Promise(
    (resolve: (data: T) => void, reject: (error: ApiError) => void) => {
      const userAgent = 'campus/' + packageJson.version;
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('User-Agent', userAgent);
      if (token) {
        headers.append('Authorization', 'Bearer ' + token);
      }

      fetch(Urls.amicale.api + path, {
        method,
        headers: headers,
        body: body ? JSON.stringify(body) : undefined,
      })
        .then(async (response: Response) => await parseJson<T>(response))
        .then((response: ApiResponse<T>) => validateResponse<T>(response))
        .then((response: ApiResponse<T>) => resolve(response.data))
        .catch((error: Error) => {
          console.log('webdata', error);
          if (error instanceof ApiError) {
            return reject(error);
          } else if (error.message && error.message.includes('Network')) {
            return reject(
              new ApiError(
                API_RESPONSE_CODE.CONNECTION_ERROR,
                RESPONSE_HTTP_STATUS.CONNECTION_ERROR,
                'Connection error, please check your network. ' + error.message
              )
            );
          } else {
            console.log('webdata', error);
            return reject(
              new ApiError(
                API_RESPONSE_CODE.UNKNOWN,
                RESPONSE_HTTP_STATUS.UNKNOWN,
                'Unknown error, please contact support.' + error.message
              )
            );
          }
        });
    }
  );
}

async function parseJson<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    const parsedData = await response.json();
    console.log('Parsed server JSON', parsedData);
    return {
      status: response.status,
      code: parsedData.status,
      data: parsedData.data,
      message: parsedData.message,
    };
  } catch {
    console.log('Failed to parse server JSON', response);
    throw new ApiError(
      API_RESPONSE_CODE.SERVER_ERROR,
      RESPONSE_HTTP_STATUS.SERVER_ERROR,
      'Failed to parse server JSON'
    );
  }
}

/**
 * Checks if the given API response is valid.
 *
 * For a request to be valid, it must match the response_format as defined in this file.
 *
 * @param response
 * @returns {boolean}
 */
export function isApiResponseValid<T>(response: ApiResponse<T>): boolean {
  return (
    response != null &&
    response.code != null &&
    response.code !== undefined &&
    Object.values(API_RESPONSE_CODE).includes(response.code) &&
    Object.values(RESPONSE_HTTP_STATUS).includes(response.status) &&
    (response.status != RESPONSE_HTTP_STATUS.SUCCESS ||
      (response.data != null && typeof response.data === 'object')) // Errors don't return data
  );
}

function validateResponse<T>(response: ApiResponse<T>): ApiResponse<T> {
  if (!isApiResponseValid(response)) {
    console.log('Invalid server response', response);
    throw new ApiError(
      API_RESPONSE_CODE.SERVER_ERROR,
      RESPONSE_HTTP_STATUS.SERVER_ERROR,
      'Invalid server response, please contact support'
    );
  } else if (
    response.status !== RESPONSE_HTTP_STATUS.SUCCESS ||
    response.code !== API_RESPONSE_CODE.SUCCESS
  ) {
    console.log('API error', response.code, response.status, response.message);
    throw new ApiError(response.code, response.status, response.message);
  }
  return response;
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
      apiRequest<ApiDataLoginType>('auth/login', 'POST', data)
        .then((response: ApiDataLoginType) => {
          if (response.token != null) {
            resolve(response.token);
          } else {
            reject({
              status: RESPONSE_HTTP_STATUS.SERVER_ERROR,
              code: API_RESPONSE_CODE.SERVER_ERROR,
              message: 'Unknown server error on login',
            });
          }
        })
        .catch(reject);
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
 * @param httpOptions Fetch options, see fetch docs on MDN
 * @return Promise<any>
 */
export async function readData<T>(
  url: string,
  httpOptions?: object
): Promise<T> {
  return new Promise((resolve: (response: T) => void, reject: () => void) => {
    fetch(url, httpOptions)
      .then(async (response: Response): Promise<any> => response.json())
      .then(resolve)
      .catch(reject);
  });
}
