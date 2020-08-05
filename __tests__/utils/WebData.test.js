/* eslint-disable */

import React from 'react';
import {isApiResponseValid} from '../../src/utils/WebData';

const fetch = require('isomorphic-fetch'); // fetch is not implemented in nodeJS but in react-native

test('isRequestResponseValid', () => {
  let json = {
    error: 0,
    data: {},
  };
  expect(isApiResponseValid(json)).toBeTrue();
  json = {
    error: 1,
    data: {},
  };
  expect(isApiResponseValid(json)).toBeTrue();
  json = {
    error: 50,
    data: {},
  };
  expect(isApiResponseValid(json)).toBeTrue();
  json = {
    error: 50,
    data: {truc: 'machin'},
  };
  expect(isApiResponseValid(json)).toBeTrue();
  json = {
    message: 'coucou',
  };
  expect(isApiResponseValid(json)).toBeFalse();
  json = {
    error: 'coucou',
    data: {truc: 'machin'},
  };
  expect(isApiResponseValid(json)).toBeFalse();
  json = {
    error: 0,
    data: 'coucou',
  };
  expect(isApiResponseValid(json)).toBeFalse();
  json = {
    error: 0,
  };
  expect(isApiResponseValid(json)).toBeFalse();
});
