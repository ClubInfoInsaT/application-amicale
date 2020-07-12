// @flow

import * as React from 'react';
import {StyleSheet} from "react-native";
import i18n from "i18n-js";
import {Avatar, Button, Card} from 'react-native-paper';
import {getFormattedEventTime, isDescriptionEmpty} from "../../utils/Planning";
import CustomHTML from "../Overrides/CustomHTML";
import type {CustomTheme} from "../../managers/ThemeManager";
import type {event} from "../../screens/Home/HomeScreen";

type Props = {
    event?: event,
    clickAction: () => void,
    theme?: CustomTheme,
}

/**
 * Component used to display an event preview if an event is available
 */
class PreviewEventDashboardItem extends React.Component<Props> {

    render() {
        const props = this.props;
        const isEmpty = props.event == null
            ? true
            : isDescriptionEmpty(props.event.description);

        if (props.event != null) {
            const event = props.event;
            const hasImage = event.logo !== '' && event.logo != null;
            const getImage = () => <Avatar.Image
                source={{uri: event.logo}}
                size={50}
                style={styles.avatar}/>;
            return (
                <Card
                    style={styles.card}
                    onPress={props.clickAction}
                    elevation={3}
                >
                    {hasImage ?
                        <Card.Title
                            title={event.title}
                            subtitle={getFormattedEventTime(event.date_begin, event.date_end)}
                            left={getImage}
                        /> :
                        <Card.Title
                            title={event.title}
                            subtitle={getFormattedEventTime(event.date_begin, event.date_end)}
                        />}
                    {!isEmpty ?
                        <Card.Content style={styles.content}>
                            <CustomHTML html={event.description}/>
                        </Card.Content> : null}

                    <Card.Actions style={styles.actions}>
                        <Button
                            icon={'chevron-right'}
                        >
                            {i18n.t("screens.home.dashboard.seeMore")}
                        </Button>
                    </Card.Actions>
                </Card>
            );
        } else
            return null;
    }
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 10
    },
    content: {
        maxHeight: 150,
        overflow: 'hidden',
    },
    actions: {
        marginLeft: 'auto',
        marginTop: 'auto',
        flexDirection: 'row'
    },
    avatar: {
        backgroundColor: 'transparent'
    }
});

export default PreviewEventDashboardItem;
