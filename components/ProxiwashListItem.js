import * as React from 'react';
import {Divider, List, Text, withTheme} from 'react-native-paper';
import {View} from "react-native";
import ProxiwashConstants from "../constants/ProxiwashConstants";

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
            <List.Icon icon={'bell-ring'} color={colors.primary}/> :
            <List.Icon icon={props.isDryer ? 'tumble-dryer' : 'washing-machine'}/>
    );
    return (
        <View style={{
            backgroundColor:
                ProxiwashConstants.machineStates[props.state] === ProxiwashConstants.machineStates["EN COURS"] ?
                    colors.proxiwashRunningBgColor :
                    colors.background
        }}>
            <View style={{
                height: '100%',
                position: 'absolute',
                left: 0,
                width: props.progress,
                backgroundColor: stateColors[ProxiwashConstants.machineStates[props.state]]
            }}/>
            <List.Item
                title={props.title}
                description={props.description}
                onPress={props.onPress}
                style={{
                    backgroundColor: 'transparent',
                    height: 64
                }}
                left={() => icon}
                right={() => (
                    <View style={{flexDirection: 'row'}}>
                        <View style={{
                            justifyContent: 'center',
                        }}>
                            <Text style={
                                ProxiwashConstants.machineStates[props.state] === ProxiwashConstants.machineStates.TERMINE ?
                                    {fontWeight: 'bold',} : {}}
                            >
                                {props.statusText}
                            </Text>
                        </View>

                        <List.Icon
                            color={colors.text}
                            icon={props.statusIcon}
                        />
                    </View>)}
            />
            <Divider/>
        </View>
    );
}

export default withTheme(ProxiwashListItem);
