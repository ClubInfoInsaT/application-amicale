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

// @flow

import * as React from 'react';
import i18n from 'i18n-js';
import {ERROR_TYPE} from '../../utils/WebData';
import AlertDialog from './AlertDialog';

type PropsType = {
  visible: boolean,
  onDismiss: () => void,
  errorCode: number,
};

class ErrorDialog extends React.PureComponent<PropsType> {
  title: string;

  message: string;

  generateMessage() {
    const {props} = this;
    this.title = i18n.t('errors.title');
    switch (props.errorCode) {
      case ERROR_TYPE.BAD_CREDENTIALS:
        this.message = i18n.t('errors.badCredentials');
        break;
      case ERROR_TYPE.BAD_TOKEN:
        this.message = i18n.t('errors.badToken');
        break;
      case ERROR_TYPE.NO_CONSENT:
        this.message = i18n.t('errors.noConsent');
        break;
      case ERROR_TYPE.TOKEN_SAVE:
        this.message = i18n.t('errors.tokenSave');
        break;
      case ERROR_TYPE.TOKEN_RETRIEVE:
        this.message = i18n.t('errors.unknown');
        break;
      case ERROR_TYPE.BAD_INPUT:
        this.message = i18n.t('errors.badInput');
        break;
      case ERROR_TYPE.FORBIDDEN:
        this.message = i18n.t('errors.forbidden');
        break;
      case ERROR_TYPE.CONNECTION_ERROR:
        this.message = i18n.t('errors.connectionError');
        break;
      case ERROR_TYPE.SERVER_ERROR:
        this.message = i18n.t('errors.serverError');
        break;
      default:
        this.message = i18n.t('errors.unknown');
        break;
    }
    this.message += `\n\nCode ${props.errorCode}`;
  }

  render(): React.Node {
    this.generateMessage();
    const {props} = this;
    return (
      <AlertDialog
        visible={props.visible}
        onDismiss={props.onDismiss}
        title={this.title}
        message={this.message}
      />
    );
  }
}

export default ErrorDialog;
