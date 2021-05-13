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

import * as React from 'react';
import i18n from 'i18n-js';
import AlertDialog from './AlertDialog';
import {
  API_REQUEST_CODES,
  getErrorMessage,
  REQUEST_STATUS,
} from '../../utils/Requests';

type PropsType = {
  visible: boolean;
  onDismiss: () => void;
  status?: REQUEST_STATUS;
  code?: API_REQUEST_CODES;
};

function ErrorDialog(props: PropsType) {
  return (
    <AlertDialog
      visible={props.visible}
      onDismiss={props.onDismiss}
      title={i18n.t('errors.title')}
      message={getErrorMessage(props).message}
    />
  );
}

export default ErrorDialog;
