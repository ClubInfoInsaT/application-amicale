// @flow

import * as React from 'react';
import {Avatar, Card, withTheme} from 'react-native-paper';
import {StyleSheet} from "react-native";

/**
 * Component used to display a dashboard item containing a preview event
 *
 * @param props Props to pass to the component
 * @return {*}
 */
function EventDashBoardItem(props) {
    const {colors} = props.theme;
    const iconColor = props.isAvailable ?
        colors.planningColor :
        colors.textDisabled;
    const textColor = props.isAvailable ?
        colors.text :
        colors.textDisabled;
    return (
        <Card
            style={styles.card}
            onPress={props.clickAction}>

            <Card.Title
                title={props.title}
                titleStyle={{color: textColor}}
                subtitle={props.subtitle}
                subtitleStyle={{color: textColor}}
                left={() =>
                    <Avatar.Icon
                        icon={props.icon}
                        color={iconColor}
                        size={60}
                        style={styles.avatar}/>}
            />
            <Card.Content>
                {props.children}
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 'auto',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        overflow: 'hidden',
    },
    avatar: {
        backgroundColor: 'transparent'
    }
});

export default withTheme(EventDashBoardItem);
