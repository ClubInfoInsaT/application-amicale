import * as React from 'react';
import {ActivityIndicator, Button, Dialog, Paragraph, Portal, withTheme} from 'react-native-paper';
import ConnectionManager from "../managers/ConnectionManager";

type Props = {
    navigation: Object,
    visible: boolean,
    onDismiss: Function,
}

type State = {
    loading: boolean,
}

class LogoutDialog extends React.PureComponent<Props, State> {

    colors: Object;

    state = {
        loading: false,
    };

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    onClickAccept = () => {
        this.setState({loading: true});
        ConnectionManager.getInstance().disconnect()
            .then(() => {
                this.props.onDismiss();
                this.setState({loading: false});
                this.props.navigation.reset({
                    index: 0,
                    routes: [{name: 'Main'}],
                });
            });
    };

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
                    <Dialog.Title>DISCONNECT</Dialog.Title>
                    <Dialog.Content>
                        {this.state.loading
                            ? <ActivityIndicator
                                animating={true}
                                size={'large'}
                                color={this.colors.primary}/>
                            : <Paragraph>DISCONNECT?</Paragraph>
                        }
                    </Dialog.Content>
                    {this.state.loading
                        ? null
                        : <Dialog.Actions>
                            <Button onPress={this.onClickAccept}>YES</Button>
                            <Button onPress={this.onDismiss}>NO</Button>
                        </Dialog.Actions>
                    }

                </Dialog>
            </Portal>
        );
    }
}

export default withTheme(LogoutDialog);
