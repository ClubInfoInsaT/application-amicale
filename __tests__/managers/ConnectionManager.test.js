import * as loginContext from '../../src/context/loginContext';
import { connectToAmicale } from '../../src/utils/WebData';
import {
  API_RESPONSE_CODE,
  RESPONSE_HTTP_STATUS,
} from '../../src/utils/Requests';

jest.mock('react-native-keychain');

// eslint-disable-next-line no-unused-vars
const fetch = require('isomorphic-fetch'); // fetch is not implemented in nodeJS but in react-native

afterEach(() => {
  jest.restoreAllMocks();
});

test('useLoginState true', () => {
  jest.spyOn(loginContext, 'useLogin').mockImplementationOnce(() => {
    return { token: 'token' };
  });
  return expect(loginContext.useLoginState()).toBe(true);
});

test('useLoginState false', () => {
  jest.spyOn(loginContext, 'useLogin').mockImplementationOnce(() => {
    return { token: undefined };
  });
  return expect(loginContext.useLoginState()).toBe(false);
});

test('connectToAmicale bad credentials', () => {
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          status: API_RESPONSE_CODE.BAD_CREDENTIALS,
          message: 'Bad credentials.',
        }),
      status: RESPONSE_HTTP_STATUS.FORBIDDEN,
    });
  });
  connectToAmicale('/', 'GET').catch((error) => {
    expect(error).toHaveProperty('status', RESPONSE_HTTP_STATUS.FORBIDDEN);
    expect(error).toHaveProperty('code', API_RESPONSE_CODE.BAD_CREDENTIALS);
    expect(error.message).toMatch(/bad/i);
  });
});

test('connectToAmicale good credentials', () => {
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          status: API_RESPONSE_CODE.SUCCESS,
          data: { token: 'token' },
        }),
      status: RESPONSE_HTTP_STATUS.SUCCESS,
    });
  });
  expect(connectToAmicale('email', 'password')).resolves.toBe('token');
});

test('connectToAmicale good credentials no consent', () => {
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          status: API_RESPONSE_CODE.NO_CONSENT,
          message: 'No consent.',
        }),
      status: RESPONSE_HTTP_STATUS.FORBIDDEN,
    });
  });
  connectToAmicale('email', 'password').catch((error) => {
    expect(error).toHaveProperty('status', RESPONSE_HTTP_STATUS.FORBIDDEN);
    expect(error).toHaveProperty('code', API_RESPONSE_CODE.NO_CONSENT);
    expect(error.message).toMatch(/consent/i);
  });
});

test('connect connection error', () => {
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.reject(new Error('NetworkError that was uncalled for'));
  });
  return expect(connectToAmicale('email', 'password')).rejects.toHaveProperty(
    'code',
    API_RESPONSE_CODE.CONNECTION_ERROR
  );
});

test('connect bogus response 1', () => {
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          thing: true,
          wrong: '',
        }),
      status: 200,
    });
  });
  return expect(connectToAmicale('email', 'password')).rejects.toHaveProperty(
    'code',
    API_RESPONSE_CODE.SERVER_ERROR
  );
});

test('useAuthenticatedRequest success', () => {
  jest.spyOn(loginContext, 'useLogin').mockImplementationOnce(() => {
    return { token: 'token' };
  });
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          status: API_RESPONSE_CODE.SUCCESS,
          data: { coucou: 'toi' },
        }),
      status: 200,
    });
  });
  return expect(
    loginContext.useAuthenticatedRequest('token/check')()
  ).resolves.toStrictEqual({ coucou: 'toi' });
});

test('authenticatedRequest error wrong token', () => {
  jest.spyOn(loginContext, 'useLogin').mockImplementationOnce(() => {
    return { token: undefined };
  });
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          status: API_RESPONSE_CODE.BAD_TOKEN,
          data: {},
        }),
      status: 200,
    });
  });
  return expect(
    loginContext.useAuthenticatedRequest('token/check')()
  ).rejects.toHaveProperty('code', API_RESPONSE_CODE.BAD_TOKEN);
});

test('authenticatedRequest error bogus response', () => {
  jest.spyOn(loginContext, 'useLogin').mockImplementationOnce(() => {
    return { token: 'token' };
  });
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          status: API_RESPONSE_CODE.SUCCESS,
        }),
      status: RESPONSE_HTTP_STATUS.SUCCESS,
    });
  });
  return expect(
    loginContext.useAuthenticatedRequest('token/check')()
  ).rejects.toHaveProperty('code', API_RESPONSE_CODE.SERVER_ERROR);
});

test('authenticatedRequest connection error', () => {
  jest.spyOn(loginContext, 'useLogin').mockImplementationOnce(() => {
    return { token: 'token' };
  });
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.reject(new Error('NetworkError that was uncalled for'));
  });
  return expect(
    loginContext.useAuthenticatedRequest('token/check')()
  ).rejects.toHaveProperty('code', API_RESPONSE_CODE.CONNECTION_ERROR);
});

test('authenticatedRequest error no token', () => {
  jest.spyOn(loginContext, 'useLogin').mockImplementationOnce(() => {
    return { token: null };
  });
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          status: API_RESPONSE_CODE.BAD_TOKEN,
          data: {},
        }),
      status: 200,
    });
  });
  return expect(
    loginContext.useAuthenticatedRequest('token/check')()
  ).rejects.toHaveProperty('code', API_RESPONSE_CODE.BAD_TOKEN);
});
