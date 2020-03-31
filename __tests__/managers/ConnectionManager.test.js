import React from 'react';
import ConnectionManager, {ERROR_TYPE} from "../../managers/ConnectionManager";
import * as SecureStore from 'expo-secure-store';

let fetch = require('isomorphic-fetch'); // fetch is not implemented in nodeJS but in react-native

const c = ConnectionManager.getInstance();

afterEach(() => {
    jest.restoreAllMocks();
});

test('recoverLogin error crypto', () => {
    jest.spyOn(SecureStore, 'getItemAsync').mockImplementationOnce(() => {
        return Promise.reject();
    });
    return expect(c.recoverLogin()).rejects.toBe(false);
});

test('recoverLogin success crypto', () => {
    jest.spyOn(SecureStore, 'getItemAsync').mockImplementationOnce(() => {
        return Promise.resolve('token1');
    });
    return expect(c.recoverLogin()).resolves.toBe('token1');
});

test('saveLogin success', () => {
    jest.spyOn(SecureStore, 'setItemAsync').mockImplementationOnce(() => {
        return Promise.resolve();
    });
    return expect(c.saveLogin('email', 'token2')).resolves.toBeTruthy();
});

test('saveLogin error', () => {
    jest.spyOn(SecureStore, 'setItemAsync').mockImplementationOnce(() => {
        return Promise.reject();
    });
    return expect(c.saveLogin('email', 'token3')).rejects.toBeFalsy();
});

test('recoverLogin error crypto with saved token', () => {
    jest.spyOn(SecureStore, 'getItemAsync').mockImplementationOnce(() => {
        return Promise.reject();
    });
    return expect(c.recoverLogin()).resolves.toBe('token2');
});

test('recoverLogin success saved', () => {
    return expect(c.recoverLogin()).resolves.toBe('token2');
});

test('isRequestResponseValid', () => {
    let json = {
        state: true,
        data: {}
    };
    expect(c.isRequestResponseValid(json)).toBeTrue();
    json = {
        state: false,
        data: {}
    };
    expect(c.isRequestResponseValid(json)).toBeTrue();
    json = {
        state: false,
        message: 'coucou',
        data: {truc: 'machin'}
    };
    expect(c.isRequestResponseValid(json)).toBeTrue();
    json = {
        message: 'coucou'
    };
    expect(c.isRequestResponseValid(json)).toBeFalse();
    json = {
        state: 'coucou'
    };
    expect(c.isRequestResponseValid(json)).toBeFalse();
    json = {
        state: true,
    };
    expect(c.isRequestResponseValid(json)).toBeFalse();
});

test("isConnectionResponseValid", () => {
    let json = {
        state: true,
        message: 'Connexion confirmée',
        token: 'token'
    };
    expect(c.isConnectionResponseValid(json)).toBeTrue();
    json = {
        state: true,
        token: 'token'
    };
    expect(c.isConnectionResponseValid(json)).toBeTrue();
    json = {
        state: false,
    };
    expect(c.isConnectionResponseValid(json)).toBeTrue();

    json = {
        state: true,
        message: 'Connexion confirmée',
        token: ''
    };
    expect(c.isConnectionResponseValid(json)).toBeFalse();
    json = {
        state: true,
        message: 'Connexion confirmée',
    };
    expect(c.isConnectionResponseValid(json)).toBeFalse();
    json = {
        state: 'coucou',
        message: 'Connexion confirmée',
        token: 'token'
    };
    expect(c.isConnectionResponseValid(json)).toBeFalse();
    json = {
        state: true,
        message: 'Connexion confirmée',
        token: 2
    };
    expect(c.isConnectionResponseValid(json)).toBeFalse();
    json = {
        coucou: 'coucou',
        message: 'Connexion confirmée',
        token: 'token'
    };
    expect(c.isConnectionResponseValid(json)).toBeFalse();
});


test("connect bad credentials", () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        return Promise.resolve({
            json: () => {
                return {
                    state: false,
                    message: 'Adresse mail ou mot de passe incorrect',
                    token: ''
                }
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
                    state: true,
                    message: 'Connexion confirmée',
                    token: 'token'
                }
            },
        })
    });
    c.saveLogin = jest.fn(() => {
        return Promise.resolve(true);
    });
    return expect(c.connect('email', 'password')).resolves.toBeTruthy();
});

test("connect good credentials, fail save token", () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        return Promise.resolve({
            json: () => {
                return {
                    state: true,
                    message: 'Connexion confirmée',
                    token: 'token'
                }
            },
        })
    });
    c.saveLogin = jest.fn(() => {
        return Promise.reject(false);
    });
    return expect(c.connect('email', 'password')).rejects.toBe(ERROR_TYPE.SAVE_TOKEN);
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
    c.recoverLogin = jest.fn(() => {
        return Promise.resolve('token');
    });
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        return Promise.resolve({
            json: () => {
                return {state: true, message: 'Connexion vérifiée', data: {coucou: 'toi'}}
            },
        })
    });
    return expect(c.authenticatedRequest('https://www.amicale-insat.fr/api/token/check'))
        .resolves.toStrictEqual({coucou: 'toi'});
});

test("authenticatedRequest error wrong token", () => {
    c.recoverLogin = jest.fn(() => {
        return Promise.resolve('token');
    });
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        return Promise.resolve({
            json: () => {
                return {state: false, message: 'Le champ token sélectionné est invalide.'}
            },
        })
    });
    return expect(c.authenticatedRequest('https://www.amicale-insat.fr/api/token/check'))
        .rejects.toBe(ERROR_TYPE.BAD_CREDENTIALS);
});

test("authenticatedRequest error bogus response", () => {
    c.recoverLogin = jest.fn(() => {
        return Promise.resolve('token');
    });
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        return Promise.resolve({
            json: () => {
                return {state: true, message: 'Connexion vérifiée'}
            },
        })
    });
    return expect(c.authenticatedRequest('https://www.amicale-insat.fr/api/token/check'))
        .rejects.toBe(ERROR_TYPE.CONNECTION_ERROR);
});

test("authenticatedRequest connection error", () => {
    c.recoverLogin = jest.fn(() => {
        return Promise.resolve('token');
    });
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        return Promise.reject()
    });
    return expect(c.authenticatedRequest('https://www.amicale-insat.fr/api/token/check'))
        .rejects.toBe(ERROR_TYPE.CONNECTION_ERROR);
});

test("authenticatedRequest error no token", () => {
    c.recoverLogin = jest.fn(() => {
        return Promise.reject(false);
    });
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
        return Promise.resolve({
            json: () => {
                return {state: false, message: 'Le champ token sélectionné est invalide.'}
            },
        })
    });
    return expect(c.authenticatedRequest('https://www.amicale-insat.fr/api/token/check'))
        .rejects.toBe(ERROR_TYPE.NO_TOKEN);
});
