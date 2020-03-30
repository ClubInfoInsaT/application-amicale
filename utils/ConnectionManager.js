// @flow

export const ERROR_TYPE = {
    BAD_CREDENTIALS: 0,
    CONNECTION_ERROR: 1
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
                    console.log(data);
                    if (this.isResponseValid(data))
                        resolve({success: data.success, token: data.token});
                    else
                        reject(ERROR_TYPE.BAD_CREDENTIALS);
                })
                .catch((error) => {
                    console.log(error);
                    reject(ERROR_TYPE.CONNECTION_ERROR);
                });
        });
    }

    isResponseValid(response: Object) {
        return response !== undefined
            && response.success !== undefined
            && response.success
            && response.token !== undefined;
    }

}
