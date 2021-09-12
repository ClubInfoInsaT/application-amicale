/*
 * Copyright (c) 2019 - 2020 Arnaud Vergnet.
 *
 * This file is part of Campus INSAT.
 *
 * Campus INSAT is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Campus INSAT is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Campus INSAT.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import i18n from 'i18n-js';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import ErrorDialog from '../../components/Dialogs/ErrorDialog';
import { MASCOT_STYLE } from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import CollapsibleScrollView from '../../components/Collapsible/CollapsibleScrollView';
import {
  MainRoutes,
  MainStackParamsList,
} from '../../navigation/MainNavigator';
import GENERAL_STYLES from '../../constants/Styles';
import Urls from '../../constants/Urls';
import { ApiRejectType, connectToAmicale } from '../../utils/WebData';
import { REQUEST_STATUS } from '../../utils/Requests';
import LoginForm from '../../components/Amicale/Login/LoginForm';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TabRoutes } from '../../navigation/TabNavigator';
import { useShouldShowMascot } from '../../context/preferencesContext';
import { useLogin } from '../../context/loginContext';

type Props = StackScreenProps<MainStackParamsList, MainRoutes.Login>;

function LoginScreen(props: Props) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { setLogin } = useLogin();
  const [loading, setLoading] = useState(false);
  const [nextScreen, setNextScreen] = useState<string | undefined>(undefined);
  const [mascotDialogVisible, setMascotDialogVisible] = useState<
    undefined | boolean
  >(undefined);
  const [currentError, setCurrentError] = useState<ApiRejectType>({
    status: REQUEST_STATUS.SUCCESS,
  });
  const homeMascot = useShouldShowMascot(TabRoutes.Home);

  useFocusEffect(
    useCallback(() => {
      setNextScreen(props.route.params?.nextScreen);
    }, [props.route.params])
  );

  const onResetPasswordClick = () => {
    navigation.navigate(MainRoutes.Website, {
      host: Urls.websites.amicale,
      path: Urls.amicale.resetPassword,
      title: i18n.t('screens.websites.amicale'),
    });
  };

  /**
   * Called when the user clicks on login or finishes to type his password.
   *
   * Checks if we should allow the user to login,
   * then makes the login request and enters a loading state until the request finishes
   *
   */
  const onSubmit = (email: string, password: string) => {
    setLoading(true);
    connectToAmicale(email, password)
      .then(handleSuccess)
      .catch(setCurrentError)
      .finally(() => setLoading(false));
  };

  const hideMascotDialog = () => setMascotDialogVisible(false);

  const showMascotDialog = () => setMascotDialogVisible(true);

  const hideErrorDialog = () =>
    setCurrentError({ status: REQUEST_STATUS.SUCCESS });

  /**
   * Navigates to the screen specified in navigation parameters or simply go back tha stack.
   * Saves in user preferences to not show the login banner again.
   */
  const handleSuccess = (token: string) => {
    // Do not show the home login banner again
    if (homeMascot.shouldShow) {
      homeMascot.setShouldShow(false);
    }
    setLogin(token);
    if (!nextScreen) {
      navigation.goBack();
    } else {
      navigation.replace(nextScreen);
    }
  };

  return (
    <LinearGradient
      style={GENERAL_STYLES.flex}
      colors={['#9e0d18', '#530209']}
      start={{ x: 0, y: 0.1 }}
      end={{ x: 0.1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={'height'}
        contentContainerStyle={GENERAL_STYLES.flex}
        style={GENERAL_STYLES.flex}
        enabled={true}
        keyboardVerticalOffset={100}
      >
        <CollapsibleScrollView headerColors={'transparent'}>
          <View style={GENERAL_STYLES.flex}>
            <LoginForm
              loading={loading}
              onSubmit={onSubmit}
              onResetPasswordPress={onResetPasswordClick}
              onHelpPress={showMascotDialog}
            />
          </View>
          <MascotPopup
            visible={mascotDialogVisible}
            title={i18n.t('screens.login.mascotDialog.title')}
            message={i18n.t('screens.login.mascotDialog.message')}
            icon={'help'}
            buttons={{
              cancel: {
                message: i18n.t('screens.login.mascotDialog.button'),
                icon: 'check',
                onPress: hideMascotDialog,
              },
            }}
            emotion={MASCOT_STYLE.NORMAL}
          />
          <ErrorDialog
            visible={
              currentError.status !== REQUEST_STATUS.SUCCESS ||
              currentError.code !== undefined
            }
            onDismiss={hideErrorDialog}
            status={currentError.status}
            code={currentError.code}
          />
        </CollapsibleScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

export default LoginScreen;
