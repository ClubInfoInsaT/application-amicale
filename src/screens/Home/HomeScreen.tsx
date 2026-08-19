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

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ScrollView,
  //  NativeScrollEvent,
  //  NativeSyntheticEvent,
  StyleSheet,
} from 'react-native';
import Feed from '../../components/Home/Feed';
import i18n from 'i18n-js';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';
import { View } from 'react-native-animatable';
import ActionsDashBoardItem from '../../components/Home/ActionsDashboardItem';
import MaterialHeaderButtons, {
  Item,
} from '../../components/Overrides/CustomHeaderButton';
import LogoutDialog from '../../components/Amicale/LogoutDialog';
import { MASCOT_STYLE } from '../../components/Mascot/Mascot';
import MascotPopup from '../../components/Mascot/MascotPopup';
import GENERAL_STYLES from '../../constants/Styles';
import { TabRoutes, TabStackParamsList } from '../../navigation/TabNavigator';
import { useCurrentDashboard } from '../../context/preferencesContext';
import { MainRoutes } from '../../navigation/MainNavigator';
import { useLoginState } from '../../context/loginContext';
import DashboardShortcuts from '../../components/Home/DashboardShortcuts';

type Props = StackScreenProps<TabStackParamsList, TabRoutes.Home>;

const styles = StyleSheet.create({
  sectionHeader: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 10,
  },
  sectionHeaderEmpty: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  activityIndicator: {
    marginTop: 10,
  },
  content: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

function HomeScreen(props: Props) {
  const theme = useTheme();
  const navigation = useNavigation();

  const [dialogVisible, setDialogVisible] = useState(false);
  const pageLoaded = useRef(false);

  const isLoggedIn = useLoginState();
  const { currentDashboard } = useCurrentDashboard();

  useLayoutEffect(() => {
    const getHeaderButton = () => {
      return (
        <MaterialHeaderButtons>
          <Item
            title={i18n.t('screens.settings.title')}
            iconName={'cog'}
            onPress={() => navigation.navigate(MainRoutes.Settings)}
          />
        </MaterialHeaderButtons>
      );
    };
    navigation.setOptions({
      headerRight: getHeaderButton,
    });
  }, [navigation]);

  useEffect(() => {
    if (!pageLoaded.current) {
      const { route } = props;
      if (route.params != null) {
        if (route.params.route != null) {
          pageLoaded.current = true;
          navigation.navigate(route.params.route, route.params.data);
          // reset params to prevent infinite loop
          navigation.setParams({ route: null, data: null });
        }
      }
    }
  }, [navigation, props, pageLoaded]);

  const getListHeader = () => {
    return (
      <Animatable.View animation="fadeInDown" duration={500} useNativeDriver>
        <ActionsDashBoardItem />
        <DashboardShortcuts services={currentDashboard} />
      </Animatable.View>
    );
  };

  const hideDisconnectDialog = () => setDialogVisible(false);

  /**
   * Callback when pressing the login button on the banner.
   * This hides the banner and takes the user to the login page.
   */
  const onLogin = () =>
    navigation.navigate(MainRoutes.Login, {
      nextScreen: 'profile',
    });

  return (
    <View style={GENERAL_STYLES.flex}>
      <ScrollView style={styles.content}>
        {getListHeader()}
        <Feed />
      </ScrollView>
      {!isLoggedIn ? (
        <MascotPopup
          title={i18n.t('screens.home.mascotDialog.title')}
          message={i18n.t('screens.home.mascotDialog.message')}
          icon="human-greeting"
          buttons={{
            action: {
              message: i18n.t('screens.home.mascotDialog.login'),
              icon: 'login',
              onPress: onLogin,
            },
            cancel: {
              message: i18n.t('screens.home.mascotDialog.later'),
              icon: 'close',
              color: theme.colors.warning,
            },
          }}
          emotion={MASCOT_STYLE.CUTE}
        />
      ) : null}
      <LogoutDialog visible={dialogVisible} onDismiss={hideDisconnectDialog} />
    </View>
  );
}

export default HomeScreen;
