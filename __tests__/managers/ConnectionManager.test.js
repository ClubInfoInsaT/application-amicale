jest.mock('react-native-keychain');

import React from 'react';
import ConnectionManager from "../../src/managers/ConnectionManager";
import {ERROR_TYPE} from "../../src/utils/WebData";

let fetch = require('isomorphic-fetch'); // fetch is not implemented in nodeJS but in react-native

const c = ConnectionManager.getInstance();

afterEach(() => {
    jest.restoreAllMocks();
});

test('isLoggedIn yes', () => {
    jest.spyOn(ConnectionManager.prototype, 'getToken').mockImplementationOnce(() => {
        return 'token';
    });
    return expect(c.isLoggedIn()).toBe(true);
});

test('isLoggedIn no', () => {
    jest.spyOn(ConnectionManager.prototype, 'getToken').mockImplementationOnce(() => {
        return null;
    });
    return expect(c.isLoggedIn()).toBe(false);
});

test("isConnectionResponseValid", () => {
    let json = {
        error: 0,
        data: {token: 'token'}
    };
    expect(c.isConnectionResponseValid(json)).toBeTrue();
    json = {
        error: 2,
        data: {}
    };
    expect(c.isConnectionResponseValid(json)).toBeTrue();
    json = {
        error: 0,
        data: {token: ''}
    };
    expect(c.isConnectionResponseValid(json)).toBeFalse();
    json = {
        error: 'prout',
        data: {token: ''}
    };
    expect(c.isConnectionResponseValid(json)).toBeFalse();
});

test("connect bad credentials", () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        return Promise.resolve({
            json: () => {
                return {
                    error: ERROR_TYPE.BAD_CREDENTIALS,
                    data: {}
                };
            },
        })
    });
    return expect(c.connect('email', 'password'))
        .rejects.toBe(ERROR_TYPE.BAD_CREDENTIALS);
});

test("connect good credentials", () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        return Promise.resolve({
            json: () => {
                return {
                    error: ERROR_TYPE.SUCCESS,
                    data: {token: 'token'}
                };
            },
        })
    });
    jest.spyOn(ConnectionManager.prototype, 'saveLogin').mockImplementationOnce(() => {
        return Promise.resolve(true);
    });
    return expect(c.connect('email', 'password')).resolves.toBeTruthy();
});

test("connect good credentials no consent", () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        return Promise.resolve({
            json: () => {
                return {
                    error: ERROR_TYPE.NO_CONSENT,
                    data: {}
                };
            },
        })
    });
    return expect(c.connect('email', 'password'))
        .rejects.toBe(ERROR_TYPE.NO_CONSENT);
});

test("connect good credentials, fail save token", () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        return Promise.resolve({
            json: () => {
                return {
                    error: ERROR_TYPE.SUCCESS,
                    data: {token: 'token'}
                };
            },
        })
    });
    jest.spyOn(ConnectionManager.prototype, 'saveLogin').mockImplementationOnce(() => {
        return Promise.reject(false);
    });
    return expect(c.connect('email', 'password')).rejects.toBe(ERROR_TYPE.UNKNOWN);
});

test("connect connection error", () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        return Promise.reject();
    });
    return expect(c.connect('email', 'password'))
        .rejects.toBe(ERROR_TYPE.CONNECTION_ERROR);
});

test("connect bogus response 1", () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        return Promise.resolve({
            json: () => {
                return {
                    thing: true,
                    wrong: '',
                }
            },
        })
    });
    return expect(c.connect('email', 'password'))
        .rejects.toBe(ERROR_TYPE.CONNECTION_ERROR);
});


test("authenticatedRequest success", () => {
    jest.spyOn(ConnectionManager.prototype, 'getToken').mockImplementationOnce(() => {
        return 'token';
    });
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        return Promise.resolve({
            json: () => {
                return {
                    error: ERROR_TYPE.SUCCESS,
                    data: {coucou: 'toi'}
                };
            },
        })
    });
    return expect(c.authenticatedRequest('https://www.amicale-insat.fr/api/token/check'))
        .resolves.toStrictEqual({coucou: 'toi'});
});

test("authenticatedRequest error wrong token", () => {
    jest.spyOn(ConnectionManager.prototype, 'getToken').mockImplementationOnce(() => {
        return 'token';
    });
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        return Promise.resolve({
            json: () => {
                return {
                    error: ERROR_TYPE.BAD_TOKEN,
                    data: {}
                };
            },
        })
    });
    return expect(c.authenticatedRequest('https://www.amicale-insat.fr/api/token/check'))
        .rejects.toBe(ERROR_TYPE.BAD_TOKEN);
});

test("authenticatedRequest error bogus response", () => {
    jest.spyOn(ConnectionManager.prototype, 'getToken').mockImplementationOnce(() => {
        return 'token';
    });
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        return Promise.resolve({
            json: () => {
                return {
                    error: ERROR_TYPE.SUCCESS,
                };
            },
        })
    });
    return expect(c.authenticatedRequest('https://www.amicale-insat.fr/api/token/check'))
        .rejects.toBe(ERROR_TYPE.CONNECTION_ERROR);
});

test("authenticatedRequest connection error", () => {
    jest.spyOn(ConnectionManager.prototype, 'getToken').mockImplementationOnce(() => {
        return 'token';
    });
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        return Promise.reject()
    });
    return expect(c.authenticatedRequest('https://www.amicale-insat.fr/api/token/check'))
        .rejects.toBe(ERROR_TYPE.CONNECTION_ERROR);
});

test("authenticatedRequest error no token", () => {
    jest.spyOn(ConnectionManager.prototype, 'getToken').mockImplementationOnce(() => {
        return null;
    });
    return expect(c.authenticatedRequest('https://www.amicale-insat.fr/api/token/check'))
        .rejects.toBe(ERROR_TYPE.UNKNOWN);
});
