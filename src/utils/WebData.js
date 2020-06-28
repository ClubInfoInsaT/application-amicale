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

type response_format = {
    error: number,
    data: Object,
}

const API_ENDPOINT = "https://www.amicale-insat.fr/api/";

/**
 * Sends a request to the Amicale Website backend
 *
 * In case of failure, the promise will be rejected with the error code.
 * In case of success, the promise will return the data object.
 *
 * @param path The API path from the API endpoint
 * @param method The HTTP method to use (GET or POST)
 * @param params The params to use for this request
 * @returns {Promise<R>}
 */
export async function apiRequest(path: string, method: string, params: ?{ [key: string]: string }) {
    if (params === undefined || params === null)
        params = {};

    return new Promise((resolve, reject) => {
        fetch(API_ENDPOINT + path, {
            method: method,
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
                ...params
            })
        }).then(async (response) => response.json())
            .then((response: response_format) => {
                if (isResponseValid(response)) {
                    if (response.error === ERROR_TYPE.SUCCESS)
                        resolve(response.data);
                    else
                        reject(response.error);
                } else
                    reject(ERROR_TYPE.SERVER_ERROR);
            })
            .catch(() => {
                reject(ERROR_TYPE.CONNECTION_ERROR);
            });
    });
}

/**
 * Checks if the given API response is valid.
 *
 * For a request to be valid, it must match the response_format as defined in this file.
 *
 * @param response
 * @returns {boolean}
 */
export function isResponseValid(response: response_format) {
    let valid = response !== undefined
        && response.error !== undefined
        && typeof response.error === "number";

    valid = valid
        && response.data !== undefined
        && typeof response.data === "object";
    return valid;
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
 * @return {Promise<Object>}
 */
export async function readData(url: string) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(async (response) => response.json())
            .then((data) => {
                resolve(data);
            })
            .catch(() => {
                reject();
            });
    });
}
