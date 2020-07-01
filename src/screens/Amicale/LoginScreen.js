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
import AsyncStorageManager from "../../managers/AsyncStorageManager";
import {StackNavigationProp} from "@react-navigation/stack";
import AvailableWebsites from "../../constants/AvailableWebsites";

type Props = {
    navigation: StackNavigationProp,
    route: { params: { nextScreen: string } },
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

const RESET_PASSWORD_PATH = "https://www.amicale-insat.fr/password/reset";

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

    onEmailChange: (value: string) => null;
    onPasswordChange: (value: string) => null;
    passwordInputRef: { current: null | TextInput };

    nextScreen: string | null;

    constructor(props) {
        super(props);
        this.passwordInputRef = React.createRef();
        this.onEmailChange = this.onInputChange.bind(this, true);
        this.onPasswordChange = this.onInputChange.bind(this, false);
        this.props.navigation.addListener('focus', this.onScreenFocus);
    }

    onScreenFocus = () => {
        this.handleNavigationParams();
    };

    /**
     * Saves the screen to navigate to after a successful login if one was provided in navigation parameters
     */
    handleNavigationParams() {
        if (this.props.route.params != null) {
            if (this.props.route.params.nextScreen != null)
                this.nextScreen = this.props.route.params.nextScreen;
            else
                this.nextScreen = null;
        }
    }

    /**
     * Shows an error dialog with the corresponding login error
     *
     * @param error The error given by the login request
     */
    showErrorDialog = (error: number) =>
        this.setState({
            dialogVisible: true,
            dialogError: error,
        });

    hideErrorDialog = () => this.setState({dialogVisible: false});

    /**
     * Navigates to the screen specified in navigation parameters or simply go back tha stack.
     * Saves in user preferences to not show the login banner again.
     */
    handleSuccess = () => {
        // Do not show the login banner again
        AsyncStorageManager.getInstance().savePref(
            AsyncStorageManager.getInstance().preferences.homeShowBanner.key,
            '0'
        );
        if (this.nextScreen == null)
            this.props.navigation.goBack();
        else
            this.props.navigation.replace(this.nextScreen);
    };

    /**
     * Navigates to the Amicale website screen with the reset password link as navigation parameters
     */
    onResetPasswordClick = () => this.props.navigation.navigate("website", {host: AvailableWebsites.websites.AMICALE, path: RESET_PASSWORD_PATH, title: i18n.t('screens.amicaleWebsite')});

    /**
     * The user has unfocused the input, his email is ready to be validated
     */
    validateEmail = () => this.setState({isEmailValidated: true});

    /**
     * Checks if the entered email is valid (matches the regex)
     *
     * @returns {boolean}
     */
    isEmailValid() {
        return emailRegex.test(this.state.email);
    }

    /**
     * Checks if we should tell the user his email is invalid.
     * We should only show this if his email is invalid and has been checked when un-focusing the input
     *
     * @returns {boolean|boolean}
     */
    shouldShowEmailError() {
        return this.state.isEmailValidated && !this.isEmailValid();
    }

    /**
     * The user has unfocused the input, his password is ready to be validated
     */
    validatePassword = () => this.setState({isPasswordValidated: true});

    /**
     * Checks if the user has entered a password
     *
     * @returns {boolean}
     */
    isPasswordValid() {
        return this.state.password !== '';
    }

    /**
     * Checks if we should tell the user his password is invalid.
     * We should only show this if his password is invalid and has been checked when un-focusing the input
     *
     * @returns {boolean|boolean}
     */
    shouldShowPasswordError() {
        return this.state.isPasswordValidated && !this.isPasswordValid();
    }

    /**
     * If the email and password are valid, and we are not loading a request, then the login button can be enabled
     *
     * @returns {boolean}
     */
    shouldEnableLogin() {
        return this.isEmailValid() && this.isPasswordValid() && !this.state.loading;
    }

    /**
     * Called when the user input changes in the email or password field.
     * This saves the new value in the State and disabled input validation (to prevent errors to show while typing)
     *
     * @param isEmail True if the field is the email field
     * @param value The new field value
     */
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

    /**
     * Focuses the password field when the email field is done
     *
     * @returns {*}
     */
    onEmailSubmit = () => {
        if (this.passwordInputRef.current != null)
            this.passwordInputRef.current.focus();
    }

    /**
     * Called when the user clicks on login or finishes to type his password.
     *
     * Checks if we should allow the user to login,
     * then makes the login request and enters a loading state until the request finishes
     *
     */
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

    /**
     * Gets the form input
     *
     * @returns {*}
     */
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
                    ref={this.passwordInputRef}
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

    /**
     * Gets the card containing the input form
     * @returns {*}
     */
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

    /**
     * Gets the card containing the information about the Amicale account
     *
     * @returns {*}
     */
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
