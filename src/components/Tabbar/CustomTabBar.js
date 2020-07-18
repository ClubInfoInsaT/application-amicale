import * as React from 'react';
import {withTheme} from 'react-native-paper';
import TabIcon from "./TabIcon";
import TabHomeIcon from "./TabHomeIcon";
import {Animated} from 'react-native';
import {Collapsible} from "react-navigation-collapsible";

type Props = {
    state: Object,
    descriptors: Object,
    navigation: Object,
    theme: Object,
    collapsibleStack: Object,
}

type State = {
    translateY: AnimatedValue,
    barSynced: boolean,
}

const TAB_ICONS = {
    proxiwash: 'tshirt-crew',
    services: 'account-circle',
    planning: 'calendar-range',
    planex: 'clock',
};

class CustomTabBar extends React.Component<Props, State> {

    static TAB_BAR_HEIGHT = 48;

    state = {
        translateY: new Animated.Value(0),
    }

    syncTabBar = (route, index) => {
        const state = this.props.state;
        const isFocused = state.index === index;
        if (isFocused) {
            const stackState = route.state;
            const stackRoute = stackState ? stackState.routes[stackState.index] : undefined;
            const params: { collapsible: Collapsible } = stackRoute ? stackRoute.params : undefined;
            const collapsible = params ? params.collapsible : undefined;
            if (collapsible) {
                this.setState({
                    translateY: Animated.multiply(-1.5, collapsible.translateY), // Hide tab bar faster than header bar
                });
            }
        }
    };

    /**
     * Navigates to the given route if it is different from the current one
     *
     * @param route Destination route
     * @param currentIndex The current route index
     * @param destIndex The destination route index
     */
    onItemPress(route: Object, currentIndex: number, destIndex: number) {
        const event = this.props.navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });
        if (currentIndex !== destIndex && !event.defaultPrevented)
            this.props.navigation.navigate(route.name);
    }

    /**
     * Navigates to tetris screen on home button long press
     *
     * @param route
     */
    onItemLongPress(route: Object) {
        const event = this.props.navigation.emit({
            type: 'tabLongPress',
            target: route.key,
            canPreventDefault: true,
        });
        if (route.name === "home" && !event.defaultPrevented)
            this.props.navigation.navigate('game-start');
    }

    /**
     * Gets an icon for the given route if it is not the home one as it uses a custom button
     *
     * @param route
     * @param focused
     * @returns {null}
     */
    tabBarIcon = (route, focused) => {
        let icon = TAB_ICONS[route.name];
        icon = focused ? icon : icon + ('-outline');
        if (route.name !== "home")
            return icon;
        else
            return null;
    };

    /**
     * Finds the active route and syncs the tab bar animation with the header bar
     */
    onRouteChange = () => {
        this.props.state.routes.map(this.syncTabBar)
    }

    /**
     * Gets a tab icon render.
     * If the given route is focused, it syncs the tab bar and header bar animations together
     *
     * @param route The route for the icon
     * @param index The index of the current route
     * @returns {*}
     */
    renderIcon = (route, index) => {
        const state = this.props.state;
        const {options} = this.props.descriptors[route.key];
        const label =
            options.tabBarLabel != null
                ? options.tabBarLabel
                : options.title != null
                ? options.title
                : route.name;

        const onPress = () => this.onItemPress(route, state.index, index);
        const onLongPress = () => this.onItemLongPress(route);
        const isFocused = state.index === index;

        const color = isFocused ? this.props.theme.colors.primary : this.props.theme.colors.tabIcon;
        if (route.name !== "home") {
            return <TabIcon
                onPress={onPress}
                onLongPress={onLongPress}
                icon={this.tabBarIcon(route, isFocused)}
                color={color}
                label={label}
                focused={isFocused}
                extraData={state.index > index}
                key={route.key}
            />
        } else
            return <TabHomeIcon
                onPress={onPress}
                onLongPress={onLongPress}
                focused={isFocused}
                key={route.key}
                tabBarHeight={CustomTabBar.TAB_BAR_HEIGHT}
            />
    };

    getIcons() {
        return this.props.state.routes.map(this.renderIcon);
    }

    render() {
        this.props.navigation.addListener('state', this.onRouteChange);
        const icons = this.getIcons();
        return (
            <Animated.View
                useNativeDriver
                style={{
                    flexDirection: 'row',
                    height: CustomTabBar.TAB_BAR_HEIGHT,
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    backgroundColor: this.props.theme.colors.surface,
                    transform: [{translateY: this.state.translateY}],
                }}
            >
                {icons}
            </Animated.View>
        );
    }
}

export default withTheme(CustomTabBar);
