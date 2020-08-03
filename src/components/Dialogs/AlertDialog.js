// @flow

import * as React from 'react';
import {Button, Dialog, Paragraph, Portal} from 'react-native-paper';
import i18n from 'i18n-js';

type PropsType = {
  visible: boolean,
  onDismiss: () => void,
  title: string,
  message: string,
};

class AlertDialog extends React.PureComponent<PropsType> {
  render(): React.Node {
    const {props} = this;
    return (
      <Portal>
        <Dialog visible={props.visible} onDismiss={props.onDismiss}>
          <Dialog.Title>{props.title}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{props.message}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={props.onDismiss}>{i18n.t('dialog.ok')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }
}

export default AlertDialog;
