// @flow

import * as React from 'react';
import {Animated, KeyboardAvoidingView, StyleSheet, View} from "react-native";
import {Avatar, Button, Card, HelperText, Paragraph, TextInput, withTheme} from 'react-native-paper';
import ConnectionManager from "../../managers/ConnectionManager";
import i18n from 'i18n-js';
import ErrorDialog from "../../components/Dialogs/ErrorDialog";
import {withCollapsible} from "../../utils/withCollapsible";
import {Collapsible} from "react-navigation-collapsible";
import CustomTabBar from "../../components/Tabbar/CustomTabBar";
import type {CustomTheme} from "../../managers/ThemeManager";
import {Linking} from "expo";

type Props = {
    navigation: Object,
    route: Object,
    collapsibleStack: Collapsible,
    theme: CustomTheme
}

type State = {
    email: string,
    password: string,
    isEmailValidated: boolean,
    isPasswordValidated: boolean,
    loading: boolean,
    dialogVisible: boolean,
    dialogError: number,
}

const ICON_AMICALE = require('../../../assets/amicale.png');

const RESET_PASSWORD_PATH = "https://www.amicale-insat.fr//password/reset";

const emailRegex = /^.+@.+\..+$/;

class LoginScreen extends React.Component<Props, State> {

    state = {
        email: '',
        password: '',
        isEmailValidated: false,
        isPasswordValidated: false,
        loading: false,
        dialogVisible: false,
        dialogError: 0,
    };

    onEmailChange: Function;
    onPasswordChange: Function;
    passwordInputRef: Object;


    constructor(props) {
        super(props);
        this.onEmailChange = this.onInputChange.bind(this, true);
        this.onPasswordChange = this.onInputChange.bind(this, false);
    }

    showErrorDialog = (error: number) =>
        this.setState({
            dialogVisible: true,
            dialogError: error,
        });

    hideErrorDialog = () => this.setState({dialogVisible: false});

    handleSuccess = () => this.props.navigation.goBack();

    onResetPasswordClick = () => Linking.openURL(RESET_PASSWORD_PATH);

    validateEmail = () => this.setState({isEmailValidated: true});

    isEmailValid() {
        return emailRegex.test(this.state.email);
    }

    shouldShowEmailError() {
        return this.state.isEmailValidated && !this.isEmailValid();
    }

    validatePassword = () => this.setState({isPasswordValidated: true});

    isPasswordValid() {
        return this.state.password !== '';
    }

    shouldShowPasswordError() {
        return this.state.isPasswordValidated && !this.isPasswordValid();
    }

    shouldEnableLogin() {
        return this.isEmailValid() && this.isPasswordValid() && !this.state.loading;
    }

    onInputChange(isEmail: boolean, value: string) {
        if (isEmail) {
            this.setState({
                email: value,
                isEmailValidated: false,
            });
        } else {
            this.setState({
                password: value,
                isPasswordValidated: false,
            });
        }
    }

    onEmailSubmit = () => this.passwordInputRef.focus();

    onSubmit = () => {
        if (this.shouldEnableLogin()) {
            this.setState({loading: true});
            ConnectionManager.getInstance().connect(this.state.email, this.state.password)
                .then(this.handleSuccess)
                .catch(this.showErrorDialog)
                .finally(() => {
                    this.setState({loading: false});
                });
        }
    };

    getFormInput() {
        return (
            <View>
                <TextInput
                    label={i18n.t("loginScreen.email")}
                    mode='outlined'
                    value={this.state.email}
                    onChangeText={this.onEmailChange}
                    onBlur={this.validateEmail}
                    onSubmitEditing={this.onEmailSubmit}
                    error={this.shouldShowEmailError()}
                    textContentType={'emailAddress'}
                    autoCapitalize={'none'}
                    autoCompleteType={'email'}
                    autoCorrect={false}
                    keyboardType={'email-address'}
                    returnKeyType={'next'}
                    secureTextEntry={false}
                />
                <HelperText
                    type="error"
                    visible={this.shouldShowEmailError()}
                >
                    {i18n.t("loginScreen.emailError")}
                </HelperText>
                <TextInput
                    ref={(ref) => {
                        this.passwordInputRef = ref;
                    }}
                    label={i18n.t("loginScreen.password")}
                    mode='outlined'
                    value={this.state.password}
                    onChangeText={this.onPasswordChange}
                    onBlur={this.validatePassword}
                    onSubmitEditing={this.onSubmit}
                    error={this.shouldShowPasswordError()}
                    textContentType={'password'}
                    autoCapitalize={'none'}
                    autoCompleteType={'password'}
                    autoCorrect={false}
                    keyboardType={'default'}
                    returnKeyType={'done'}
                    secureTextEntry={true}
                />
                <HelperText
                    type="error"
                    visible={this.shouldShowPasswordError()}
                >
                    {i18n.t("loginScreen.passwordError")}
                </HelperText>
            </View>
        );
    }

    getMainCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={i18n.t("loginScreen.title")}
                    subtitle={i18n.t("loginScreen.subtitle")}
                    left={(props) => <Avatar.Image
                        {...props}
                        source={ICON_AMICALE}
                        style={{backgroundColor: 'transparent'}}/>}
                />
                <Card.Content>
                    {this.getFormInput()}
                    <Card.Actions>
                        <Button
                            icon="send"
                            mode="contained"
                            disabled={!this.shouldEnableLogin()}
                            loading={this.state.loading}
                            onPress={this.onSubmit}
                            style={{marginLeft: 'auto'}}>
                            {i18n.t("loginScreen.login")}
                        </Button>
                    </Card.Actions>
                    <Card.Actions>
                        <Button
                            icon="help-circle"
                            mode="contained"
                            onPress={this.onResetPasswordClick}
                            style={{marginLeft: 'auto'}}>
                            {i18n.t("loginScreen.resetPassword")}
                        </Button>
                    </Card.Actions>
                </Card.Content>
            </Card>
        );
    }

    getSecondaryCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title={i18n.t("loginScreen.whyAccountTitle")}
                    subtitle={i18n.t("loginScreen.whyAccountSub")}
                    left={(props) => <Avatar.Icon
                        {...props}
                        icon={"help"}
                        color={this.props.theme.colors.primary}
                        style={{backgroundColor: 'transparent'}}/>}
                />
                <Card.Content>
                    <Paragraph>{i18n.t("loginScreen.whyAccountParagraph")}</Paragraph>
                    <Paragraph>{i18n.t("loginScreen.whyAccountParagraph2")}</Paragraph>
                    <Paragraph>{i18n.t("loginScreen.noAccount")}</Paragraph>
                </Card.Content>
            </Card>
        );
    }

    render() {
        const {containerPaddingTop, scrollIndicatorInsetTop, onScroll} = this.props.collapsibleStack;
        return (
            <KeyboardAvoidingView
                behavior={"height"}
                contentContainerStyle={styles.container}
                style={styles.container}
                enabled
                keyboardVerticalOffset={100}
            >
                <Animated.ScrollView
                    onScroll={onScroll}
                    contentContainerStyle={{
                        paddingTop: containerPaddingTop,
                        paddingBottom: CustomTabBar.TAB_BAR_HEIGHT + 20
                    }}
                    scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}
                >
                    <View>
                        {this.getMainCard()}
                        {this.getSecondaryCard()}
                    </View>
                    <ErrorDialog
                        visible={this.state.dialogVisible}
                        onDismiss={this.hideErrorDialog}
                        errorCode={this.state.dialogError}
                    />
                </Animated.ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    card: {
        margin: 10,
    },
    header: {
        fontSize: 36,
        marginBottom: 48
    },
    textInput: {},
    btnContainer: {
        marginTop: 5,
        marginBottom: 10,
    }
});

export default withCollapsible(withTheme(LoginScreen));
