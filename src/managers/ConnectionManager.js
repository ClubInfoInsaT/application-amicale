// @flow

import * as Keychain from 'react-native-keychain';
import {apiRequest, ERROR_TYPE, isResponseValid} from "../utils/WebData";

/**
 * champ: error
 *
 * 0 : SUCCESS -> pas d'erreurs
 * 1 : BAD_CREDENTIALS -> email ou mdp invalide
 * 2 : BAD_TOKEN -> session expirée
 * 3 : NO_CONSENT
 * 403 : FORBIDDEN -> accès a la ressource interdit
 * 500 : SERVER_ERROR -> pb coté serveur
 */

const SERVER_NAME = "amicale-insat.fr";
const AUTH_PATH = "password";

export default class ConnectionManager {
    static instance: ConnectionManager | null = null;

    #email: string;
    #token: string | null;

    constructor() {
        this.#token = null;
    }

    /**
     * Gets this class instance or create one if none is found
     *
     * @returns {ConnectionManager}
     */
    static getInstance(): ConnectionManager {
        return ConnectionManager.instance === null ?
            ConnectionManager.instance = new ConnectionManager() :
            ConnectionManager.instance;
    }

    /**
     * Gets the current token
     *
     * @returns {string | null}
     */
    getToken(): string | null {
        return this.#token;
    }

    /**
     * Tries to recover login token from the secure keychain
     *
     * @returns {Promise<R>}
     */
    async recoverLogin() {
        return new Promise((resolve, reject) => {
            if (this.getToken() !== null)
                resolve(this.getToken());
            else {
                Keychain.getInternetCredentials(SERVER_NAME)
                    .then((data) => {
                        if (data) {
                            this.#token = data.password;
                            resolve(this.#token);
                        } else
                            reject(false);
                    })
                    .catch(() => {
                        reject(false);
                    });
            }
        });
    }

    /**
     * Check if the user has a valid token
     *
     * @returns {boolean}
     */
    isLoggedIn() {
        return this.getToken() !== null;
    }

    /**
     * Saves the login token in the secure keychain
     *
     * @param email
     * @param token
     * @returns {Promise<R>}
     */
    async saveLogin(email: string, token: string) {
        return new Promise((resolve, reject) => {
            Keychain.setInternetCredentials(SERVER_NAME, 'token', token)
                .then(() => {
                    this.#token = token;
                    this.#email = email;
                    resolve(true);
                })
                .catch(() => {
                    reject(false);
                });
        });
    }

    /**
     * Deletes the login token from the keychain
     *
     * @returns {Promise<R>}
     */
    async disconnect() {
        return new Promise((resolve, reject) => {
            Keychain.resetInternetCredentials(SERVER_NAME)
                .then(() => {
                    this.#token = null;
                    resolve(true);
                })
                .catch(() => {
                    reject(false);
                });
        });
    }


    /**
     * Sends the given login and password to the api.
     * If the combination is valid, the login token is received and saved in the secure keychain.
     * If not, the promise is rejected with the corresponding error code.
     *
     * @param email
     * @param password
     * @returns {Promise<R>}
     */
    async connect(email: string, password: string) {
        return new Promise((resolve, reject) => {
            const data = {
                email: email,
                password: password,
            };
            apiRequest(AUTH_PATH, 'POST', data)
                .then((response) => {
                    if (this.isConnectionResponseValid(response)) {
                        this.saveLogin(email, response.token)
                            .then(() => {
                                resolve(true);
                            })
                            .catch(() => {
                                reject(ERROR_TYPE.TOKEN_SAVE);
                            });
                    } else
                        reject(ERROR_TYPE.SERVER_ERROR);
                })
                .catch((error) => reject(error));
        });
    }

    /**
     * Checks if the API connection response is correctly formatted
     *
     * @param response
     * @returns {boolean}
     */
    isConnectionResponseValid(response: { [key: string]: any }) {
        let valid = isResponseValid(response);

        if (valid && response.error === ERROR_TYPE.SUCCESS)
            valid = valid
                && response.data.token !== undefined
                && response.data.token !== ''
                && typeof response.data.token === "string";
        return valid;
    }

    /**
     * Sends an authenticated request with the login token to the API
     *
     * @param path
     * @param params
     * @returns {Promise<R>}
     */
    async authenticatedRequest(path: string, params: Object) {
        return new Promise((resolve, reject) => {
            if (this.getToken() !== null) {
                let data = {
                    token: this.getToken(),
                    ...params
                };
                apiRequest(path, 'POST', data)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
            } else
                reject(ERROR_TYPE.TOKEN_RETRIEVE);
        });
    }
}
