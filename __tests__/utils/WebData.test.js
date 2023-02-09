import { isApiResponseValid } from '../../src/utils/WebData';

// eslint-disable-next-line no-unused-vars
const fetch = require('isomorphic-fetch'); // fetch is not implemented in nodeJS but in react-native

test('isRequestResponseValid', () => {
  let json = {
    code: 0,
    data: {},
  };
  expect(isApiResponseValid(json)).toBeTrue();
  json = {
    code: 1,
    data: {},
  };
  expect(isApiResponseValid(json)).toBeTrue();
  json = {
    code: 999,
    data: {},
  };
  expect(isApiResponseValid(json)).toBeTrue();
  json = {
    code: 0,
    data: { truc: 'machin' },
  };
  expect(isApiResponseValid(json)).toBeTrue();
  json = {
    message: 'coucou',
  };
  expect(isApiResponseValid(json)).toBeFalse();
  json = {
    code: 'coucou',
    data: { truc: 'machin' },
  };
  expect(isApiResponseValid(json)).toBeFalse();
  json = {
    code: 0,
    data: 'coucou',
  };
  expect(isApiResponseValid(json)).toBeFalse();
  json = {
    code: 0,
  };
  expect(isApiResponseValid(json)).toBeFalse();
});
