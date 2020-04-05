// @flow

import * as React from 'react';
import {withTheme} from 'react-native-paper';
import ConnectionManager, {ERROR_TYPE} from "../../managers/ConnectionManager";
import NetworkErrorComponent from "../Custom/NetworkErrorComponent";
import i18n from 'i18n-js';
import BasicLoadingScreen from "../Custom/BasicLoadingScreen";

type Props = {
    navigation: Object,
    theme: Object,
    link: string,
    renderFunction: Function,
}

type State = {
    loading: boolean,
}

class AuthenticatedScreen extends React.Component<Props, State> {

    state = {
        loading: true,
    };

    currentUserToken: string | null;
    connectionManager: ConnectionManager;
    errorCode: number;
    data: Object;
    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
        this.connectionManager = ConnectionManager.getInstance();
        this.props.navigation.addListener('focus', this.onScreenFocus.bind(this));
    }

    onScreenFocus() {
        if (this.currentUserToken !== this.connectionManager.getToken())
            this.fetchData();
    }

    fetchData = () => {
        if (!this.state.loading)
            this.setState({loading: true});
        if (this.connectionManager.isLoggedIn()) {
            this.connectionManager.authenticatedRequest(this.props.link)
                .then((data) => {
                    this.onFinishedLoading(data, -1);
                })
                .catch((error) => {
                    this.onFinishedLoading(undefined, error);
                });
        } else {
            this.onFinishedLoading(undefined, ERROR_TYPE.BAD_CREDENTIALS);
        }
    };

    onFinishedLoading(data: Object, error: number) {
        this.data = data;
        this.currentUserToken = data !== undefined
            ? this.connectionManager.getToken()
            : null;
        this.errorCode = error;
        this.setState({loading: false});
    }

    getErrorRender() {
        let message;
        let icon;
        switch (this.errorCode) {
            case ERROR_TYPE.BAD_CREDENTIALS:
                message = i18n.t("loginScreen.errors.credentials");
                icon = "account-alert-outline";
                break;
            case ERROR_TYPE.CONNECTION_ERROR:
                message = i18n.t("loginScreen.errors.connection");
                icon = "access-point-network-off";
                break;
            default:
                message = i18n.t("loginScreen.errors.unknown");
                icon = "alert-circle-outline";
                break;
        }

        return (
            <NetworkErrorComponent
                {...this.props}
                icon={icon}
                message={message}
                onRefresh={this.fetchData}
            />
        );
    }

    render() {
        return (
            this.state.loading
                ? <BasicLoadingScreen/>
                : (this.data !== undefined
                ? this.props.renderFunction(this.data)
                : this.getErrorRender())
        );
    }
}

export default withTheme(AuthenticatedScreen);
