import * as React from 'react';
import {Avatar, Card, Text, withTheme} from 'react-native-paper';
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
            <Avatar.Icon
                icon={'bell-ring'}
                size={45}
                color={colors.primary}
                style={{backgroundColor: 'transparent'}}
            /> :
            <Avatar.Icon
                icon={props.isDryer ? 'tumble-dryer' : 'washing-machine'}
                color={colors.text}
                size={40}
                style={{backgroundColor: 'transparent'}}
            />
    );
    return (
        <Card
            style={{
                margin: 5,
            }}
            onPress={props.onPress}
        >
            {ProxiwashConstants.machineStates[props.state] === ProxiwashConstants.machineStates["EN COURS"] ?
                <Card style={{
                    height: '100%',
                    position: 'absolute',
                    left: 0,
                    width: '100%',
                    backgroundColor: colors.proxiwashRunningBgColor,
                    elevation: 0
                }}/> : null
            }

            <Card style={{
                height: '100%',
                position: 'absolute',
                left: 0,
                width: props.progress,
                backgroundColor: stateColors[ProxiwashConstants.machineStates[props.state]],
                elevation: 0
            }}/>
            <Card.Title
                title={props.title}
                subtitle={props.description}
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

                        <Avatar.Icon
                            icon={props.statusIcon}
                            color={colors.text}
                            size={30}
                            style={{backgroundColor: 'transparent'}}
                        />
                    </View>)}
            />
        </Card>
    );
}

export default withTheme(ProxiwashListItem);
