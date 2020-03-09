// @flow

import * as React from 'react';
import {View} from "react-native";
import HTML from "react-native-render-html";
import i18n from "i18n-js";
import {Avatar, Button, Card, withTheme} from 'react-native-paper';
import PlanningEventManager from "../utils/PlanningEventManager";


function PreviewEventDashboardItem(props) {
    const {colors} = props.theme;

    if (props.event !== undefined && props.event !== null) {
        const hasImage = props.event['logo'] !== '' && props.event['logo'] !== null;
        const getImage = () => <Avatar.Image
            source={{uri: props.event['logo']}}
            size={50}
            style={{backgroundColor: 'transparent'}}/>;
        return (
            <Card
                style={{marginBottom: 10}}
                onPress={props.clickAction}
                elevation={3}
            >
                {hasImage ?
                    <Card.Title
                        title={props.event['title']}
                        subtitle={PlanningEventManager.getFormattedEventTime(props.event)}
                        left={getImage}
                    /> :
                    <Card.Title
                        title={props.event['title']}
                        subtitle={PlanningEventManager.getFormattedEventTime(props.event)}
                    />}
                <Card.Content style={{
                    height: props.event['description'].length > 70 ? 100 : 50,
                    overflow: 'hidden',
                }}>
                    <HTML html={"<div>" + props.event['description'] + "</div>"}
                          tagsStyles={{
                              p: {color: colors.text,},
                              div: {color: colors.text},
                          }}/>

                </Card.Content>
                <Card.Actions style={{
                    marginLeft: 'auto',
                    marginTop: 'auto',
                    flexDirection: 'row'
                }}>
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

export default withTheme(PreviewEventDashboardItem);
