import * as React from 'react';
import {withTheme} from 'react-native-paper';
import TabIcon from "./TabIcon";
import TabHomeIcon from "./TabHomeIcon";
import {AnimatedValue} from "react-native-reanimated";
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

/**
 * Abstraction layer for Agenda component, using custom configuration
 */
class CustomTabBar extends React.Component<Props, State> {

    static TAB_BAR_HEIGHT = 48;

    barSynced: boolean; // Is the bar synced with the header for animations?

    state = {
        translateY: new Animated.Value(0),
    }

    // shouldComponentUpdate(nextProps: Props): boolean {
    //     return (nextProps.theme.dark !== this.props.theme.dark)
    //         || (nextProps.state.index !== this.props.state.index);
    // }

    tabRef: Object;

    constructor() {
        super();
        this.tabRef = React.createRef();
        this.barSynced = false;
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

    onRouteChange = () => {
        this.barSynced = false;
    }

    render() {
        const state = this.props.state;
        const descriptors = this.props.descriptors;
        const navigation = this.props.navigation;
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
                {state.routes.map((route, index) => {
                    const {options} = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                            ? options.title
                            : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => this.onItemPress(route, state.index, index);

                    const onLongPress = () => {
                        navigation.emit({
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

                    const color = isFocused ? options.activeColor : options.inactiveColor;
                    const iconData = {focused: isFocused, color: color};
                    if (route.name !== "home") {
                        return <TabIcon
                            onPress={onPress}
                            onLongPress={onLongPress}
                            icon={options.tabBarIcon(iconData)}
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
                })}
            </Animated.View>
        );
    }
}

export default withTheme(CustomTabBar);
