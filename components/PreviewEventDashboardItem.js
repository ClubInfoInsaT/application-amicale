// @flow

import * as React from 'react';
import {StyleSheet, View} from "react-native";
import HTML from "react-native-render-html";
import i18n from "i18n-js";
import {Avatar, Button, Card, withTheme} from 'react-native-paper';
import PlanningEventManager from "../utils/PlanningEventManager";

/**
 * Component used to display an event preview if an event is available
 *
 * @param props Props to pass to the component
 * @return {*}
 */
function PreviewEventDashboardItem(props) {
    const {colors} = props.theme;
    const isEmpty = props.event === undefined
        ? true
        : PlanningEventManager.isDescriptionEmpty(props.event['description']);

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
                        subtitle={PlanningEventManager.getFormattedEventTime(props.event['date_begin'], props.event['date_end'])}
                        left={getImage}
                    /> :
                    <Card.Title
                        title={props.event['title']}
                        subtitle={PlanningEventManager.getFormattedEventTime(props.event['date_begin'], props.event['date_end'])}
                    />}
                {!isEmpty ?
                    <Card.Content style={styles.content}>
                        <HTML html={"<div>" + props.event['description'] + "</div>"}
                              tagsStyles={{
                                  p: {color: colors.text,},
                                  div: {color: colors.text},
                              }}/>

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

export default withTheme(PreviewEventDashboardItem);
