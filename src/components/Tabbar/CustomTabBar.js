import * as React from 'react';
import {View} from "react-native";
import {withTheme} from 'react-native-paper';
import TabIcon from "./TabIcon";
import TabHomeIcon from "./TabHomeIcon";

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

    render() {
        const state = this.props.state;
        const descriptors = this.props.descriptors;
        const navigation = this.props.navigation;
        return (
            <View style={{
                flexDirection: 'row',
                height: TAB_BAR_HEIGHT,
            }}>
                {state.routes.map((route, index) => {
                    const {options} = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                            ? options.title
                            : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

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
                            focused={isFocused}/>
                    } else
                        return <TabHomeIcon
                            onPress={onPress}
                            onLongPress={onLongPress}
                            focused={isFocused}/>
                })}
            </View>
        );
    }
}

export default withTheme(CustomTabBar);
