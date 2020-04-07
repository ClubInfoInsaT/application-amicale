// @flow

import * as SecureStore from 'expo-secure-store';

export const ERROR_TYPE = {
    SUCCESS: 0,
    BAD_CREDENTIALS: 1,
    BAD_TOKEN: 2,
    NO_CONSENT: 3,
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

const API_ENDPOINT = "https://www.amicale-insat.fr/api/";
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
                SecureStore.getItemAsync('token')
                    .then((token) => {
                        this.#token = token;
                        if (token !== null) {
                            this.onLoginStateChange(true);
                            resolve(token);
                        } else
                            reject(false);
                    })
                    .catch(error => {
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
            SecureStore.setItemAsync('token', token)
                .then(() => {
                    this.#token = token;
                    this.#email = email;
                    this.onLoginStateChange(true);
                    resolve(true);
                })
                .catch(error => {
                    reject(false);
                });
        });
    }

    async disconnect() {
        return new Promise((resolve, reject) => {
            SecureStore.deleteItemAsync('token')
                .then(() => {
                    this.#token = null;
                    this.onLoginStateChange(false);
                    resolve(true);
                })
                .catch((error) => {
                    reject(false);
                });
        });
    }

    async connect(email: string, password: string) {
        let data = {
            email: email,
            password: password,
        };
        return new Promise((resolve, reject) => {
            fetch(API_ENDPOINT + AUTH_PATH, {
                method: 'POST',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify(data)
            }).then(async (response) => response.json())
                .then((response: response_format) => {
                    if (this.isConnectionResponseValid(response)) {
                        if (response.error === ERROR_TYPE.SUCCESS) {
                            this.saveLogin(email, response.data.token)
                                .then(() => {
                                    resolve(true);
                                })
                                .catch(() => {
                                    reject(ERROR_TYPE.UNKNOWN);
                                });
                        } else
                            reject(response.error);
                    } else
                        reject(ERROR_TYPE.CONNECTION_ERROR);
                })
                .catch((error) => {
                    reject(ERROR_TYPE.CONNECTION_ERROR);
                });
        });
    }

    isResponseValid(response: response_format) {
        let valid = response !== undefined
            && response.error !== undefined
            && typeof response.error === "number";

        valid = valid
            && response.data !== undefined
            && typeof response.data === "object";
        return valid;
    }

    isConnectionResponseValid(response: response_format) {
        let valid = this.isResponseValid(response);

        if (valid && response.error === ERROR_TYPE.SUCCESS)
            valid = valid
                && response.data.token !== undefined
                && response.data.token !== ''
                && typeof response.data.token === "string";
        return valid;
    }

    generatePostArguments(keys: Array<string>, values: Array<string>) {
        let data = {};
        for (let i = 0; i < keys.length; i++) {
            data[keys[i]] = values[i];
        }
        return data;
    }

    async authenticatedRequest(path: string, keys: Array<string>|null, values: Array<any>|null) {
        return new Promise((resolve, reject) => {
            if (this.getToken() !== null) {
                let data = {};
                if (keys !== null && values !== null && keys.length === values.length)
                    data = this.generatePostArguments(keys, values);
                console.log(data);
                fetch(API_ENDPOINT + path, {
                    method: 'POST',
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }),
                    body: JSON.stringify({
                        token: this.getToken(),
                        ...data
                    })
                }).then(async (response) => response.json())
                    .then((response: response_format) => {
                        console.log(response);
                        if (this.isResponseValid(response)) {
                            if (response.error === ERROR_TYPE.SUCCESS)
                                resolve(response.data);
                            else
                                reject(response.error);
                        } else
                            reject(ERROR_TYPE.CONNECTION_ERROR);
                    })
                    .catch(() => {
                        reject(ERROR_TYPE.CONNECTION_ERROR);
                    });
            } else
                reject(ERROR_TYPE.UNKNOWN);
        });
    }
}
