// @flow

import * as React from 'react';
import {Avatar, Card, Text, TouchableRipple, withTheme} from 'react-native-paper';
import {StyleSheet, View} from "react-native";
import i18n from "i18n-js";
import type {CustomTheme} from "../../managers/ThemeManager";

type Props = {
    eventNumber: number;
    clickAction: () => void,
    theme: CustomTheme,
    children?: React.Node
}

/**
 * Component used to display a dashboard item containing a preview event
 */
class EventDashBoardItem extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Props) {
        return (nextProps.theme.dark !== this.props.theme.dark)
            || (nextProps.eventNumber !== this.props.eventNumber);
    }

    render() {
        const props = this.props;
        const colors = props.theme.colors;
        const isAvailable = props.eventNumber > 0;
        const iconColor = isAvailable ?
            colors.planningColor :
            colors.textDisabled;
        const textColor = isAvailable ?
            colors.text :
            colors.textDisabled;
        let subtitle;
        if (isAvailable) {
            subtitle =
                <Text>
                    <Text style={{fontWeight: "bold"}}>{props.eventNumber}</Text>
                    <Text>
                        {props.eventNumber > 1
                            ? i18n.t('screens.home.dashboard.todayEventsSubtitlePlural')
                            : i18n.t('screens.home.dashboard.todayEventsSubtitle')}
                    </Text>
                </Text>;
        } else
            subtitle = i18n.t('screens.home.dashboard.todayEventsSubtitleNA');
        return (
            <Card style={styles.card}>
                <TouchableRipple
                    style={{flex: 1}}
                    onPress={props.clickAction}>
                    <View>
                        <Card.Title
                            title={i18n.t('screens.home.dashboard.todayEventsTitle')}
                            titleStyle={{color: textColor}}
                            subtitle={subtitle}
                            subtitleStyle={{color: textColor}}
                            left={() =>
                                <Avatar.Icon
                                    icon={'calendar-range'}
                                    color={iconColor}
                                    size={60}
                                    style={styles.avatar}/>}
                        />
                        <Card.Content>
                            {props.children}
                        </Card.Content>
                    </View>
                </TouchableRipple>
            </Card>
        );
    }

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
