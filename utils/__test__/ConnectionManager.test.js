import React from 'react';
import ConnectionManager, {ERROR_TYPE} from "../ConnectionManager";

const fetch = require('isomorphic-fetch'); // fetch is not implemented in nodeJS but in react-native
const c = ConnectionManager.getInstance();

test("connect bad credentials", () => {
    return expect(c.connect('truc', 'chose'))
        .rejects.toBe(ERROR_TYPE.BAD_CREDENTIALS);
});

test("connect good credentials", () => {
    return expect(c.connect('vergnet@etud.insa-toulouse.fr', 'Coucoù512'))
        .resolves.toBe('test');
});
