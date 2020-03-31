import * as React from 'react';
import {StyleSheet, View} from "react-native";
import {ActivityIndicator, Subheading, withTheme} from 'react-native-paper';
import ConnectionManager, {ERROR_TYPE} from "../managers/ConnectionManager";
import {MaterialCommunityIcons} from "@expo/vector-icons";

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

    currentUserToken: string;
    connectionManager: ConnectionManager;
    errorCode: number;
    data: Object;
    colors: Object;

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
        this.connectionManager = ConnectionManager.getInstance();
        this.props.navigation.addListener('focus', this.onScreenFocus.bind(this));

        this.fetchData();
    }

    onScreenFocus() {
        if (this.currentUserToken !== this.connectionManager.getToken())
            this.fetchData();
    }

    fetchData() {
        if (!this.state.loading)
            this.setState({loading: true});
        this.connectionManager.isLoggedIn()
            .then(() => {
                this.connectionManager.authenticatedRequest(this.props.link)
                    .then((data) => {
                        this.onFinishedLoading(data);
                    })
                    .catch((error) => {
                        this.onFinishedLoading(undefined, error);
                    });
            })
            .catch((error) => {
                this.onFinishedLoading(undefined, ERROR_TYPE.BAD_CREDENTIALS);
            });
    }

    onFinishedLoading(data: Object, error: number) {
        this.data = data;
        this.currentUserToken = data !== undefined
            ? this.connectionManager.getToken()
            : '';
        this.errorCode = error;
        this.setState({loading: false});
    }

    /**
     * Gets the loading indicator
     *
     * @return {*}
     */
    getRenderLoading() {
        return (
            <View style={{
                backgroundColor: this.colors.background,
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <ActivityIndicator
                    animating={true}
                    size={'large'}
                    color={this.colors.primary}/>
            </View>
        );
    }

    getErrorRender() {
        let message;
        let icon;
        switch (this.errorCode) {
            case ERROR_TYPE.BAD_CREDENTIALS:
                message = "BAD_CREDENTIALS";
                icon = "account-alert-outline";
                break;
            case ERROR_TYPE.CONNECTION_ERROR:
                message = "CONNECTION_ERROR";
                icon = "access-point-network-off";
                break;
            default:
                message = "UNKNOWN";
                icon = "alert-circle-outline";
                break;
        }

        return (
            <View style={styles.outer}>
                <View style={styles.inner}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons
                            name={icon}
                            size={150}
                            color={this.colors.textDisabled}/>
                    </View>
                    <Subheading style={{
                        ...styles.subheading,
                        color: this.colors.textDisabled
                    }}>
                        {message}
                    </Subheading>
                </View>
            </View>
        );
    }

    render() {
        return (
            this.state.loading
                ? this.getRenderLoading()
                : (this.data !== undefined
                ? this.props.renderFunction(this.data)
                : this.getErrorRender())
        );
    }
}

const styles = StyleSheet.create({
    outer: {
        flex: 1,
    },
    inner: {
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    iconContainer: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 20
    },
    subheading: {
        textAlign: 'center',
    }
});

export default withTheme(AuthenticatedScreen);
