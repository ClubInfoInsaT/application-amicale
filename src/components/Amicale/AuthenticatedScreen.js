// @flow

import * as React from 'react';
import ConnectionManager, {ERROR_TYPE} from "../../managers/ConnectionManager";
import ErrorView from "../Custom/ErrorView";
import BasicLoadingScreen from "../Custom/BasicLoadingScreen";

type Props = {
    navigation: Object,
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
    errors: Array<number>;
    fetchedData: Array<Object>;

    constructor(props: Object) {
        super(props);
        this.connectionManager = ConnectionManager.getInstance();
        this.props.navigation.addListener('focus', this.onScreenFocus);
        this.fetchedData = new Array(this.props.links.length);
        this.errors = new Array(this.props.links.length);
        this.fetchData(); // TODO remove in prod (only use for fast refresh)
    }

    /**
     * Refreshes screen if user changed
     */
    onScreenFocus = () => {
        if (this.currentUserToken !== this.connectionManager.getToken()){
            this.currentUserToken = this.connectionManager.getToken();
            this.fetchData();
        }
    };

    /**
     * Fetches the data from the server.
     *
     * If the user is not logged in errorCode is set to BAD_TOKEN and all requests fail.
     *
     * If the user is logged in, send all requests.
     */
    fetchData = () => {
        if (!this.state.loading)
            this.setState({loading: true});
        if (this.connectionManager.isLoggedIn()) {
            for (let i = 0; i < this.props.links.length; i++) {
                this.connectionManager.authenticatedRequest(this.props.links[i].link, null, null)
                    .then((data) => {
                        this.onRequestFinished(data, i, -1);
                    })
                    .catch((error) => {
                        this.onRequestFinished(null, i, error);
                    });
            }
        } else {
            for (let i = 0; i < this.props.links.length; i++) {
                this.onRequestFinished(null, i, ERROR_TYPE.BAD_TOKEN);
            }
        }
    };

    /**
     * Callback used when a request finishes, successfully or not.
     * Saves data and error code.
     * If the token is invalid, logout the user and open the login screen.
     * If the last request was received, stop the loading screen.
     *
     * @param data The data fetched from the server
     * @param index The index for the data
     * @param error The error code received
     */
    onRequestFinished(data: Object | null, index: number, error: number) {
        if (index >= 0 && index < this.props.links.length){
            this.fetchedData[index] = data;
            this.errors[index] = error;
        }

        if (error === ERROR_TYPE.BAD_TOKEN) // Token expired, logout user
            this.connectionManager.disconnect();

        if (this.allRequestsFinished())
            this.setState({loading: false});
    }

    /**
     * Checks if all requests finished processing
     *
     * @return {boolean} True if all finished
     */
    allRequestsFinished() {
        let finished = true;
        for (let i = 0; i < this.fetchedData.length; i++) {
            if (this.fetchedData[i] === undefined) {
                finished = false;
                break;
            }
        }
        return finished;
    }

    /**
     * Checks if all requests have finished successfully.
     * This will return false only if a mandatory request failed.
     * All non-mandatory requests can fail without impacting the return value.
     *
     * @return {boolean} True if all finished successfully
     */
    allRequestsValid() {
        let valid = true;
        for (let i = 0; i < this.fetchedData.length; i++) {
            if (this.fetchedData[i] === null && this.props.links[i].mandatory) {
                valid = false;
                break;
            }
        }
        return valid;
    }

    /**
     * Gets the error to render.
     * Non-mandatory requests are ignored.
     *
     *
     * @return {number} The error code or ERROR_TYPE.SUCCESS if no error was found
     */
    getError() {
        for (let i = 0; i < this.errors.length; i++) {
            if (this.errors[i] !== 0 && this.props.links[i].mandatory) {
                return this.errors[i];
            }
        }
        return ERROR_TYPE.SUCCESS;
    }

    /**
     * Gets the error view to display in case of error
     *
     * @return {*}
     */
    getErrorRender() {
        return (
            <ErrorView
                {...this.props}
                errorCode={this.getError()}
                onRefresh={this.fetchData}
            />
        );
    }

    /**
     * Reloads the data, to be called using ref by parent components
     */
    reload() {
        this.fetchData();
    }

    render() {
        return (
            this.state.loading
                ? <BasicLoadingScreen/>
                : (this.allRequestsValid()
                ? this.props.renderFunction(this.fetchedData)
                : this.getErrorRender())
        );
    }
}

export default AuthenticatedScreen;
