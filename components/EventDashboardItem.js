// @flow

import * as React from 'react';
import {Avatar, Card, withTheme} from 'react-native-paper';

function getIcon(icon, color) {
    return (
        <Avatar.Icon
            icon={icon}
            color={color}
            size={60}
            style={{backgroundColor: 'transparent'}}/>
    );
}

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
            style={{
                width: 'auto',
                marginLeft: 10,
                marginRight: 10,
                marginTop: 10,
                overflow: 'hidden',
            }}
            onPress={props.clickAction}>

            <Card.Title
                title={props.title}
                titleStyle={{color: textColor}}
                subtitle={props.subtitle}
                subtitleStyle={{color: textColor}}
                left={() => getIcon(props.icon, iconColor)}
            />
            <Card.Content>
                {props.children}
            </Card.Content>
        </Card>
    );
}

export default withTheme(EventDashBoardItem);
