import React from 'react';
import {isResponseValid} from "../../src/utils/WebData";

let fetch = require('isomorphic-fetch'); // fetch is not implemented in nodeJS but in react-native

test('isRequestResponseValid', () => {
    let json = {
        error: 0,
        data: {}
    };
    expect(isResponseValid(json)).toBeTrue();
    json = {
        error: 1,
        data: {}
    };
    expect(isResponseValid(json)).toBeTrue();
    json = {
        error: 50,
        data: {}
    };
    expect(isResponseValid(json)).toBeTrue();
    json = {
        error: 50,
        data: {truc: 'machin'}
    };
    expect(isResponseValid(json)).toBeTrue();
    json = {
        message: 'coucou'
    };
    expect(isResponseValid(json)).toBeFalse();
    json = {
        error: 'coucou',
        data: {truc: 'machin'}
    };
    expect(isResponseValid(json)).toBeFalse();
    json = {
        error: 0,
        data: 'coucou'
    };
    expect(isResponseValid(json)).toBeFalse();
    json = {
        error: 0,
    };
    expect(isResponseValid(json)).toBeFalse();
});
