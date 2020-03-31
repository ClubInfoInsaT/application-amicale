// @flow

import * as SecureStore from 'expo-secure-store';

export const ERROR_TYPE = {
    BAD_CREDENTIALS: 0,
    CONNECTION_ERROR: 1,
    SAVE_TOKEN: 2,
    NO_TOKEN: 3,
};

const AUTH_URL = "https://www.amicale-insat.fr/api/password";

export default class ConnectionManager {
    static instance: ConnectionManager | null = null;

    #email: string;
    #token: string;

    /**
     * Get this class instance or create one if none is found
     * @returns {ConnectionManager}
     */
    static getInstance(): ConnectionManager {
        return ConnectionManager.instance === null ?
            ConnectionManager.instance = new ConnectionManager() :
            ConnectionManager.instance;
    }

    async recoverLogin() {
        return new Promise((resolve, reject) => {
            console.log(this.#token);
            if (this.#token !== undefined)
                resolve(this.#token);
            else {
                SecureStore.getItemAsync('token')
                    .then((token) => {
                        console.log(token);
                        resolve(token);
                    })
                    .catch(error => {
                        reject(false);
                    });
            }
        });
    }

    async saveLogin(email: string, token: string) {
        console.log(token);
        return new Promise((resolve, reject) => {
            SecureStore.setItemAsync('token', token)
                .then(() => {
                    this.#token = token;
                    this.#email = email;
                    resolve(true);
                })
                .catch(error => {
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
                        } else
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
            this.recoverLogin()
                .then(token => {
                    fetch(url, {
                        method: 'POST',
                        headers: new Headers({
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }),
                        body: JSON.stringify({token: token})
                    }).then(async (response) => response.json())
                        .then((data) => {
                            console.log(data);
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
                })
                .catch(() => {
                    reject(ERROR_TYPE.NO_TOKEN);
                });
        });
    }
}
