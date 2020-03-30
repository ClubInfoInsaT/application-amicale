// @flow

import * as SecureStore from 'expo-secure-store';

export const ERROR_TYPE = {
    BAD_CREDENTIALS: 0,
    CONNECTION_ERROR: 1,
    SAVE_TOKEN: 2,
};

const AUTH_URL = "https://www.amicale-insat.fr/api/password";

export default class ConnectionManager {
    static instance: ConnectionManager | null = null;

    #email: string;
    #token: string;

    constructor() {

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

    async saveLogin(email: string, token: string) {
        this.#token = token;
        this.#email = email;
        return new Promise((resolve, reject) => {
            SecureStore.setItemAsync('token', token)
                .then(() => {
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
                    if (this.isResponseValid(data)) {
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

    isResponseValid(response: Object) {
        let valid = response !== undefined && response.state !== undefined;
        if (valid && response.state)
            valid = valid && response.token !== undefined && response.token !== '';
        return valid;
    }

}
