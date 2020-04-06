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
    links: Array<{link: string, mandatory: boolean}>,
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
    data: Array<Object>;
    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
        this.connectionManager = ConnectionManager.getInstance();
        this.props.navigation.addListener('focus', this.onScreenFocus.bind(this));
        this.data = new Array(this.props.links.length);
    }

    onScreenFocus() {
        if (this.currentUserToken !== this.connectionManager.getToken())
            this.fetchData();
    }

    fetchData = () => {
        if (!this.state.loading)
            this.setState({loading: true});
        if (this.connectionManager.isLoggedIn()) {
            for (let i = 0; i < this.props.links.length; i++) {
                this.connectionManager.authenticatedRequest(this.props.links[i].link)
                    .then((data) => {
                        this.onFinishedLoading(data, i, -1);
                    })
                    .catch((error) => {
                        this.onFinishedLoading(null, i, error);
                    });
            }

        } else {
            this.onFinishedLoading(null, -1, ERROR_TYPE.BAD_CREDENTIALS);
        }
    };

    onFinishedLoading(data: Object, index: number, error: number) {
        if (index >= 0 && index < this.props.links.length)
            this.data[index] = data;
        this.currentUserToken = data !== undefined
            ? this.connectionManager.getToken()
            : null;
        this.errorCode = error;

        if (this.allRequestsFinished())
            this.setState({loading: false});
    }

    allRequestsFinished() {
        let finished = true;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] === undefined) {
                finished = false;
                break;
            }
        }
        return finished;
    }

    allRequestsValid() {
        let valid = true;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] === null && this.props.links[i].mandatory) {
                valid = false;
                break;
            }
        }
        return valid;
    }

    getErrorRender() {
        let message;
        let icon;
        switch (this.errorCode) {
            case ERROR_TYPE.BAD_CREDENTIALS:
                message = i18n.t("loginScreen.errors.credentials");
                icon = "account-alert-outline";
                break;
            case ERROR_TYPE.BAD_TOKEN:
                message = "BAD TOKEN"; // TODO translate
                icon = "access-point-network-off";
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
                : (this.allRequestsValid()
                ? this.props.renderFunction(this.data)
                : this.getErrorRender())
        );
    }
}

export default withTheme(AuthenticatedScreen);
