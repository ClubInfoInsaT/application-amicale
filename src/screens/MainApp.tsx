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
import MainNavigator, { linking } from '../navigation/MainNavigator';
import { Platform, SafeAreaView, View } from 'react-native';
import { useDarkTheme } from '../context/preferencesContext';
import { CustomDarkTheme, CustomWhiteTheme } from '../utils/Themes';
import { setupStatusBar } from '../utils/Utils';
import { ParsedUrlDataType } from '../utils/URLHandler';

type Props = {
  defaultData?: ParsedUrlDataType;
};

function MainApp(props: Props, ref?: Ref<NavigationContainerRef<any>>) {
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
                <NavigationContainer theme={theme} ref={ref} linking={linking}>
                  <MainNavigator defaultData={props.defaultData} />
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
