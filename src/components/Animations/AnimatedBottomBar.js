// @flow

import * as React from 'react';
import {StyleSheet, View} from "react-native";
import {FAB, IconButton, Surface, withTheme} from "react-native-paper";
import AutoHideHandler from "../../utils/AutoHideHandler";
import * as Animatable from 'react-native-animatable';
import CustomTabBar from "../Tabbar/CustomTabBar";
import {StackNavigationProp} from "@react-navigation/stack";
import type {CustomTheme} from "../../managers/ThemeManager";

const AnimatedFAB = Animatable.createAnimatableComponent(FAB);

type Props = {
    navigation: StackNavigationProp,
    theme: CustomTheme,
    onPress: (action: string, data: any) => void,
    seekAttention: boolean,
}

type State = {
    currentMode: string,
}

const DISPLAY_MODES = {
    DAY: "agendaDay",
    WEEK: "agendaWeek",
    MONTH: "month",
}

class AnimatedBottomBar extends React.Component<Props, State> {

    ref: { current: null | Animatable.View };
    hideHandler: AutoHideHandler;

    displayModeIcons: { [key: string]: string };

    state = {
        currentMode: DISPLAY_MODES.WEEK,
    }

    constructor() {
        super();
        this.ref = React.createRef();
        this.hideHandler = new AutoHideHandler(false);
        this.hideHandler.addListener(this.onHideChange);

        this.displayModeIcons = {};
        this.displayModeIcons[DISPLAY_MODES.DAY] = "calendar-text";
        this.displayModeIcons[DISPLAY_MODES.WEEK] = "calendar-week";
        this.displayModeIcons[DISPLAY_MODES.MONTH] = "calendar-range";
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return (nextProps.seekAttention !== this.props.seekAttention)
            || (nextState.currentMode !== this.state.currentMode);
    }

    onHideChange = (shouldHide: boolean) => {
        if (this.ref.current != null) {
            if (shouldHide)
                this.ref.current.bounceOutDown(1000);
            else
                this.ref.current.bounceInUp(1000);
        }
    }

    onScroll = (event: SyntheticEvent<EventTarget>) => {
        this.hideHandler.onScroll(event);
    };

    changeDisplayMode = () => {
        let newMode;
        switch (this.state.currentMode) {
            case DISPLAY_MODES.DAY:
                newMode = DISPLAY_MODES.WEEK;
                break;
            case DISPLAY_MODES.WEEK:
                newMode = DISPLAY_MODES.MONTH;

                break;
            case DISPLAY_MODES.MONTH:
                newMode = DISPLAY_MODES.DAY;
                break;
        }
        this.setState({currentMode: newMode});
        this.props.onPress("changeView", newMode);
    };

    render() {
        const buttonColor = this.props.theme.colors.primary;
        return (
            <Animatable.View
                ref={this.ref}
                useNativeDriver
                style={{
                    ...styles.container,
                    bottom: 10 + CustomTabBar.TAB_BAR_HEIGHT
                }}>
                <Surface style={styles.surface}>
                    <View style={styles.fabContainer}>
                        <AnimatedFAB
                            animation={this.props.seekAttention ? "bounce" : undefined}
                            easing="ease-out"
                            iterationDelay={500}
                            iterationCount="infinite"
                            useNativeDriver
                            // useNativeDriver={true}
                            style={styles.fab}
                            icon="account-clock"
                            onPress={() => this.props.navigation.navigate('group-select')}
                        />
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <IconButton
                            icon={this.displayModeIcons[this.state.currentMode]}
                            color={buttonColor}
                            onPress={this.changeDisplayMode}/>
                        <IconButton
                            icon="clock-in"
                            color={buttonColor}
                            style={{marginLeft: 5}}
                            onPress={() => this.props.onPress('today', undefined)}/>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <IconButton
                            icon="chevron-left"
                            color={buttonColor}
                            onPress={() => this.props.onPress('prev', undefined)}/>
                        <IconButton
                            icon="chevron-right"
                            color={buttonColor}
                            style={{marginLeft: 5}}
                            onPress={() => this.props.onPress('next', undefined)}/>
                    </View>
                </Surface>
            </Animatable.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: '5%',
        width: '90%',
    },
    surface: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 50,
        elevation: 2,
    },
    fabContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        alignItems: "center",
        width: '100%',
        height: '100%'
    },
    fab: {
        position: 'absolute',
        alignSelf: 'center',
        top: '-25%',
    }
});

export default withTheme(AnimatedBottomBar);
