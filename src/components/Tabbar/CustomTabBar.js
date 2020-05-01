import * as React from 'react';
import {withTheme} from 'react-native-paper';
import TabIcon from "./TabIcon";
import TabHomeIcon from "./TabHomeIcon";
import {Animated} from 'react-native';

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

/**
 * Abstraction layer for Agenda component, using custom configuration
 */
class CustomTabBar extends React.Component<Props, State> {

    static TAB_BAR_HEIGHT = 48;

    state = {
        translateY: new Animated.Value(0),
        barSynced: false,// Is the bar synced with the header for animations?
    }

    tabRef: Object;

    constructor(props) {
        super(props);
        this.tabRef = React.createRef();
    }

    onItemPress(route: Object, currentIndex: number, destIndex: number) {
        const event = this.props.navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });
        if (currentIndex !== destIndex && !event.defaultPrevented) {
            this.state.translateY = new Animated.Value(0);
            this.props.navigation.navigate(route.name);
        }
    }

    onItemLongPress(route: Object) {
        const event = this.props.navigation.emit({
            type: 'tabLongPress',
            target: route.key,
            canPreventDefault: true,
        });
        if (route.name === "home" && !event.defaultPrevented) {
            this.props.navigation.navigate('tetris');
        }
    }

    tabBarIcon = (route, focused) => {
    let icon = TAB_ICONS[route.name];
    icon = focused ? icon : icon + ('-outline');
    if (route.name !== "home")
    return icon;
    else
    return null;
};


    onRouteChange = () => {
        this.setState({barSynced: false});
    }

    renderIcon = (route, index) => {
        const state = this.props.state;
        const {options} = this.props.descriptors[route.key];
        const label =
            options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

        const isFocused = state.index === index;

        const onPress = () => this.onItemPress(route, state.index, index);

        const onLongPress = () => this.onItemLongPress(route);

        if (isFocused) {
            const stackState = route.state;
            const stackRoute = route.state ? stackState.routes[stackState.index] : undefined;
            const params = stackRoute ? stackRoute.params : undefined;
            const collapsible = params ? params.collapsible : undefined;
            if (collapsible && !this.state.barSynced) {
                this.setState({
                    translateY: Animated.multiply(-1.5, collapsible.translateY),
                    barSynced: true,
                });
            }
        }

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

    render() {
        this.props.navigation.addListener('state', this.onRouteChange);
        return (
            <Animated.View
                ref={this.tabRef}
                // animation={"fadeInUp"}
                // duration={500}
                // useNativeDriver
                style={{
                    flexDirection: 'row',
                    height: CustomTabBar.TAB_BAR_HEIGHT,
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    backgroundColor: this.props.theme.colors.surface,
                    transform: [{translateY: this.state.translateY}]
                }}
            >
                {this.props.state.routes.map(this.renderIcon)}
            </Animated.View>
        );
    }
}

export default withTheme(CustomTabBar);
