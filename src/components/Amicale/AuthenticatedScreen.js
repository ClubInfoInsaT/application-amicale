// @flow

import * as React from 'react';
import {withTheme} from 'react-native-paper';
import ConnectionManager, {ERROR_TYPE} from "../../managers/ConnectionManager";
import ErrorView from "../Custom/ErrorView";
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
        this.fetchData(); // TODO remove in prod (only use for fast refresh)
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
                this.connectionManager.authenticatedRequest(this.props.links[i].link, null, null)
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

        if (this.errorCode === ERROR_TYPE.BAD_TOKEN) { // Token expired, logout user
            this.connectionManager.disconnect()
                .then(() => {
                    this.props.navigation.navigate("login");
                });
        } else if (this.allRequestsFinished())
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
        return (
            <ErrorView
                errorCode={this.errorCode}
                onRefresh={this.fetchData}
            />
        );
    }

    reload() {
        this.fetchData();
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
