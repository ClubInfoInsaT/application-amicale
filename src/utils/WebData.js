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

export async function apiRequest(path: string, method: string, params: ?Object) {
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
 * Read data from FETCH_URL and return it.
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
