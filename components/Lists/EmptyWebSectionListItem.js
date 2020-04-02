import * as React from 'react';
import {ActivityIndicator, Subheading, withTheme} from 'react-native-paper';
import {StyleSheet, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";

/**
 * Component used to display a message when a list is empty
 *
 * @param props Props to pass to the component
 * @return {*}
 */
function EmptyWebSectionListItem(props: { text: string, icon: string, refreshing: boolean, theme: {} }) {
    const {colors} = props.theme;
    return (
        <View>
            <View style={styles.iconContainer}>
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
                ...styles.subheading,
                color: colors.textDisabled
            }}>
                {props.text}
            </Subheading>
        </View>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 100,
        marginBottom: 20
    },
    subheading: {
        textAlign: 'center',
        marginRight: 20,
        marginLeft: 20,
    }
});

export default withTheme(EmptyWebSectionListItem);
