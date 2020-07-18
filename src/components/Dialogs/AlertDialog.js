// @flow

import * as React from 'react';
import {Button, Dialog, Paragraph, Portal} from 'react-native-paper';
import i18n from "i18n-js";

type Props = {
    visible: boolean,
    onDismiss: () => void,
    title: string,
    message: string,
}

class AlertDialog extends React.PureComponent<Props> {

    render() {
        return (
            <Portal>
                <Dialog
                    visible={this.props.visible}
                    onDismiss={this.props.onDismiss}>
                    <Dialog.Title>{this.props.title}</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>{this.props.message}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={this.props.onDismiss}>{i18n.t("dialog.ok")}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }
}

export default AlertDialog;
