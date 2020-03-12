import * as React from 'react';
import {ActivityIndicator, Subheading, withTheme} from 'react-native-paper';
import {View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";

function EmptyWebSectionListItem(props) {
    const { colors } = props.theme;
    return (
        <View>
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: 100,
                marginBottom: 20
            }}>
                {props.refreshing ?
                    <ActivityIndicator
                        animating={true}
                        size={'large'}
                        color={colors.primary}/>
                    :
                    <MaterialCommunityIcons
                        name={props.icon}
                        size={100}
                        color={colors.textDisabled}/>}
            </View>

            <Subheading style={{
                textAlign: 'center',
                marginRight: 20,
                marginLeft: 20,
                color: colors.textDisabled
            }}>
                {props.text}
            </Subheading>
        </View>
    );
}

export default withTheme(EmptyWebSectionListItem);
