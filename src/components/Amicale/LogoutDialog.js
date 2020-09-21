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
import {StackNavigationProp} from '@react-navigation/stack';
import LoadingConfirmDialog from '../Dialogs/LoadingConfirmDialog';
import ConnectionManager from '../../managers/ConnectionManager';

type PropsType = {
  navigation: StackNavigationProp,
  visible: boolean,
  onDismiss: () => void,
};

class LogoutDialog extends React.PureComponent<PropsType> {
  onClickAccept = async (): Promise<void> => {
    const {props} = this;
    return new Promise((resolve: () => void) => {
      ConnectionManager.getInstance()
        .disconnect()
        .then(() => {
          props.navigation.reset({
            index: 0,
            routes: [{name: 'main'}],
          });
          props.onDismiss();
          resolve();
        });
    });
  };

  render(): React.Node {
    const {props} = this;
    return (
      <LoadingConfirmDialog
        visible={props.visible}
        onDismiss={props.onDismiss}
        onAccept={this.onClickAccept}
        title={i18n.t('dialog.disconnect.title')}
        titleLoading={i18n.t('dialog.disconnect.titleLoading')}
        message={i18n.t('dialog.disconnect.message')}
      />
    );
  }
}

export default LogoutDialog;
