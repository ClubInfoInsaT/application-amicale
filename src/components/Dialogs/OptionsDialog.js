// @flow

import * as React from 'react';
import {Button, Dialog, Paragraph, Portal} from 'react-native-paper';
import {FlatList} from 'react-native';

export type OptionsDialogButtonType = {
  title: string,
  onPress: () => void,
};

type PropsType = {
  visible: boolean,
  title: string,
  message: string,
  buttons: Array<OptionsDialogButtonType>,
  onDismiss: () => void,
};

class OptionsDialog extends React.PureComponent<PropsType> {
  getButtonRender = ({item}: {item: OptionsDialogButtonType}): React.Node => {
    return <Button onPress={item.onPress}>{item.title}</Button>;
  };

  keyExtractor = (item: OptionsDialogButtonType): string => item.title;

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
            <FlatList
              data={props.buttons}
              renderItem={this.getButtonRender}
              keyExtractor={this.keyExtractor}
              horizontal
              inverted
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }
}

export default OptionsDialog;
