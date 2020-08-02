// @flow

import * as React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import ConnectionManager from '../../managers/ConnectionManager';
import type {ApiGenericDataType} from '../../utils/WebData';
import {ERROR_TYPE} from '../../utils/WebData';
import ErrorView from '../Screens/ErrorView';
import BasicLoadingScreen from '../Screens/BasicLoadingScreen';

type PropsType = {
  navigation: StackNavigationProp,
  requests: Array<{
    link: string,
    params: {...},
    mandatory: boolean,
  }>,
  renderFunction: (Array<ApiGenericDataType | null>) => React.Node,
  errorViewOverride?: Array<{
    errorCode: number,
    message: string,
    icon: string,
    showRetryButton: boolean,
  }> | null,
};

type StateType = {
  loading: boolean,
};

class AuthenticatedScreen extends React.Component<PropsType, StateType> {
  static defaultProps = {
    errorViewOverride: null,
  };

  currentUserToken: string | null;

  connectionManager: ConnectionManager;

  errors: Array<number>;

  fetchedData: Array<ApiGenericDataType | null>;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      loading: true,
    };
    this.connectionManager = ConnectionManager.getInstance();
    props.navigation.addListener('focus', this.onScreenFocus);
    this.fetchedData = new Array(props.requests.length);
    this.errors = new Array(props.requests.length);
  }

  /**
   * Refreshes screen if user changed
   */
  onScreenFocus = () => {
    if (this.currentUserToken !== this.connectionManager.getToken()) {
      this.currentUserToken = this.connectionManager.getToken();
      this.fetchData();
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
  onRequestFinished(
    data: ApiGenericDataType | null,
    index: number,
    error?: number,
  ) {
    const {props} = this;
    if (index >= 0 && index < props.requests.length) {
      this.fetchedData[index] = data;
      this.errors[index] = error != null ? error : ERROR_TYPE.SUCCESS;
    }
    // Token expired, logout user
    if (error === ERROR_TYPE.BAD_TOKEN) this.connectionManager.disconnect();

    if (this.allRequestsFinished()) this.setState({loading: false});
  }

  /**
   * Gets the error to render.
   * Non-mandatory requests are ignored.
   *
   *
   * @return {number} The error code or ERROR_TYPE.SUCCESS if no error was found
   */
  getError(): number {
    const {props} = this;
    for (let i = 0; i < this.errors.length; i += 1) {
      if (
        this.errors[i] !== ERROR_TYPE.SUCCESS &&
        props.requests[i].mandatory
      ) {
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
  getErrorRender(): React.Node {
    const {props} = this;
    const errorCode = this.getError();
    let shouldOverride = false;
    let override = null;
    const overrideList = props.errorViewOverride;
    if (overrideList != null) {
      for (let i = 0; i < overrideList.length; i += 1) {
        if (overrideList[i].errorCode === errorCode) {
          shouldOverride = true;
          override = overrideList[i];
          break;
        }
      }
    }

    if (shouldOverride && override != null) {
      return (
        <ErrorView
          icon={override.icon}
          message={override.message}
          showRetryButton={override.showRetryButton}
        />
      );
    }
    return <ErrorView errorCode={errorCode} onRefresh={this.fetchData} />;
  }

  /**
   * Fetches the data from the server.
   *
   * If the user is not logged in errorCode is set to BAD_TOKEN and all requests fail.
   *
   * If the user is logged in, send all requests.
   */
  fetchData = () => {
    const {state, props} = this;
    if (!state.loading) this.setState({loading: true});

    if (this.connectionManager.isLoggedIn()) {
      for (let i = 0; i < props.requests.length; i += 1) {
        this.connectionManager
          .authenticatedRequest(
            props.requests[i].link,
            props.requests[i].params,
          )
          .then((response: ApiGenericDataType): void =>
            this.onRequestFinished(response, i),
          )
          .catch((error: number): void =>
            this.onRequestFinished(null, i, error),
          );
      }
    } else {
      for (let i = 0; i < props.requests.length; i += 1) {
        this.onRequestFinished(null, i, ERROR_TYPE.BAD_TOKEN);
      }
    }
  };

  /**
   * Checks if all requests finished processing
   *
   * @return {boolean} True if all finished
   */
  allRequestsFinished(): boolean {
    let finished = true;
    this.errors.forEach((error: number | null) => {
      if (error == null) finished = false;
    });
    return finished;
  }

  /**
   * Reloads the data, to be called using ref by parent components
   */
  reload() {
    this.fetchData();
  }

  render(): React.Node {
    const {state, props} = this;
    if (state.loading) return <BasicLoadingScreen />;
    if (this.getError() === ERROR_TYPE.SUCCESS)
      return props.renderFunction(this.fetchedData);
    return this.getErrorRender();
  }
}

export default AuthenticatedScreen;
