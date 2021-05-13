/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as Keychain from 'react-native-keychain';
import { REQUEST_STATUS } from '../utils/Requests';
import type { ApiDataLoginType, ApiRejectType } from '../utils/WebData';
import { apiRequest } from '../utils/WebData';

/**
 * champ: error
 *
 * 0 : SUCCESS -> pas d'erreurs
 * 1 : BAD_CREDENTIALS -> email ou mdp invalide
 * 2 : BAD_TOKEN -> session expirée
 * 3 : NO_CONSENT
 * 403 : FORBIDDEN -> accès a la ressource interdit
 * 500 : SERVER_ERROR -> pb coté serveur
 */

const AUTH_PATH = 'password';

export default class ConnectionManager {
  static instance: ConnectionManager | null = null;

  private token: string | null;

  constructor() {
    this.token = null;
  }

  /**
   * Gets this class instance or create one if none is found
   *
   * @returns {ConnectionManager}
   */
  static getInstance(): ConnectionManager {
    if (ConnectionManager.instance == null) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  /**
   * Gets the current token
   *
   * @returns {string | null}
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Tries to recover login token from the secure keychain
   *
   * @returns Promise<void>
   */
  async recoverLogin(): Promise<void> {
    return new Promise((resolve: () => void) => {
      const token = this.getToken();
      if (token != null) {
        resolve();
      } else {
        Keychain.getGenericPassword()
          .then((data: Keychain.UserCredentials | false) => {
            if (data && data.password != null) {
              this.token = data.password;
            }
            resolve();
          })
          .catch(() => resolve());
      }
    });
  }

  /**
   * Check if the user has a valid token
   *
   * @returns {boolean}
   */
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Saves the login token in the secure keychain
   *
   * @param email
   * @param token
   * @returns Promise<void>
   */
  async saveLogin(_email: string, token: string): Promise<void> {
    return new Promise((resolve: () => void, reject: () => void) => {
      Keychain.setGenericPassword('token', token)
        .then(() => {
          this.token = token;
          resolve();
        })
        .catch((): void => reject());
    });
  }

  /**
   * Deletes the login token from the keychain
   *
   * @returns Promise<void>
   */
  async disconnect(): Promise<void> {
    return new Promise((resolve: () => void, reject: () => void) => {
      Keychain.resetGenericPassword()
        .then(() => {
          this.token = null;
          resolve();
        })
        .catch((): void => reject());
    });
  }

  /**
   * Sends the given login and password to the api.
   * If the combination is valid, the login token is received and saved in the secure keychain.
   * If not, the promise is rejected with the corresponding error code.
   *
   * @param email
   * @param password
   * @returns Promise<void>
   */
  async connect(email: string, password: string): Promise<void> {
    return new Promise(
      (resolve: () => void, reject: (error: ApiRejectType) => void) => {
        const data = {
          email,
          password,
        };
        apiRequest<ApiDataLoginType>(AUTH_PATH, 'POST', data)
          .then((response: ApiDataLoginType) => {
            if (response.token != null) {
              this.saveLogin(email, response.token)
                .then(() => resolve())
                .catch(() =>
                  reject({
                    status: REQUEST_STATUS.TOKEN_SAVE,
                  })
                );
            } else {
              reject({
                status: REQUEST_STATUS.SERVER_ERROR,
              });
            }
          })
          .catch((err) => {
            reject(err);
          });
      }
    );
  }

  /**
   * Sends an authenticated request with the login token to the API
   *
   * @param path
   * @param params
   * @returns Promise<ApiGenericDataType>
   */
  async authenticatedRequest<T>(
    path: string,
    params?: { [key: string]: any }
  ): Promise<T> {
    return new Promise(
      (
        resolve: (response: T) => void,
        reject: (error: ApiRejectType) => void
      ) => {
        if (this.getToken() !== null) {
          const data = {
            ...params,
            token: this.getToken(),
          };
          apiRequest<T>(path, 'POST', data)
            .then((response: T) => resolve(response))
            .catch(reject);
        } else {
          reject({
            status: REQUEST_STATUS.TOKEN_RETRIEVE,
          });
        }
      }
    );
  }
}
