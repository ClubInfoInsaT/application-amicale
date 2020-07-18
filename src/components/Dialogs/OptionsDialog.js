// @flow

import * as React from 'react';
import {Button, Dialog, Paragraph, Portal} from 'react-native-paper';
import {FlatList} from "react-native";

export type OptionsDialogButton = {
    title: string,
    onPress: () => void,
}

type Props = {
    visible: boolean,
    title: string,
    message: string,
    buttons: Array<OptionsDialogButton>,
    onDismiss: () => void,
}

class OptionsDialog extends React.PureComponent<Props> {

    getButtonRender = ({item}: { item: OptionsDialogButton }) => {
        return <Button
            onPress={item.onPress}>
            {item.title}
        </Button>;
    }

    keyExtractor = (item: OptionsDialogButton) => item.title;

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
                        <FlatList
                            data={this.props.buttons}
                            renderItem={this.getButtonRender}
                            keyExtractor={this.keyExtractor}
                            horizontal={true}
                            inverted={true}
                        />
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }
}

export default OptionsDialog;
