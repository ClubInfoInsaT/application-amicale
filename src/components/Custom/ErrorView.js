// @flow

import * as React from 'react';
import {Button, Subheading, withTheme} from 'react-native-paper';
import {StyleSheet, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import i18n from 'i18n-js';
import {ERROR_TYPE} from "../../utils/WebData";

type Props = {
    navigation: Object,
    route: Object,
    errorCode: number,
    onRefresh: Function,
}

type State = {
    refreshing: boolean,
}

class ErrorView extends React.PureComponent<Props, State> {

    colors: Object;

    message: string;
    icon: string;

    showLoginButton: boolean;

    state = {
        refreshing: false,
    };

    constructor(props) {
        super(props);
        this.colors = props.theme.colors;
    }

    generateMessage() {
        this.showLoginButton = false;
        switch (this.props.errorCode) {
            case ERROR_TYPE.BAD_CREDENTIALS:
                this.message = i18n.t("errors.badCredentials");
                this.icon = "account-alert-outline";
                break;
            case ERROR_TYPE.BAD_TOKEN:
                this.message = i18n.t("errors.badToken");
                this.icon = "account-alert-outline";
                this.showLoginButton = true;
                break;
            case ERROR_TYPE.NO_CONSENT:
                this.message = i18n.t("errors.noConsent");
                this.icon = "account-remove-outline";
                break;
            case ERROR_TYPE.BAD_INPUT:
                this.message = i18n.t("errors.badInput");
                this.icon = "alert-circle-outline";
                break;
            case ERROR_TYPE.FORBIDDEN:
                this.message = i18n.t("errors.forbidden");
                this.icon = "lock";
                break;
            case ERROR_TYPE.CONNECTION_ERROR:
                this.message = i18n.t("errors.connectionError");
                this.icon = "access-point-network-off";
                break;
            case ERROR_TYPE.SERVER_ERROR:
                this.message = i18n.t("errors.serverError");
                this.icon = "server-network-off";
                break;
            default:
                this.message = i18n.t("errors.unknown");
                this.icon = "alert-circle-outline";
                break;
        }
    }

    getRetryButton() {
        return <Button
            mode={'contained'}
            icon={'refresh'}
            onPress={this.props.onRefresh}
            style={styles.button}
        >
            {i18n.t("general.retry")}
        </Button>;
    }

    goToLogin = () => this.props.navigation.navigate("login",
        {
           screen: 'index',
           params: {nextScreen: this.props.route.name}
        });

    getLoginButton() {
        return <Button
            mode={'contained'}
            icon={'login'}
            onPress={this.goToLogin}
            style={styles.button}
        >
            {i18n.t("screens.login")}
        </Button>;
    }

    render() {
        this.generateMessage();
        return (
            <View style={{
                ...styles.outer,
                backgroundColor: this.colors.background
            }}>
                <View style={styles.inner}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons
                            name={this.icon}
                            size={150}
                            color={this.colors.textDisabled}/>
                    </View>
                    <Subheading style={{
                        ...styles.subheading,
                        color: this.colors.textDisabled
                    }}>
                        {this.message}
                    </Subheading>
                    {this.showLoginButton
                        ? this.getLoginButton()
                        : this.getRetryButton()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outer: {
        height: '100%',
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
    },
    button: {
        marginTop: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
    }
});


export default withTheme(ErrorView);
