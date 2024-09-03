/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 * Copyright (c) 2011 - 2024 Paul ALNET.
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
import AlertDialog from '../../Dialogs/AlertDialog';
import RequestScreen from '../../../components/Screens/RequestScreen';
import { useAuthenticatedRequest } from '../../../context/loginContext';

type PropsType = {
  visible: boolean;
  onDismiss: () => void;
};

type ResultType = {
  success: boolean;
};

function AcceptTermsDialog(props: PropsType) {
  const request = useAuthenticatedRequest<ResultType>(
    'user/acceptTerms',
    'PUT'
  );

  // Use a loading dialog as it can take some time to update the context
  // let message = i18n.t('dialog.disconnect.message');
  const onDismiss = async (): Promise<void> => {
    return new Promise((resolve: () => void) => {
      props.onDismiss();
      resolve();
    });
  };

  const renderDialog = (data: ResultType | undefined, loading: boolean) => {
    const title = loading // TODO i18n
      ? i18n.t('dialog.disconnect.titleLoading')
      : i18n.t('dialog.disconnect.title');
    let message = loading
      ? 'Loading...'
      : 'Terms accepted : ' + (data ? data.success : 'false');
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

export default AcceptTermsDialog;
