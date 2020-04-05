import * as React from 'react';
import {Avatar, Card, Text, withTheme} from 'react-native-paper';
import {StyleSheet, View} from "react-native";
import ProxiwashConstants from "../../constants/ProxiwashConstants";

/**
 * Component used to display a proxiwash item, showing machine progression and state
 *
 * @param props Props to pass to the component
 * @return {*}
 */
function ProxiwashListItem(props) {
    const {colors} = props.theme;
    let stateColors = {};
    stateColors[ProxiwashConstants.machineStates.TERMINE] = colors.proxiwashFinishedColor;
    stateColors[ProxiwashConstants.machineStates.DISPONIBLE] = colors.proxiwashReadyColor;
    stateColors[ProxiwashConstants.machineStates["EN COURS"]] = colors.proxiwashRunningColor;
    stateColors[ProxiwashConstants.machineStates.HS] = colors.proxiwashBrokenColor;
    stateColors[ProxiwashConstants.machineStates.ERREUR] = colors.proxiwashErrorColor;
    const icon = (
        props.isWatched ?
            <Avatar.Icon
                icon={'bell-ring'}
                size={45}
                color={colors.primary}
                style={styles.icon}
            /> :
            <Avatar.Icon
                icon={props.isDryer ? 'tumble-dryer' : 'washing-machine'}
                color={colors.text}
                size={40}
                style={styles.icon}
            />
    );
    return (
        <Card
            style={{
                margin: 5,
                height: props.height,
                justifyContent: 'center',
            }}
            onPress={props.onPress}
        >
            {ProxiwashConstants.machineStates[props.state] === ProxiwashConstants.machineStates["EN COURS"] ?
                <Card style={{
                    ...styles.backgroundCard,
                    backgroundColor: colors.proxiwashRunningBgColor,

                }}/> : null
            }

            <Card style={{
                ...styles.progressionCard,
                width: props.progress,
                backgroundColor: stateColors[ProxiwashConstants.machineStates[props.state]],
            }}/>
            <Card.Title
                title={props.title}
                titleStyle={{fontSize: 17}}
                subtitle={props.description}
                style={styles.title}
                left={() => icon}
                right={() => (
                    <View style={{flexDirection: 'row'}}>
                        <View style={{justifyContent: 'center'}}>
                            <Text style={
                                ProxiwashConstants.machineStates[props.state] === ProxiwashConstants.machineStates.TERMINE ?
                                    {fontWeight: 'bold',} : {}}
                            >
                                {props.statusText}
                            </Text>
                        </View>
                        <Avatar.Icon
                            icon={props.statusIcon}
                            color={colors.text}
                            size={30}
                            style={styles.icon}
                        />
                    </View>)}
            />
        </Card>
    );
}

const styles = StyleSheet.create({
    icon: {
        backgroundColor: 'transparent'
    },
    backgroundCard: {
        height: '100%',
        position: 'absolute',
        left: 0,
        width: '100%',
        elevation: 0,
    },
    progressionCard: {
        height: '100%',
        position: 'absolute',
        left: 0,
        elevation: 0,
    },
    title: {
        backgroundColor: 'transparent',
    }
});

export default withTheme(ProxiwashListItem);
