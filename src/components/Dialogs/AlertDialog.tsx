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
import {Button, Dialog, Paragraph, Portal} from 'react-native-paper';
import i18n from 'i18n-js';

type PropsType = {
  visible: boolean;
  onDismiss: () => void;
  title: string | React.ReactNode;
  message: string | React.ReactNode;
};

function AlertDialog(props: PropsType) {
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

export default AlertDialog;
