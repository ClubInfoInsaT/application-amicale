// @flow

import * as React from 'react';
import {StyleSheet, View} from "react-native";
import {FAB, IconButton, Surface, withTheme} from "react-native-paper";
import AutoHideComponent from "./AutoHideComponent";

type Props = {
    navigation: Object,
    theme: Object,
    onPress: Function,
    currentGroup: string,
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

    ref: Object;

    displayModeIcons: Object;

    state = {
        currentMode: DISPLAY_MODES.WEEK,
    }

    constructor() {
        super();
        this.ref = React.createRef();
        this.displayModeIcons = {};
        this.displayModeIcons[DISPLAY_MODES.DAY] = "calendar-text";
        this.displayModeIcons[DISPLAY_MODES.WEEK] = "calendar-week";
        this.displayModeIcons[DISPLAY_MODES.MONTH] = "calendar-range";
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return (nextProps.currentGroup !== this.props.currentGroup)
            || (nextState.currentMode !== this.state.currentMode);
    }

    onScroll = (event: Object) => {
        this.ref.current.onScroll(event);
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
            <AutoHideComponent
                ref={this.ref}
                style={styles.container}>
                <Surface style={styles.surface}>
                    <View style={styles.fabContainer}>
                        <FAB
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
            </AutoHideComponent>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: '5%',
        bottom: 10,
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
