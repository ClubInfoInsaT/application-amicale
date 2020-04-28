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

    listeners: Array<Function>;

    constructor() {
        this.#token = null;
        this.listeners = [];
    }

    /**
     * Get this class instance or create one if none is found
     * @returns {ConnectionManager}
     */
    static getInstance(): ConnectionManager {
        return ConnectionManager.instance === null ?
            ConnectionManager.instance = new ConnectionManager() :
            ConnectionManager.instance;
    }

    getToken() {
        return this.#token;
    }

    onLoginStateChange(newState: boolean) {
        for (let i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i] !== undefined)
                this.listeners[i](newState);
        }
    }

    addLoginStateListener(listener: Function) {
        this.listeners.push(listener);
    }

    async recoverLogin() {
        return new Promise((resolve, reject) => {
            if (this.getToken() !== null)
                resolve(this.getToken());
            else {
                Keychain.getInternetCredentials(SERVER_NAME)
                    .then((data) => {
                        if (data) {
                            this.#token = data.password;
                            this.onLoginStateChange(true);
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

    isLoggedIn() {
        return this.getToken() !== null;
    }

    async saveLogin(email: string, token: string) {
        return new Promise((resolve, reject) => {
            Keychain.setInternetCredentials(SERVER_NAME, 'token', token)
                .then(() => {
                    this.#token = token;
                    this.#email = email;
                    this.onLoginStateChange(true);
                    resolve(true);
                })
                .catch(() => {
                    reject(false);
                });
        });
    }

    async disconnect() {
        return new Promise((resolve, reject) => {
            Keychain.resetInternetCredentials(SERVER_NAME)
                .then(() => {
                    this.#token = null;
                    this.onLoginStateChange(false);
                    resolve(true);
                })
                .catch(() => {
                    reject(false);
                });
        });
    }

    async connect(email: string, password: string) {
        return new Promise((resolve, reject) => {
            const data = {
                email: email,
                password: password,
            };
            apiRequest(AUTH_PATH, 'POST', data)
                .then((response) => {
                    this.saveLogin(email, response.token)
                        .then(() => {
                            resolve(true);
                        })
                        .catch(() => {
                            reject(ERROR_TYPE.UNKNOWN);
                        });
                })
                .catch((error) => reject(error));
        });
    }

    isConnectionResponseValid(response: Object) {
        let valid = isResponseValid(response);

        if (valid && response.error === ERROR_TYPE.SUCCESS)
            valid = valid
                && response.data.token !== undefined
                && response.data.token !== ''
                && typeof response.data.token === "string";
        return valid;
    }

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
                reject(ERROR_TYPE.UNKNOWN);
        });
    }
}
