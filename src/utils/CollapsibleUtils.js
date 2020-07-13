// @flow

import * as React from 'react';
import {useTheme} from "react-native-paper";
import {createCollapsibleStack} from "react-navigation-collapsible";
import StackNavigator, {StackNavigationOptions} from "@react-navigation/stack";

/**
 * Creates a navigation stack with the collapsible library, allowing the header to collapse on scroll.
 *
 * Please use the getWebsiteStack function if your screen uses a webview as their main component as it needs special parameters.
 *
 * @param name The screen name in the navigation stack
 * @param Stack The stack component
 * @param component The screen component
 * @param title The screen title shown in the header (needs to be translated)
 * @param useNativeDriver Whether to use the native driver for animations.
 * Set to false if the screen uses a webview as this component does not support native driver.
 * In all other cases, set it to true for increase performance.
 * @param options Screen options to use, or null if no options are necessary.
 * @param headerColor The color of the header. Uses default color if not specified
 * @returns {JSX.Element}
 */
export function createScreenCollapsibleStack(
    name: string,
    Stack: StackNavigator,
    component: React.Node,
    title: string,
    useNativeDriver?: boolean,
    options?: StackNavigationOptions,
    headerColor?: string) {
    const {colors} = useTheme();
    const screenOptions = options != null ? options : {};
    return createCollapsibleStack(
        <Stack.Screen
            name={name}
            component={component}
            options={{
                title: title,
                headerStyle: {
                    backgroundColor: headerColor!=null ? headerColor :colors.surface,
                },
                ...screenOptions,
            }}
        />,
        {
            collapsedColor: headerColor!=null ? headerColor :colors.surface,
            useNativeDriver: useNativeDriver != null ? useNativeDriver : true, // native driver does not work with webview
        }
    )
}

/**
 * Creates a navigation stack with the collapsible library, allowing the header to collapse on scroll.
 *
 * This is a preset for screens using a webview as their main component, as it uses special parameters to work.
 * (aka a dirty workaround)
 *
 * @param name
 * @param Stack
 * @param component
 * @param title
 * @returns {JSX.Element}
 */
export function getWebsiteStack(name: string, Stack: any, component: any, title: string) {
    return createScreenCollapsibleStack(name, Stack, component, title, false);
}
