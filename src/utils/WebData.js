// @flow

export const ERROR_TYPE = {
  SUCCESS: 0,
  BAD_CREDENTIALS: 1,
  BAD_TOKEN: 2,
  NO_CONSENT: 3,
  TOKEN_SAVE: 4,
  TOKEN_RETRIEVE: 5,
  BAD_INPUT: 400,
  FORBIDDEN: 403,
  CONNECTION_ERROR: 404,
  SERVER_ERROR: 500,
  UNKNOWN: 999,
};

export type ApiDataLoginType = {
  token: string,
};

// eslint-disable-next-line flowtype/no-weak-types
export type ApiGenericDataType = {[key: string]: any};

type ApiResponseType = {
  error: number,
  data: ApiGenericDataType,
};

const API_ENDPOINT = 'https://www.amicale-insat.fr/api/';

/**
 * Checks if the given API response is valid.
 *
 * For a request to be valid, it must match the response_format as defined in this file.
 *
 * @param response
 * @returns {boolean}
 */
export function isApiResponseValid(response: ApiResponseType): boolean {
  return (
    response != null &&
    response.error != null &&
    typeof response.error === 'number' &&
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
 * @returns {Promise<ApiGenericDataType>}
 */
export async function apiRequest(
  path: string,
  method: string,
  params?: {...},
): Promise<ApiGenericDataType> {
  return new Promise(
    (
      resolve: (data: ApiGenericDataType) => void,
      reject: (error: number) => void,
    ) => {
      let requestParams = {};
      if (params != null) requestParams = {...params};
      fetch(API_ENDPOINT + path, {
        method,
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(requestParams),
      })
        .then(async (response: Response): Promise<ApiResponseType> =>
          response.json(),
        )
        .then((response: ApiResponseType) => {
          if (isApiResponseValid(response)) {
            if (response.error === ERROR_TYPE.SUCCESS) resolve(response.data);
            else reject(response.error);
          } else reject(ERROR_TYPE.SERVER_ERROR);
        })
        .catch((): void => reject(ERROR_TYPE.CONNECTION_ERROR));
    },
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
// eslint-disable-next-line flowtype/no-weak-types
export async function readData(url: string): Promise<any> {
  // eslint-disable-next-line flowtype/no-weak-types
  return new Promise((resolve: (response: any) => void, reject: () => void) => {
    fetch(url)
      // eslint-disable-next-line flowtype/no-weak-types
      .then(async (response: Response): Promise<any> => response.json())
      // eslint-disable-next-line flowtype/no-weak-types
      .then((data: any): void => resolve(data))
      .catch((): void => reject());
  });
}
