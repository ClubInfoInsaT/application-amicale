import React, { useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  TextInput as RNTextInput,
} from 'react-native';
import {
  Button,
  Card,
  HelperText,
  TextInput,
  useTheme,
} from 'react-native-paper';
import i18n from 'i18n-js';
import GENERAL_STYLES from '../../../constants/Styles';

type Props = {
  loading: boolean;
  onSubmit: (email: string, password: string) => void;
  onHelpPress: () => void;
  onResetPasswordPress: () => void;
};

const ICON_AMICALE = require('../../../../assets/amicale.png');

const styles = StyleSheet.create({
  card: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  text: {
    color: '#ffffff',
  },
  buttonContainer: {
    flexWrap: 'wrap',
  },
  lockButton: {
    marginRight: 'auto',
    marginBottom: 20,
  },
  sendButton: {
    marginLeft: 'auto',
  },
});

const emailRegex = /^.+@.+\..+$/;

/**
 * Checks if the entered email is valid (matches the regex)
 *
 * @returns {boolean}
 */
function isEmailValid(email: string): boolean {
  return emailRegex.test(email);
}

/**
 * Checks if the user has entered a password
 *
 * @returns {boolean}
 */
function isPasswordValid(password: string): boolean {
  return password !== '';
}

export default function LoginForm(props: Props) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValidated, setIsEmailValidated] = useState(false);
  const [isPasswordValidated, setIsPasswordValidated] = useState(false);
  const passwordRef = useRef<RNTextInput>(null);
  /**
   * Checks if we should tell the user his email is invalid.
   * We should only show this if his email is invalid and has been checked when un-focusing the input
   *
   * @returns {boolean|boolean}
   */
  const shouldShowEmailError = () => {
    return isEmailValidated && !isEmailValid(email);
  };

  /**
   * Checks if we should tell the user his password is invalid.
   * We should only show this if his password is invalid and has been checked when un-focusing the input
   *
   * @returns {boolean|boolean}
   */
  const shouldShowPasswordError = () => {
    return isPasswordValidated && !isPasswordValid(password);
  };

  const onEmailSubmit = () => {
    if (passwordRef.current) {
      passwordRef.current.focus();
    }
  };

  /**
   * The user has unfocused the input, his email is ready to be validated
   */
  const validateEmail = () => setIsEmailValidated(true);

  /**
   * The user has unfocused the input, his password is ready to be validated
   */
  const validatePassword = () => setIsPasswordValidated(true);

  const onEmailChange = (value: string) => {
    if (isEmailValidated) {
      setIsEmailValidated(false);
    }
    setEmail(value);
  };

  const onPasswordChange = (value: string) => {
    if (isPasswordValidated) {
      setIsPasswordValidated(false);
    }
    setPassword(value);
  };

  const shouldEnableLogin = () => {
    return isEmailValid(email) && isPasswordValid(password) && !props.loading;
  };

  const onSubmit = () => {
    if (shouldEnableLogin()) {
      props.onSubmit(email, password);
    }
  };

  return (
    <View style={styles.card}>
      <Card.Title
        title={i18n.t('screens.login.title')}
        titleStyle={styles.text}
        subtitle={i18n.t('screens.login.subtitle')}
        subtitleStyle={styles.text}
        left={({ size }) => (
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
        <View>
          <TextInput
            label={i18n.t('screens.login.email')}
            mode={'outlined'}
            value={email}
            onChangeText={onEmailChange}
            onBlur={validateEmail}
            onSubmitEditing={onEmailSubmit}
            error={shouldShowEmailError()}
            textContentType={'emailAddress'}
            autoCapitalize={'none'}
            autoComplete={'email'}
            autoCorrect={false}
            keyboardType={'email-address'}
            returnKeyType={'next'}
            secureTextEntry={false}
          />
          <HelperText type={'error'} visible={shouldShowEmailError()}>
            {i18n.t('screens.login.emailError')}
          </HelperText>
          <TextInput
            ref={passwordRef}
            label={i18n.t('screens.login.password')}
            mode={'outlined'}
            value={password}
            onChangeText={onPasswordChange}
            onBlur={validatePassword}
            onSubmitEditing={onSubmit}
            error={shouldShowPasswordError()}
            textContentType={'password'}
            autoCapitalize={'none'}
            autoComplete={'password'}
            autoCorrect={false}
            keyboardType={'default'}
            returnKeyType={'done'}
            secureTextEntry={true}
          />
          <HelperText type={'error'} visible={shouldShowPasswordError()}>
            {i18n.t('screens.login.passwordError')}
          </HelperText>
        </View>
        <Card.Actions style={styles.buttonContainer}>
          <Button
            icon="lock-question"
            mode="contained"
            onPress={props.onResetPasswordPress}
            color={theme.colors.warning}
            style={styles.lockButton}
          >
            {i18n.t('screens.login.resetPassword')}
          </Button>
          <Button
            icon="send"
            mode="contained"
            disabled={!shouldEnableLogin()}
            loading={props.loading}
            onPress={onSubmit}
            style={styles.sendButton}
          >
            {i18n.t('screens.login.title')}
          </Button>
        </Card.Actions>
        <Card.Actions>
          <Button
            icon="help-circle"
            mode="contained"
            onPress={props.onHelpPress}
            style={GENERAL_STYLES.centerHorizontal}
          >
            {i18n.t('screens.login.mascotDialog.title')}
          </Button>
        </Card.Actions>
      </Card.Content>
    </View>
  );
}
