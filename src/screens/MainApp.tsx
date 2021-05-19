import React, { Ref, useEffect } from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import GENERAL_STYLES from '../constants/Styles';
import CollapsibleProvider from '../components/providers/CollapsibleProvider';
import CacheProvider from '../components/providers/CacheProvider';
import { OverflowMenuProvider } from 'react-navigation-header-buttons';
import MainNavigator from '../navigation/MainNavigator';
import { Platform, SafeAreaView, View } from 'react-native';
import { useDarkTheme } from '../context/preferencesContext';
import { CustomDarkTheme, CustomWhiteTheme } from '../utils/Themes';
import { setupStatusBar } from '../utils/Utils';

type Props = {
  defaultHomeRoute?: string;
  defaultHomeData?: { [key: string]: string };
};

function MainApp(props: Props, ref?: Ref<NavigationContainerRef>) {
  const darkTheme = useDarkTheme();
  const theme = darkTheme ? CustomDarkTheme : CustomWhiteTheme;

  useEffect(() => {
    if (Platform.OS === 'ios') {
      setTimeout(setupStatusBar, 1000);
    } else {
      setupStatusBar(theme);
    }
  }, [theme]);

  return (
    <PaperProvider theme={theme}>
      <CollapsibleProvider>
        <CacheProvider>
          <OverflowMenuProvider>
            <View
              style={{
                backgroundColor: theme.colors.background,
                ...GENERAL_STYLES.flex,
              }}
            >
              <SafeAreaView style={GENERAL_STYLES.flex}>
                <NavigationContainer theme={theme} ref={ref}>
                  <MainNavigator
                    defaultHomeRoute={props.defaultHomeRoute}
                    defaultHomeData={props.defaultHomeData}
                  />
                </NavigationContainer>
              </SafeAreaView>
            </View>
          </OverflowMenuProvider>
        </CacheProvider>
      </CollapsibleProvider>
    </PaperProvider>
  );
}

export default React.forwardRef(MainApp);
