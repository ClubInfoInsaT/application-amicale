// @flow

import * as React from 'react';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {Avatar, Button, Card, HelperText, Text, TextInput, withTheme} from 'react-native-paper';
import ConnectionManager, {ERROR_TYPE} from "../../managers/ConnectionManager";
import {openBrowser} from "../../utils/WebBrowser";

type Props = {
    navigation: Object,
}

type State = {
    email: string,
    password: string,
    isEmailValidated: boolean,
    isPasswordValidated: boolean,
    loading: boolean,
}

const ICON_AMICALE = require('../../assets/amicale.png');

const RESET_PASSWORD_LINK = "https://www.amicale-insat.fr/password/reset";

const emailRegex = /^.+@.+\..+$/;

class LoginScreen extends React.Component<Props, State> {

    state = {
        email: '',
        password: '',
        isEmailValidated: false,
        isPasswordValidated: false,
        loading: false,
    };

    colors: Object;

    onEmailChange: Function;
    onPasswordChange: Function;
    validateEmail: Function;
    validatePassword: Function;
    onSubmit: Function;
    onEmailSubmit: Function;
    onResetPasswordClick: Function;

    passwordInputRef: Object;

    constructor(props) {
        super(props);
        this.onEmailChange = this.onInputChange.bind(this, true);
        this.onPasswordChange = this.onInputChange.bind(this, false);
        this.validateEmail = this.validateEmail.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onEmailSubmit = this.onEmailSubmit.bind(this);
        this.onResetPasswordClick = this.onResetPasswordClick.bind(this);
        this.colors = props.theme.colors;
    }

    onResetPasswordClick() {
        openBrowser(RESET_PASSWORD_LINK, this.colors.primary);
    }

    validateEmail() {
        this.setState({isEmailValidated: true});
    }

    isEmailValid() {
        return emailRegex.test(this.state.email);
    }

    shouldShowEmailError() {
        return this.state.isEmailValidated && !this.isEmailValid();
    }

    validatePassword() {
        this.setState({isPasswordValidated: true});
    }

    isPasswordValid() {
        return this.state.password !== '';
    }

    shouldShowPasswordError() {
        return this.state.isPasswordValidated && !this.isPasswordValid();
    }

    shouldEnableLogin() {
        return this.isEmailValid() && this.isPasswordValid();
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

    onEmailSubmit() {
        this.passwordInputRef.focus();
    }

    onSubmit() {
        if (this.shouldEnableLogin()) {
            this.setState({loading: true});
            ConnectionManager.getInstance().connect(this.state.email, this.state.password)
                .then((data) => {
                    console.log(data);
                    Alert.alert('COOL', 'ÇA MARCHE');
                })
                .catch((error) => {
                    this.handleErrors(error);
                })
                .finally(() => {
                    this.setState({loading: false});
                });
        }
    }

    handleErrors(error: number) {
        switch (error) {
            case ERROR_TYPE.CONNECTION_ERROR:
                Alert.alert('ERREUR', 'PB DE CONNEXION');
                break;
            case ERROR_TYPE.BAD_CREDENTIALS:
                Alert.alert('ERREUR', 'MDP OU MAIL INVALIDE');
                break;
            case ERROR_TYPE.SAVE_TOKEN:
                Alert.alert('ERREUR', 'IMPOSSIBLE DE SAUVEGARDER INFOS CONNEXION');
                break;
            default:
                Alert.alert('ERREUR', 'ERREUR INCONNUE. CONTACTER ARNAUD');
                break;

        }
    }

    getFormInput() {
        return (
            <View>
                <TextInput
                    label='Email'
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
                    EMAIL INVALID
                </HelperText>
                <TextInput
                    ref={(ref) => {
                        this.passwordInputRef = ref;
                    }}
                    label='Password'
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
                    PLS ENTER PASSWORD
                </HelperText>
            </View>
        );
    }

    getMainCard() {
        return (
            <Card style={styles.card}>
                <Card.Title
                    title="COUCOU"
                    subtitle="ENTREZ VOS IDENTIFIANTS"
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
                            LOGIN
                        </Button>
                    </Card.Actions>
                </Card.Content>
            </Card>
        );
    }

    getSecondaryCard() {
        return (
            <Card style={styles.card}>
                <Card.Content>
                    <Text>MDP OUBLIÉ ? t'es pas doué</Text>
                    <View style={styles.btnContainer}>
                        <Button
                            icon="reload"
                            mode="contained"
                            onPress={this.onResetPasswordClick}
                            style={{marginLeft: 'auto'}}>
                            RESET MDP
                        </Button>
                    </View>
                    <Text>PAS DE COMPTE ? DOMMAGE PASSE À L'AMICALE</Text>
                </Card.Content>
            </Card>
        );
    }

    render() {
        return (
            <KeyboardAvoidingView
                behavior={"height"}
                contentContainerStyle={styles.container}
                style={styles.container}
                enabled
                keyboardVerticalOffset={100}
            >
                <ScrollView>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View>
                            {this.getMainCard()}
                            {this.getSecondaryCard()}
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
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

export default withTheme(LoginScreen);
