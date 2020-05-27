// @flow

import * as React from 'react';
import {useTheme} from "react-native-paper";
import {createCollapsibleStack} from "react-navigation-collapsible";
import StackNavigator, {StackNavigationOptions} from "@react-navigation/stack";

export function createScreenCollapsibleStack(
    name: string,
    Stack: StackNavigator,
    component: React.Node,
    title: string,
    useNativeDriver?: boolean,
    options?: StackNavigationOptions) {
    const {colors} = useTheme();
    const screenOptions = options != null ? options : {};
    return createCollapsibleStack(
        <Stack.Screen
            name={name}
            component={component}
            options={{
                title: title,
                headerStyle: {
                    backgroundColor: colors.surface,
                },
                ...screenOptions,
            }}
        />,
        {
            collapsedColor: colors.surface,
            useNativeDriver: useNativeDriver != null ? useNativeDriver : true, // native driver does not work with webview
        }
    )
}

export function getWebsiteStack(name: string, Stack: any, component: any, title: string) {
    return createScreenCollapsibleStack(name, Stack, component, title, false);
}