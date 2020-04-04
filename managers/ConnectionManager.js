// @flow

import * as SecureStore from 'expo-secure-store';

export const ERROR_TYPE = {
    BAD_CREDENTIALS: 0,
    CONNECTION_ERROR: 1,
    SAVE_TOKEN: 2,
    NO_TOKEN: 3,
    NO_CONSENT: 4,
};

const AUTH_URL = "https://www.amicale-insat.fr/api/password";

export default class ConnectionManager {
    static instance: ConnectionManager | null = null;

    #email: string;
    #token: string | null;

    loginCallback: Function;

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
            if (this.#token !== null)
                resolve(this.#token);
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
        return this.#token !== null;
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
            fetch(AUTH_URL, {
                method: 'POST',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify(data)
            }).then(async (response) => response.json())
                .then((data) => {
                    if (this.isConnectionResponseValid(data)) {
                        if (data.state) {
                            this.saveLogin(email, data.token)
                                .then(() => {
                                    resolve(true);
                                })
                                .catch(() => {
                                    reject(ERROR_TYPE.SAVE_TOKEN);
                                });
                        } else if (data.data.consent !== undefined && !data.data.consent)
                            reject(ERROR_TYPE.NO_CONSENT);
                        else
                            reject(ERROR_TYPE.BAD_CREDENTIALS);
                    } else
                        reject(ERROR_TYPE.CONNECTION_ERROR);
                })
                .catch((error) => {
                    reject(ERROR_TYPE.CONNECTION_ERROR);
                });
        });
    }

    isRequestResponseValid(response: Object) {
        let valid = response !== undefined
            && response.state !== undefined
            && typeof response.state === "boolean";

        if (valid && response.state)
            valid = valid
                && response.data !== undefined
                && typeof response.data === "object";
        return valid;
    }

    isConnectionResponseValid(response: Object) {
        let valid = response !== undefined
            && response.state !== undefined
            && typeof response.state === "boolean";

        if (valid && response.state)
            valid = valid
                && response.token !== undefined
                && response.token !== ''
                && typeof response.token === "string";
        return valid;
    }

    async authenticatedRequest(url: string) {
        return new Promise((resolve, reject) => {
            if (this.#token !== null) {
                fetch(url, {
                    method: 'POST',
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }),
                    body: JSON.stringify({token: this.#token})
                }).then(async (response) => response.json())
                    .then((data) => {
                        if (this.isRequestResponseValid(data)) {
                            if (data.state)
                                resolve(data.data);
                            else
                                reject(ERROR_TYPE.BAD_CREDENTIALS);
                        } else
                            reject(ERROR_TYPE.CONNECTION_ERROR);
                    })
                    .catch(() => {
                        reject(ERROR_TYPE.CONNECTION_ERROR);
                    });
            } else
                reject(ERROR_TYPE.NO_TOKEN);
        });
    }
}
