// @flow

import * as React from 'react';
import i18n from 'i18n-js';
import LoadingConfirmDialog from "../Dialogs/LoadingConfirmDialog";
import ConnectionManager from "../../managers/ConnectionManager";
import {StackNavigationProp} from "@react-navigation/stack";

type Props = {
    navigation: StackNavigationProp,
    visible: boolean,
    onDismiss: () => void,
}

class LogoutDialog extends React.PureComponent<Props> {

    onClickAccept = async () => {
        return new Promise((resolve) => {
            ConnectionManager.getInstance().disconnect()
                .then(() => {
                    this.props.navigation.reset({
                        index: 0,
                        routes: [{name: 'main'}],
                    });
                    this.props.onDismiss();
                    resolve();
                });
        });
    };

    render() {
        return (
            <LoadingConfirmDialog
                {...this.props}
                visible={this.props.visible}
                onDismiss={this.props.onDismiss}
                onAccept={this.onClickAccept}
                title={i18n.t("dialog.disconnect.title")}
                titleLoading={i18n.t("dialog.disconnect.titleLoading")}
                message={i18n.t("dialog.disconnect.message")}
            />
        );
    }
}

export default LogoutDialog;
