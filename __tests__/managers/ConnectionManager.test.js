import * as loginContext from '../../src/context/loginContext';
import { connectToAmicale } from '../../src/utils/WebData';
import { API_REQUEST_CODES } from '../../src/utils/Requests';

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
          code: API_REQUEST_CODES.BAD_CREDENTIALS,
          message: 'Bad credentials.',
          data: {},
        }),
      status: 403,
    });
  });
  return expect(connectToAmicale('email', 'password')).rejects.toHaveProperty(
    'code',
    API_REQUEST_CODES.BAD_CREDENTIALS
  );
});

test('connectToAmicale good credentials', () => {
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          code: API_REQUEST_CODES.SUCCESS,
          data: { token: 'token' },
        }),
      status: 200,
    });
  });
  return expect(connectToAmicale('email', 'password')).resolves.toBe('token');
});

test('connectToAmicale good credentials no consent', () => {
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          code: API_REQUEST_CODES.NO_CONSENT,
          data: {},
        }),
      status: 403,
    });
  });
  return expect(connectToAmicale('email', 'password')).rejects.toHaveProperty(
    'code',
    API_REQUEST_CODES.NO_CONSENT
  );
});

test('connect connection error', () => {
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.reject();
  });
  return expect(connectToAmicale('email', 'password')).rejects.toHaveProperty(
    'code',
    API_REQUEST_CODES.CONNECTION_ERROR
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
    API_REQUEST_CODES.SERVER_ERROR
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
          code: API_REQUEST_CODES.SUCCESS,
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
          code: API_REQUEST_CODES.BAD_TOKEN,
          data: {},
        }),
      status: 200,
    });
  });
  return expect(
    loginContext.useAuthenticatedRequest('token/check')()
  ).rejects.toHaveProperty('code', API_REQUEST_CODES.BAD_TOKEN);
});

test('authenticatedRequest error bogus response', () => {
  jest.spyOn(loginContext, 'useLogin').mockImplementationOnce(() => {
    return { token: 'token' };
  });
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          code: API_REQUEST_CODES.SUCCESS,
        }),
      status: 200,
    });
  });
  return expect(
    loginContext.useAuthenticatedRequest('token/check')()
  ).rejects.toHaveProperty('code', API_REQUEST_CODES.SERVER_ERROR);
});

test('authenticatedRequest connection error', () => {
  jest.spyOn(loginContext, 'useLogin').mockImplementationOnce(() => {
    return { token: 'token' };
  });
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.reject();
  });
  return expect(
    loginContext.useAuthenticatedRequest('token/check')()
  ).rejects.toHaveProperty('code', API_REQUEST_CODES.CONNECTION_ERROR);
});

test('authenticatedRequest error no token', () => {
  jest.spyOn(loginContext, 'useLogin').mockImplementationOnce(() => {
    return { token: null };
  });
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          code: API_REQUEST_CODES.BAD_TOKEN,
          data: {},
        }),
      status: 200,
    });
  });
  return expect(
    loginContext.useAuthenticatedRequest('token/check')()
  ).rejects.toHaveProperty('code', API_REQUEST_CODES.BAD_TOKEN);
});
