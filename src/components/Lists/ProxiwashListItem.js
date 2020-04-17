import * as React from 'react';
import {ActivityIndicator, Avatar, List, ProgressBar, Surface, Text, withTheme} from 'react-native-paper';
import {StyleSheet, View} from "react-native";
import ProxiwashConstants from "../../constants/ProxiwashConstants";
import i18n from "i18n-js";
import AprilFoolsManager from "../../managers/AprilFoolsManager";
import * as Animatable from "react-native-animatable";

type Props = {
    item: Object,
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
        this.stateStrings[ProxiwashConstants.machineStates.TERMINE] = i18n.t('proxiwashScreen.states.finished');
        this.stateStrings[ProxiwashConstants.machineStates.DISPONIBLE] = i18n.t('proxiwashScreen.states.ready');
        this.stateStrings[ProxiwashConstants.machineStates["EN COURS"]] = i18n.t('proxiwashScreen.states.running');
        this.stateStrings[ProxiwashConstants.machineStates.HS] = i18n.t('proxiwashScreen.states.broken');
        this.stateStrings[ProxiwashConstants.machineStates.ERREUR] = i18n.t('proxiwashScreen.states.error');
    }

    updateStateColors() {
        const colors = this.props.theme.colors;
        this.stateColors[ProxiwashConstants.machineStates.TERMINE] = colors.proxiwashFinishedColor;
        this.stateColors[ProxiwashConstants.machineStates.DISPONIBLE] = colors.proxiwashReadyColor;
        this.stateColors[ProxiwashConstants.machineStates["EN COURS"]] = colors.proxiwashRunningColor;
        this.stateColors[ProxiwashConstants.machineStates.HS] = colors.proxiwashBrokenColor;
        this.stateColors[ProxiwashConstants.machineStates.ERREUR] = colors.proxiwashErrorColor;
    }

    onListItemPress = () => this.props.onPress(this.title, this.props.item, this.props.isDryer);

    render() {
        const props = this.props;
        const colors = props.theme.colors;
        const machineState = props.item.state;
        const isRunning = ProxiwashConstants.machineStates[machineState] === ProxiwashConstants.machineStates["EN COURS"];
        const isReady = ProxiwashConstants.machineStates[machineState] === ProxiwashConstants.machineStates.DISPONIBLE;
        const description = isRunning ? props.item.startTime + '/' + props.item.endTime : '';
        const stateIcon = ProxiwashConstants.stateIcons[machineState];
        const stateString = this.stateStrings[ProxiwashConstants.machineStates[machineState]];
        const progress = isRunning
            ? props.item.donePercent !== ''
                ? parseInt(props.item.donePercent) / 100
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
                            color={this.stateColors[ProxiwashConstants.machineStates[machineState]]}
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
                                    ProxiwashConstants.machineStates[machineState] === ProxiwashConstants.machineStates.TERMINE ?
                                        {fontWeight: 'bold',} : {}}
                                >
                                    {stateString}
                                </Text>
                            </View>
                            <View style={{justifyContent: 'center',}}>
                                {
                                    isRunning
                                        ? <ActivityIndicator
                                            animating={true}
                                            size={'small'}
                                            style={{marginLeft: 10}}/>
                                        : <Avatar.Icon
                                            icon={stateIcon}
                                            color={colors.text}
                                            size={30}
                                            style={styles.icon}
                                        />
                                }

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
