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
