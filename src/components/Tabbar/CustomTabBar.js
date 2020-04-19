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
}

const TAB_ICONS = {
    planning: 'calendar-range',
    proxiwash: 'tshirt-crew',
    proximo: 'cart',
    planex: 'clock',
};

/**
 * Abstraction layer for Agenda component, using custom configuration
 */
class CustomTabBar extends React.Component<Props, State> {

    static TAB_BAR_HEIGHT = 48;

    barSynced: boolean; // Is the bar synced with the header for animations?
    activeColor: string;
    inactiveColor: string;

    state = {
        translateY: new Animated.Value(0),
    }

    // shouldComponentUpdate(nextProps: Props): boolean {
    //     return (nextProps.theme.dark !== this.props.theme.dark)
    //         || (nextProps.state.index !== this.props.state.index);
    // }

    tabRef: Object;

    constructor(props) {
        super(props);
        this.tabRef = React.createRef();
        this.barSynced = false;
        this.activeColor = props.theme.colors.primary;
        this.inactiveColor = props.theme.colors.tabIcon;
    }

    onItemPress(route: Object, currentIndex: number, destIndex: number) {
        const event = this.props.navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });
        if (currentIndex !== destIndex && !event.defaultPrevented) {
            this.state.translateY = new Animated.Value(0);
            this.props.navigation.navigate(route.name, {
                screen: 'index',
                params: {animationDir: currentIndex < destIndex ? "right" : "left"}
            });
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
        this.barSynced = false;
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

        const onLongPress = () => {
            this.props.navigation.emit({
                type: 'tabLongPress',
                target: route.key,
            });
        };
        if (isFocused) {
            const stackState = route.state;
            const stackRoute = route.state ? stackState.routes[stackState.index] : undefined;
            const params = stackRoute ? stackRoute.params : undefined;
            const collapsible = params ? params.collapsible : undefined;
            if (collapsible && !this.barSynced) {
                this.barSynced = true;
                this.setState({translateY: Animated.multiply(-1.5, collapsible.translateY)});
            }
        }

        const color = isFocused ? this.activeColor : this.inactiveColor;
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
