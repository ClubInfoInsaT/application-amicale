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

/**
 * Abstraction layer for Agenda component, using custom configuration
 */
class CustomTabBar extends React.Component<Props> {

    static TAB_BAR_HEIGHT = 48;

    // shouldComponentUpdate(nextProps: Props): boolean {
    //     return (nextProps.theme.dark !== this.props.theme.dark)
    //         || (nextProps.state.index !== this.props.state.index);
    // }

    isHidden: boolean;
    tabRef: Object;

    constructor() {
        super();
        this.tabRef = React.createRef();
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
                ref={this.tabRef}
                animation={"fadeInUp"}
                duration={500}
                useNativeDriver
                style={{
                    flexDirection: 'row',
                    height: CustomTabBar.TAB_BAR_HEIGHT,
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    backgroundColor: this.props.theme.colors.surface,
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
                        const tabVisible = options.tabBarVisible();
                        console.log(tabVisible);
                        if (this.tabRef.current) {
                            if (this.isHidden && tabVisible) {
                                this.isHidden = false;
                                this.tabRef.current.slideInUp(300);
                            } else if (!this.isHidden && !tabVisible){
                                this.isHidden = true;
                                this.tabRef.current.slideOutDown(300);
                            }
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
            </Animatable.View>
        );
    }
}

export default withTheme(CustomTabBar);
