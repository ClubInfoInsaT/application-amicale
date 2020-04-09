// @flow

import * as React from 'react';
import {StyleSheet, View} from "react-native";
import i18n from "i18n-js";
import {Avatar, Button, Card} from 'react-native-paper';
import {getFormattedEventTime, isDescriptionEmpty} from "../../utils/Planning";
import CustomHTML from "../Custom/CustomHTML";

/**
 * Component used to display an event preview if an event is available
 *
 * @param props Props to pass to the component
 * @return {*}
 */
function PreviewEventDashboardItem(props) {
    const isEmpty = props.event === undefined
        ? true
        : isDescriptionEmpty(props.event['description']);

    if (props.event !== undefined && props.event !== null) {
        const hasImage = props.event['logo'] !== '' && props.event['logo'] !== null;
        const getImage = () => <Avatar.Image
            source={{uri: props.event['logo']}}
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
                        title={props.event['title']}
                        subtitle={getFormattedEventTime(props.event['date_begin'], props.event['date_end'])}
                        left={getImage}
                    /> :
                    <Card.Title
                        title={props.event['title']}
                        subtitle={getFormattedEventTime(props.event['date_begin'], props.event['date_end'])}
                    />}
                {!isEmpty ?
                    <Card.Content style={styles.content}>
                        <CustomHTML html={props.event['description']}/>
                    </Card.Content> : null}

                <Card.Actions style={styles.actions}>
                    <Button
                        icon={'chevron-right'}
                    >
                        {i18n.t("homeScreen.dashboard.seeMore")}
                    </Button>
                </Card.Actions>
            </Card>
        );
    } else
        return <View/>
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
