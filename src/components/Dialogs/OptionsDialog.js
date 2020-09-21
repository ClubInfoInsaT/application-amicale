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
import {Button, Dialog, Paragraph, Portal} from 'react-native-paper';
import {FlatList} from 'react-native';

export type OptionsDialogButtonType = {
  title: string,
  icon?: string,
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
    return (
      <Button onPress={item.onPress} icon={item.icon}>
        {item.title}
      </Button>
    );
  };

  keyExtractor = (item: OptionsDialogButtonType): string => {
    if (item.icon != null) {
      return item.title + item.icon;
    }
    return item.title;
  };

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
