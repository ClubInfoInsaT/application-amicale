import * as Keychain from 'react-native-keychain';

/**
 * Tries to recover login token from the secure keychain
 *
 * @returns Promise<string | undefined>
 */
export async function retrieveLoginToken(): Promise<string | undefined> {
  return new Promise((resolve: (token: string | undefined) => void) => {
    Keychain.getGenericPassword()
      .then((data: Keychain.UserCredentials | false) => {
        if (data && data.password) {
          resolve(data.password);
        } else {
          resolve(undefined);
        }
      })
      .catch(() => resolve(undefined));
  });
}
/**
 * Saves the login token in the secure keychain
 *
 * @param token
 * @returns Promise<void>
 */
export async function saveLoginToken(token: string): Promise<void> {
  return new Promise((resolve: () => void, reject: () => void) => {
    Keychain.setGenericPassword('amicale', token).then(resolve).catch(reject);
  });
}

/**
 * Deletes the login token from the keychain
 *
 * @returns Promise<void>
 */
export async function deleteLoginToken(): Promise<void> {
  return new Promise((resolve: () => void, reject: () => void) => {
    Keychain.resetGenericPassword().then(resolve).catch(reject);
  });
}
