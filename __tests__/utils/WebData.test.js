import {
  API_RESPONSE_CODE,
  RESPONSE_HTTP_STATUS,
} from '../../src/utils/Requests';
import { isApiResponseValid, apiRequest } from '../../src/utils/WebData';

// eslint-disable-next-line no-unused-vars
const fetch = require('isomorphic-fetch'); // fetch is not implemented in nodeJS but in react-native

afterEach(() => {
  jest.restoreAllMocks();
});

test('isRequestResponseValid', () => {
  let json = {
    status: 200,
    code: 0,
    data: {},
  };
  expect(isApiResponseValid(json)).toBeTrue();
  json = {
    status: 403,
    code: 1,
    data: {},
  };
  expect(isApiResponseValid(json)).toBeTrue();
  json = {
    status: 999,
    code: 999,
    data: {},
  };
  expect(isApiResponseValid(json)).toBeTrue();
  json = {
    status: 200,
    code: 0,
    data: { truc: 'machin' },
  };
  expect(isApiResponseValid(json)).toBeTrue();
  json = {
    status: 400,
    code: 400,
    message: 'uh oh',
  };
  expect(isApiResponseValid(json)).toBeTrue();
  json = {
    code: 0,
    message: 'coucou',
  };
  expect(isApiResponseValid(json)).toBeFalse();
  json = {
    status: 400,
    message: 'coucou',
  };
  expect(isApiResponseValid(json)).toBeFalse();
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

test('apiRequest NetworkError', () => {
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.reject(new Error('NetworkError that was uncalled for'));
  });
  apiRequest('/', 'GET').catch((error) => {
    expect(error).toHaveProperty(
      'status',
      RESPONSE_HTTP_STATUS.CONNECTION_ERROR
    );
    expect(error).toHaveProperty('code', API_RESPONSE_CODE.CONNECTION_ERROR);
    expect(error.message).toMatch(/NetworkError/);
  });
});

test('apiRequest Bad JSON', () => {
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () => {
        throw new Error('Unexpected token < in JSON at position 0');
      },
    });
  });
  apiRequest('/', 'GET').catch((error) => {
    expect(error).toHaveProperty('status', RESPONSE_HTTP_STATUS.SERVER_ERROR);
    expect(error).toHaveProperty('code', API_RESPONSE_CODE.SERVER_ERROR);
    expect(error.message).toMatch(/JSON/);
  });
});

test('apiRequest Unexpected status code', () => {
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          status: API_RESPONSE_CODE.SUCCESS,
          data: { name: 'John' },
        }),
      status: 402,
    });
  });
  apiRequest('/', 'GET').catch((error) => {
    expect(error).toHaveProperty('status', RESPONSE_HTTP_STATUS.SERVER_ERROR);
    expect(error).toHaveProperty('code', API_RESPONSE_CODE.SERVER_ERROR);
    expect(error.message).toMatch(/invalid/i);
  });
});

test('apiRequest Unexpected code', () => {
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          status: 888,
          data: { name: 'John' },
        }),
      status: 200,
    });
  });
  apiRequest('/', 'GET').catch((error) => {
    expect(error).toHaveProperty('status', RESPONSE_HTTP_STATUS.SERVER_ERROR);
    expect(error).toHaveProperty('code', API_RESPONSE_CODE.SERVER_ERROR);
    expect(error.message).toMatch(/invalid/i);
  });
});

test('apiRequest Genuine server error', () => {
  // almost genuine
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          status: API_RESPONSE_CODE.SERVER_ERROR,
          message: 'Internal server error',
        }),
      status: RESPONSE_HTTP_STATUS.SERVER_ERROR,
    });
  });
  apiRequest('/', 'GET').catch((error) => {
    expect(error).toHaveProperty('status', RESPONSE_HTTP_STATUS.SERVER_ERROR);
    expect(error).toHaveProperty('code', API_RESPONSE_CODE.SERVER_ERROR);
    expect(error.message).toMatch(/internal/i);
  });
});

test('apiRequest Invalid token', () => {
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          status: API_RESPONSE_CODE.BAD_TOKEN,
          message: 'Invalid token',
        }),
      status: RESPONSE_HTTP_STATUS.FORBIDDEN,
    });
  });
  apiRequest('/', 'GET').catch((error) => {
    expect(error).toHaveProperty('status', RESPONSE_HTTP_STATUS.FORBIDDEN);
    expect(error).toHaveProperty('code', API_RESPONSE_CODE.BAD_TOKEN);
    expect(error.message).toMatch(/invalid/i);
  });
});

test('apiRequest Success with data', () => {
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          status: API_RESPONSE_CODE.SUCCESS,
          data: { name: 'John' },
        }),
      status: RESPONSE_HTTP_STATUS.SUCCESS,
    });
  });
  apiRequest('/', 'GET').then((data) => {
    expect(data.name).toMatch(/John/);
  });
});

test('apiRequest Success with no data', () => {
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          status: API_RESPONSE_CODE.SUCCESS,
          data: {},
        }),
      status: RESPONSE_HTTP_STATUS.SUCCESS,
    });
  });
  expect(apiRequest('/', 'GET')).resolves.toBeDefined();
});
