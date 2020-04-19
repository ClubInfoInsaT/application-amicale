// @flow

import * as React from 'react';
import {ActivityIndicator, Button, Dialog, Paragraph, Portal} from 'react-native-paper';
import i18n from "i18n-js";

type Props = {
    visible: boolean,
    onDismiss: () => void,
    onAccept: () => Promise<void>, // async function to be executed
    title: string,
    titleLoading: string,
    message: string,
}

type State = {
    loading: boolean,
}

class LoadingConfirmDialog extends React.PureComponent<Props, State> {

    state = {
        loading: false,
    };

    /**
     * Set the dialog into loading state and closes it when operation finishes
     */
    onClickAccept = () => {
        this.setState({loading: true});
        this.props.onAccept().then(this.hideLoading);
    };

    /**
     * Waits for fade out animations to finish before hiding loading
     * @returns {TimeoutID}
     */
    hideLoading = () => setTimeout(() => {
        this.setState({loading: false})
    }, 200);

    /**
     * Hide the dialog if it is not loading
     */
    onDismiss = () => {
        if (!this.state.loading)
            this.props.onDismiss();
    };

    render() {
        return (
            <Portal>
                <Dialog
                    visible={this.props.visible}
                    onDismiss={this.onDismiss}>
                    <Dialog.Title>
                        {this.state.loading
                            ? this.props.titleLoading
                            : this.props.title}
                    </Dialog.Title>
                    <Dialog.Content>
                        {this.state.loading
                            ? <ActivityIndicator
                                animating={true}
                                size={'large'}/>
                            : <Paragraph>{this.props.message}</Paragraph>
                        }
                    </Dialog.Content>
                    {this.state.loading
                        ? null
                        : <Dialog.Actions>
                            <Button onPress={this.onDismiss}
                                    style={{marginRight: 10}}>{i18n.t("dialog.cancel")}</Button>
                            <Button onPress={this.onClickAccept}>{i18n.t("dialog.yes")}</Button>
                        </Dialog.Actions>
                    }
                </Dialog>
            </Portal>
        );
    }
}

export default LoadingConfirmDialog;
