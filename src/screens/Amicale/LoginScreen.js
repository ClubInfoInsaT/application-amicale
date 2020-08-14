// @flow

import * as React from 'react';
import {Image, KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {
  Button,
  Card,
  HelperText,
  TextInput,
  withTheme,
} from 'react-native-paper';
import i18n from 'i18n-js';
import {StackNavigationProp} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import ConnectionManager from '../../managers/ConnectionManager';
import ErrorDialog from '../../components/Dialogs/ErrorDialog';
import type {CustomThemeType} from '../../managers/ThemeManager';
import AsyncStorageManager from '../../managers/AsyncStorageManager';
import AvailableWebsites from '../../constants/AvailableWebsites';
import {MASCOT_STYLE} from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import CollapsibleScrollView from '../../components/Collapsible/CollapsibleScrollView';

type PropsType = {
  navigation: StackNavigationProp,
  route: {params: {nextScreen: string}},
  theme: CustomThemeType,
};

type StateType = {
  email: string,
  password: string,
  isEmailValidated: boolean,
  isPasswordValidated: boolean,
  loading: boolean,
  dialogVisible: boolean,
  dialogError: number,
  mascotDialogVisible: boolean,
};

const ICON_AMICALE = require('../../../assets/amicale.png');

const RESET_PASSWORD_PATH = 'https://www.amicale-insat.fr/password/reset';

const emailRegex = /^.+@.+\..+$/;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {},
  btnContainer: {
    marginTop: 5,
    marginBottom: 10,
  },
});

class LoginScreen extends React.Component<PropsType, StateType> {
  onEmailChange: (value: string) => void;

  onPasswordChange: (value: string) => void;

  passwordInputRef: {current: null | TextInput};

  nextScreen: string | null;

  constructor(props: PropsType) {
    super(props);
    this.passwordInputRef = React.createRef();
    this.onEmailChange = (value: string) => {
      this.onInputChange(true, value);
    };
    this.onPasswordChange = (value: string) => {
      this.onInputChange(false, value);
    };
    props.navigation.addListener('focus', this.onScreenFocus);
    this.state = {
      email: '',
      password: '',
      isEmailValidated: false,
      isPasswordValidated: false,
      loading: false,
      dialogVisible: false,
      dialogError: 0,
      mascotDialogVisible: AsyncStorageManager.getBool(
        AsyncStorageManager.PREFERENCES.loginShowMascot.key,
      ),
    };
  }

  onScreenFocus = () => {
    this.handleNavigationParams();
  };

  /**
   * Navigates to the Amicale website screen with the reset password link as navigation parameters
   */
  onResetPasswordClick = () => {
    const {navigation} = this.props;
    navigation.navigate('website', {
      host: AvailableWebsites.websites.AMICALE,
      path: RESET_PASSWORD_PATH,
      title: i18n.t('screens.websites.amicale'),
    });
  };

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
  };

  /**
   * Called when the user clicks on login or finishes to type his password.
   *
   * Checks if we should allow the user to login,
   * then makes the login request and enters a loading state until the request finishes
   *
   */
  onSubmit = () => {
    const {email, password} = this.state;
    if (this.shouldEnableLogin()) {
      this.setState({loading: true});
      ConnectionManager.getInstance()
        .connect(email, password)
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
  getFormInput(): React.Node {
    const {email, password} = this.state;
    return (
      <View>
        <TextInput
          label={i18n.t('screens.login.email')}
          mode="outlined"
          value={email}
          onChangeText={this.onEmailChange}
          onBlur={this.validateEmail}
          onSubmitEditing={this.onEmailSubmit}
          error={this.shouldShowEmailError()}
          textContentType="emailAddress"
          autoCapitalize="none"
          autoCompleteType="email"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
          secureTextEntry={false}
        />
        <HelperText type="error" visible={this.shouldShowEmailError()}>
          {i18n.t('screens.login.emailError')}
        </HelperText>
        <TextInput
          ref={this.passwordInputRef}
          label={i18n.t('screens.login.password')}
          mode="outlined"
          value={password}
          onChangeText={this.onPasswordChange}
          onBlur={this.validatePassword}
          onSubmitEditing={this.onSubmit}
          error={this.shouldShowPasswordError()}
          textContentType="password"
          autoCapitalize="none"
          autoCompleteType="password"
          autoCorrect={false}
          keyboardType="default"
          returnKeyType="done"
          secureTextEntry
        />
        <HelperText type="error" visible={this.shouldShowPasswordError()}>
          {i18n.t('screens.login.passwordError')}
        </HelperText>
      </View>
    );
  }

  /**
   * Gets the card containing the input form
   * @returns {*}
   */
  getMainCard(): React.Node {
    const {props, state} = this;
    return (
      <View style={styles.card}>
        <Card.Title
          title={i18n.t('screens.login.title')}
          titleStyle={{color: '#fff'}}
          subtitle={i18n.t('screens.login.subtitle')}
          subtitleStyle={{color: '#fff'}}
          left={({size}: {size: number}): React.Node => (
            <Image
              source={ICON_AMICALE}
              style={{
                width: size,
                height: size,
              }}
            />
          )}
        />
        <Card.Content>
          {this.getFormInput()}
          <Card.Actions style={{flexWrap: 'wrap'}}>
            <Button
              icon="lock-question"
              mode="contained"
              onPress={this.onResetPasswordClick}
              color={props.theme.colors.warning}
              style={{marginRight: 'auto', marginBottom: 20}}>
              {i18n.t('screens.login.resetPassword')}
            </Button>
            <Button
              icon="send"
              mode="contained"
              disabled={!this.shouldEnableLogin()}
              loading={state.loading}
              onPress={this.onSubmit}
              style={{marginLeft: 'auto'}}>
              {i18n.t('screens.login.title')}
            </Button>
          </Card.Actions>
          <Card.Actions>
            <Button
              icon="help-circle"
              mode="contained"
              onPress={this.showMascotDialog}
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
              }}>
              {i18n.t('screens.login.mascotDialog.title')}
            </Button>
          </Card.Actions>
        </Card.Content>
      </View>
    );
  }

  /**
   * The user has unfocused the input, his email is ready to be validated
   */
  validateEmail = () => {
    this.setState({isEmailValidated: true});
  };

  /**
   * The user has unfocused the input, his password is ready to be validated
   */
  validatePassword = () => {
    this.setState({isPasswordValidated: true});
  };

  hideMascotDialog = () => {
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.loginShowMascot.key,
      false,
    );
    this.setState({mascotDialogVisible: false});
  };

  showMascotDialog = () => {
    this.setState({mascotDialogVisible: true});
  };

  /**
   * Shows an error dialog with the corresponding login error
   *
   * @param error The error given by the login request
   */
  showErrorDialog = (error: number) => {
    this.setState({
      dialogVisible: true,
      dialogError: error,
    });
  };

  hideErrorDialog = () => {
    this.setState({dialogVisible: false});
  };

  /**
   * Navigates to the screen specified in navigation parameters or simply go back tha stack.
   * Saves in user preferences to not show the login banner again.
   */
  handleSuccess = () => {
    const {navigation} = this.props;
    // Do not show the home login banner again
    AsyncStorageManager.set(
      AsyncStorageManager.PREFERENCES.homeShowMascot.key,
      false,
    );
    if (this.nextScreen == null) navigation.goBack();
    else navigation.replace(this.nextScreen);
  };

  /**
   * Saves the screen to navigate to after a successful login if one was provided in navigation parameters
   */
  handleNavigationParams() {
    const {route} = this.props;
    if (route.params != null) {
      if (route.params.nextScreen != null)
        this.nextScreen = route.params.nextScreen;
      else this.nextScreen = null;
    }
  }

  /**
   * Checks if the entered email is valid (matches the regex)
   *
   * @returns {boolean}
   */
  isEmailValid(): boolean {
    const {email} = this.state;
    return emailRegex.test(email);
  }

  /**
   * Checks if we should tell the user his email is invalid.
   * We should only show this if his email is invalid and has been checked when un-focusing the input
   *
   * @returns {boolean|boolean}
   */
  shouldShowEmailError(): boolean {
    const {isEmailValidated} = this.state;
    return isEmailValidated && !this.isEmailValid();
  }

  /**
   * Checks if the user has entered a password
   *
   * @returns {boolean}
   */
  isPasswordValid(): boolean {
    const {password} = this.state;
    return password !== '';
  }

  /**
   * Checks if we should tell the user his password is invalid.
   * We should only show this if his password is invalid and has been checked when un-focusing the input
   *
   * @returns {boolean|boolean}
   */
  shouldShowPasswordError(): boolean {
    const {isPasswordValidated} = this.state;
    return isPasswordValidated && !this.isPasswordValid();
  }

  /**
   * If the email and password are valid, and we are not loading a request, then the login button can be enabled
   *
   * @returns {boolean}
   */
  shouldEnableLogin(): boolean {
    const {loading} = this.state;
    return this.isEmailValid() && this.isPasswordValid() && !loading;
  }

  render(): React.Node {
    const {mascotDialogVisible, dialogVisible, dialogError} = this.state;
    return (
      <LinearGradient
        style={{
          height: '100%',
        }}
        colors={['#9e0d18', '#530209']}
        start={{x: 0, y: 0.1}}
        end={{x: 0.1, y: 1}}>
        <KeyboardAvoidingView
          behavior="height"
          contentContainerStyle={styles.container}
          style={styles.container}
          enabled
          keyboardVerticalOffset={100}>
          <CollapsibleScrollView>
            <View style={{height: '100%'}}>{this.getMainCard()}</View>
            <MascotPopup
              visible={mascotDialogVisible}
              title={i18n.t('screens.login.mascotDialog.title')}
              message={i18n.t('screens.login.mascotDialog.message')}
              icon="help"
              buttons={{
                action: null,
                cancel: {
                  message: i18n.t('screens.login.mascotDialog.button'),
                  icon: 'check',
                  onPress: this.hideMascotDialog,
                },
              }}
              emotion={MASCOT_STYLE.NORMAL}
            />
            <ErrorDialog
              visible={dialogVisible}
              onDismiss={this.hideErrorDialog}
              errorCode={dialogError}
            />
          </CollapsibleScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  }
}

export default withTheme(LoginScreen);
