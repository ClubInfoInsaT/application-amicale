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
import {
  ActivityIndicator,
  Button,
  Dialog,
  Paragraph,
  Portal,
} from 'react-native-paper';
import i18n from 'i18n-js';

type PropsType = {
  visible: boolean,
  onDismiss?: () => void,
  onAccept?: () => Promise<void>, // async function to be executed
  title?: string,
  titleLoading?: string,
  message?: string,
  startLoading?: boolean,
};

type StateType = {
  loading: boolean,
};

class LoadingConfirmDialog extends React.PureComponent<PropsType, StateType> {
  static defaultProps = {
    onDismiss: () => {},
    onAccept: (): Promise<void> => {
      return Promise.resolve();
    },
    title: '',
    titleLoading: '',
    message: '',
    startLoading: false,
  };

  constructor(props: PropsType) {
    super(props);
    this.state = {
      loading:
        props.startLoading != null
          ? props.startLoading
          : LoadingConfirmDialog.defaultProps.startLoading,
    };
  }

  /**
   * Set the dialog into loading state and closes it when operation finishes
   */
  onClickAccept = () => {
    const {props} = this;
    this.setState({loading: true});
    if (props.onAccept != null) props.onAccept().then(this.hideLoading);
  };

  /**
   * Waits for fade out animations to finish before hiding loading
   * @returns {TimeoutID}
   */
  hideLoading = (): TimeoutID =>
    setTimeout(() => {
      this.setState({loading: false});
    }, 200);

  /**
   * Hide the dialog if it is not loading
   */
  onDismiss = () => {
    const {state, props} = this;
    if (!state.loading && props.onDismiss != null) props.onDismiss();
  };

  render(): React.Node {
    const {state, props} = this;
    return (
      <Portal>
        <Dialog visible={props.visible} onDismiss={this.onDismiss}>
          <Dialog.Title>
            {state.loading ? props.titleLoading : props.title}
          </Dialog.Title>
          <Dialog.Content>
            {state.loading ? (
              <ActivityIndicator animating size="large" />
            ) : (
              <Paragraph>{props.message}</Paragraph>
            )}
          </Dialog.Content>
          {state.loading ? null : (
            <Dialog.Actions>
              <Button onPress={this.onDismiss} style={{marginRight: 10}}>
                {i18n.t('dialog.cancel')}
              </Button>
              <Button onPress={this.onClickAccept}>
                {i18n.t('dialog.yes')}
              </Button>
            </Dialog.Actions>
          )}
        </Dialog>
      </Portal>
    );
  }
}

export default LoadingConfirmDialog;
