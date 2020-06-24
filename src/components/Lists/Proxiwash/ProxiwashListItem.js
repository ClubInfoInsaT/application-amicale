import * as React from 'react';
import {Avatar, List, ProgressBar, Surface, Text, withTheme} from 'react-native-paper';
import {StyleSheet, View} from "react-native";
import ProxiwashConstants from "../../../constants/ProxiwashConstants";
import i18n from "i18n-js";
import AprilFoolsManager from "../../../managers/AprilFoolsManager";
import * as Animatable from "react-native-animatable";
import type {CustomTheme} from "../../../managers/ThemeManager";

type Props = {
    item: Object,
    theme: CustomTheme,
    onPress: Function,
    isWatched: boolean,
    isDryer: boolean,
    height: number,
}

const AnimatedIcon = Animatable.createAnimatableComponent(Avatar.Icon);


/**
 * Component used to display a proxiwash item, showing machine progression and state
 */
class ProxiwashListItem extends React.Component<Props> {

    stateColors: Object;
    stateStrings: Object;

    title: string;

    constructor(props) {
        super(props);
        this.stateColors = {};
        this.stateStrings = {};

        this.updateStateStrings();

        let displayNumber = props.item.number;
        if (AprilFoolsManager.getInstance().isAprilFoolsEnabled())
            displayNumber = AprilFoolsManager.getProxiwashMachineDisplayNumber(parseInt(props.item.number));

        this.title = props.isDryer
            ? i18n.t('proxiwashScreen.dryer')
            : i18n.t('proxiwashScreen.washer');
        this.title += ' n°' + displayNumber;
    }

    shouldComponentUpdate(nextProps: Props): boolean {
        const props = this.props;
        return (nextProps.theme.dark !== props.theme.dark)
            || (nextProps.item.state !== props.item.state)
            || (nextProps.item.donePercent !== props.item.donePercent)
            || (nextProps.isWatched !== props.isWatched);
    }

    updateStateStrings() {
        this.stateStrings[ProxiwashConstants.machineStates.AVAILABLE] = i18n.t('proxiwashScreen.states.ready');
        this.stateStrings[ProxiwashConstants.machineStates.RUNNING] = i18n.t('proxiwashScreen.states.running');
        this.stateStrings[ProxiwashConstants.machineStates.RUNNING_NOT_STARTED] = i18n.t('proxiwashScreen.states.runningNotStarted');
        this.stateStrings[ProxiwashConstants.machineStates.FINISHED] = i18n.t('proxiwashScreen.states.finished');
        this.stateStrings[ProxiwashConstants.machineStates.UNAVAILABLE] = i18n.t('proxiwashScreen.states.broken');
        this.stateStrings[ProxiwashConstants.machineStates.ERROR] = i18n.t('proxiwashScreen.states.error');
        this.stateStrings[ProxiwashConstants.machineStates.UNKNOWN] = i18n.t('proxiwashScreen.states.unknown');
    }

    updateStateColors() {
        const colors = this.props.theme.colors;
        this.stateColors[ProxiwashConstants.machineStates.AVAILABLE] = colors.proxiwashReadyColor;
        this.stateColors[ProxiwashConstants.machineStates.RUNNING] = colors.proxiwashRunningColor;
        this.stateColors[ProxiwashConstants.machineStates.RUNNING_NOT_STARTED] = colors.proxiwashRunningNotStartedColor;
        this.stateColors[ProxiwashConstants.machineStates.FINISHED] = colors.proxiwashFinishedColor;
        this.stateColors[ProxiwashConstants.machineStates.UNAVAILABLE] = colors.proxiwashBrokenColor;
        this.stateColors[ProxiwashConstants.machineStates.ERROR] = colors.proxiwashErrorColor;
        this.stateColors[ProxiwashConstants.machineStates.UNKNOWN] = colors.proxiwashUnknownColor;
    }

    onListItemPress = () => this.props.onPress(this.title, this.props.item, this.props.isDryer);

    render() {
        const props = this.props;
        const colors = props.theme.colors;
        const machineState = props.item.state;
        const isRunning = machineState === ProxiwashConstants.machineStates.RUNNING;
        const isReady = machineState === ProxiwashConstants.machineStates.AVAILABLE;
        const description = isRunning ? props.item.startTime + '/' + props.item.endTime : '';
        const stateIcon = ProxiwashConstants.stateIcons[machineState];
        const stateString = this.stateStrings[machineState];
        const progress = isRunning
            ? props.item.donePercent !== ''
                ? parseFloat(props.item.donePercent) / 100
                : 0
            : 1;

        const icon = props.isWatched
            ? <AnimatedIcon
                icon={'bell-ring'}
                animation={"rubberBand"}
                useNativeDriver
                size={50}
                color={colors.primary}
                style={styles.icon}
            />
            : <AnimatedIcon
                icon={props.isDryer ? 'tumble-dryer' : 'washing-machine'}
                animation={isRunning ? "pulse" : undefined}
                iterationCount={"infinite"}
                easing={"linear"}
                duration={1000}
                useNativeDriver
                size={40}
                color={colors.text}
                style={styles.icon}
            />;
        this.updateStateColors();
        return (
            <Surface
                style={{
                    ...styles.container,
                    height: props.height,
                    borderRadius: 4,
                }}
            >
                {
                    !isReady
                        ? <ProgressBar
                            style={{
                                ...styles.progressBar,
                                height: props.height
                            }}
                            progress={progress}
                            color={this.stateColors[machineState]}
                        />
                        : null
                }
                <List.Item
                    title={this.title}
                    description={description}
                    style={{
                        height: props.height,
                        justifyContent: 'center',
                    }}
                    onPress={this.onListItemPress}
                    left={() => icon}
                    right={() => (
                        <View style={{flexDirection: 'row',}}>
                            <View style={{justifyContent: 'center',}}>
                                <Text style={
                                    machineState === ProxiwashConstants.machineStates.FINISHED ?
                                        {fontWeight: 'bold',} : {}}
                                >
                                    {stateString}
                                </Text>
                            </View>
                            <View style={{justifyContent: 'center',}}>
                                <Avatar.Icon
                                    icon={stateIcon}
                                    color={colors.text}
                                    size={30}
                                    style={styles.icon}
                                />
                            </View>
                        </View>)}
                />
            </Surface>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 5,
        justifyContent: 'center',
        elevation: 1
    },
    icon: {
        backgroundColor: 'transparent'
    },
    progressBar: {
        position: 'absolute',
        left: 0,
        borderRadius: 4,
    },
});

export default withTheme(ProxiwashListItem);
