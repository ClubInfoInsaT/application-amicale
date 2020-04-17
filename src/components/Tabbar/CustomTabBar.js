import * as React from 'react';
import {withTheme} from 'react-native-paper';
import TabIcon from "./TabIcon";
import TabHomeIcon from "./TabHomeIcon";
import * as Animatable from 'react-native-animatable';

type Props = {
    state: Object,
    descriptors: Object,
    navigation: Object,
    theme: Object,
}

const TAB_BAR_HEIGHT = 48;

/**
 * Abstraction layer for Agenda component, using custom configuration
 */
class CustomTabBar extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Props): boolean {
        return (nextProps.theme.dark !== this.props.theme.dark)
            || (nextProps.state.index !== this.props.state.index);
    }

    onItemPress(route: Object, currentIndex: number, destIndex: number) {
        const event = this.props.navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });
        if (currentIndex !== destIndex && !event.defaultPrevented) {
            this.props.navigation.navigate(route.name, {
                screen: 'index',
                params: {animationDir: currentIndex < destIndex ? "right" : "left"}
            });
        }
    }

    render() {
        const state = this.props.state;
        const descriptors = this.props.descriptors;
        const navigation = this.props.navigation;
        return (
            <Animatable.View
                animation={"fadeInUp"}
                duration={500}
                useNativeDriver
                style={{
                    flexDirection: 'row',
                    height: TAB_BAR_HEIGHT,
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
            </Animatable.View>
        );
    }
}

export default withTheme(CustomTabBar);
