import * as React from 'react';
import {Button, Dialog, Paragraph, Portal, withTheme} from 'react-native-paper';

type Props = {
    navigation: Object,
    visible: boolean,
    onDismiss: Function,
    title: string,
    message: string,
}

class AlertDialog extends React.PureComponent<Props> {

    constructor(props) {
        super(props);
    }

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
                        <Button onPress={this.props.onDismiss}>OK</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }
}

export default withTheme(AlertDialog);
