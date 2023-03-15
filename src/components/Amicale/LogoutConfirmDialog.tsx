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
import AlertDialog from '../Dialogs/AlertDialog';
import { useLogout } from '../../utils/logout';
import RequestScreen from '../../components/Screens/RequestScreen';
import { useAuthenticatedRequest } from '../../context/loginContext';

type PropsType = {
  visible: boolean;
  onDismiss: (logout: boolean) => void;
  sessions?: string;
};

type ResultType = {
  success: boolean;
};

function LogoutConfirmDialog(props: PropsType) {
  const onLogout = useLogout();
  const session = props.sessions ? props.sessions : 'current';
  const request = useAuthenticatedRequest<ResultType>(
    'auth/logout?session=' + session,
    'GET'
  );
  // Use a loading dialog as it can take some time to update the context
  // let message = i18n.t('dialog.disconnect.message');
  const onDismiss = async (): Promise<void> => {
    return new Promise((resolve: () => void) => {
      if (session !== 'others') onLogout();
      props.onDismiss(true);
      resolve();
    });
  };

  const renderDialog = (data: ResultType | undefined, loading: boolean) => {
    let message = loading ? 'Loading...' : 'sucess : ' + data?.success; // TODO i18n
    const title = loading // TODO i18n
      ? i18n.t('dialog.disconnect.titleLoading')
      : i18n.t('dialog.disconnect.title');
    return (
      <AlertDialog
        visible={props.visible}
        onDismiss={onDismiss}
        title={title}
        message={message}
      />
    );
  };

  return <RequestScreen request={request} render={renderDialog} />;
}

export default LogoutConfirmDialog;
