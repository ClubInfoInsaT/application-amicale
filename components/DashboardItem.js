// @flow

import * as React from 'react';
import {Body, Card, CardItem, H3, Left, Text, Thumbnail} from "native-base";
import CustomMaterialIcon from "./CustomMaterialIcon";
import {View} from "react-native";
import ThemeManager from "../utils/ThemeManager";
import HTML from "react-native-render-html";
import {LinearGradient} from "expo-linear-gradient";
import PlatformTouchable from "react-native-platform-touchable";
import i18n from "i18n-js";

const CARD_BORDER_RADIUS = 10;

type Props = {
    isAvailable: boolean,
    icon: string,
    color: string,
    title: string,
    subtitle: React.Node,
    clickAction: Function,
    isSquare: boolean,
    isSquareLeft: boolean,
    displayEvent: ?Object,
}

export default class DashboardItem extends React.Component<Props> {

    static defaultProps = {
        isSquare: false,
        isSquareLeft: true,
        displayEvent: undefined,
    };

    /**
     * Convert the date string given by in the event list json to a date object
     * @param dateString
     * @return {Date}
     */
    stringToDate(dateString: ?string): ?Date {
        let date = new Date();
        if (dateString === undefined || dateString === null)
            date = undefined;
        else if (dateString.split(' ').length > 1) {
            let timeStr = dateString.split(' ')[1];
            date.setHours(parseInt(timeStr.split(':')[0]), parseInt(timeStr.split(':')[1]), 0);
        } else
            date = undefined;
        return date;
    }

    padStr(i: number) {
        return (i < 10) ? "0" + i : "" + i;
    }

    getFormattedEventTime(event: Object): string {
        let formattedStr = '';
        let startDate = this.stringToDate(event['date_begin']);
        let endDate = this.stringToDate(event['date_end']);
        if (startDate !== undefined && startDate !== null && endDate !== undefined && endDate !== null)
            formattedStr = this.padStr(startDate.getHours()) + ':' + this.padStr(startDate.getMinutes()) +
                ' - ' + this.padStr(endDate.getHours()) + ':' + this.padStr(endDate.getMinutes());
        else if (startDate !== undefined && startDate !== null)
            formattedStr = this.padStr(startDate.getHours()) + ':' + this.padStr(startDate.getMinutes());
        return formattedStr
    }

    getEventPreviewContainer() {
        if (this.props.displayEvent !== undefined && this.props.displayEvent !== null) {
            return (
                <View>
                    <CardItem style={{
                        paddingTop: 0,
                        paddingBottom: 0,
                        backgroundColor: 'transparent',
                    }}>
                        <Left>
                            {this.props.displayEvent['logo'] !== '' && this.props.displayEvent['logo'] !== null ?
                                <Thumbnail source={{uri: this.props.displayEvent['logo']}} square/> :
                                <View/>}
                            <Body>
                                <Text>{this.props.displayEvent['title']}</Text>
                                <Text note>{this.getFormattedEventTime(this.props.displayEvent)}</Text>
                            </Body>
                        </Left>
                    </CardItem>
                    <CardItem style={{
                        borderRadius: CARD_BORDER_RADIUS,
                        backgroundColor: 'transparent',
                    }}>
                        <Body style={{
                            height: this.props.displayEvent['description'].length > 50 ? 70 : 20,
                            overflow: 'hidden',
                        }}>
                            <HTML html={"<div>" + this.props.displayEvent['description'] + "</div>"}
                                  tagsStyles={{
                                      p: {
                                          color: ThemeManager.getCurrentThemeVariables().textColor,
                                          fontSize: ThemeManager.getCurrentThemeVariables().fontSizeBase,
                                      },
                                      div: {color: ThemeManager.getCurrentThemeVariables().textColor},
                                  }}/>
                            <LinearGradient
                                colors={['transparent', ThemeManager.getCurrentThemeVariables().cardDefaultBg]}
                                start={{x: 0, y: 0}}
                                end={{x: 0, y: 0.6}}
                                // end={[0, 0.6]}
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: 65,
                                    bottom: -5,
                                }}>
                                <View style={{
                                    marginLeft: 'auto',
                                    marginTop: 'auto',
                                    flexDirection: 'row'
                                }}>
                                    <Text style={{
                                        marginTop: 'auto',
                                        marginBottom: 'auto',
                                        padding: 0,
                                    }}>
                                        {i18n.t("homeScreen.dashboard.seeMore")}
                                    </Text>
                                    <CustomMaterialIcon icon={'chevron-right'}/>
                                </View>
                            </LinearGradient>
                        </Body>
                    </CardItem>
                </View>
            );
        } else
            return <View/>
    }

    getIcon() {
        return (
            <CustomMaterialIcon
                icon={this.props.icon}
                color={
                    this.props.isAvailable ?
                        this.props.color :
                        ThemeManager.getCurrentThemeVariables().textDisabledColor
                }
                fontSize={this.props.isSquare ? 50 : 40}
                width={this.props.isSquare ? 50 : 40}/>
        );
    }

    getText() {
        return (
            <View style={{
                width: this.props.isSquare ? '100%' : 'auto',
            }}>
                <H3 style={{
                    color: this.props.isAvailable ?
                        ThemeManager.getCurrentThemeVariables().textColor :
                        ThemeManager.getCurrentThemeVariables().listNoteColor,
                    textAlign: this.props.isSquare ? 'center' : 'left',
                    width: this.props.isSquare ? '100%' : 'auto',
                }}>
                    {this.props.title}
                </H3>
                <Text style={{
                    color: this.props.isAvailable ?
                        ThemeManager.getCurrentThemeVariables().listNoteColor :
                        ThemeManager.getCurrentThemeVariables().textDisabledColor,
                    textAlign: this.props.isSquare ? 'center' : 'left',
                    width: this.props.isSquare ? '100%' : 'auto',
                }}>
                    {this.props.subtitle}
                </Text>
            </View>
        );
    }

    getContent() {
        if (this.props.isSquare) {
            return (
                <Body>
                    <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                        {this.getIcon()}
                    </View>
                    {this.getText()}
                </Body>
            );
        } else {
            return (
                <Left>
                    {this.getIcon()}
                    <Body>
                        {this.getText()}
                    </Body>
                </Left>
            );
        }
    }


    render() {
        let marginRight = 10;
        if (this.props.isSquare) {
            if (this.props.isSquareLeft)
                marginRight = '4%';
            else
                marginRight = 0
        }
        return (
            <Card style={{
                flex: 0,
                width: this.props.isSquare ? '48%' : 'auto',
                marginLeft: this.props.isSquare ? 0 : 10,
                marginRight: marginRight,
                marginTop: 10,
                borderRadius: CARD_BORDER_RADIUS,
                backgroundColor: ThemeManager.getCurrentThemeVariables().cardDefaultBg,
                overflow: 'hidden',
            }}>
                <PlatformTouchable
                    onPress={this.props.clickAction}
                    style={{
                        zIndex: 100,
                        minHeight: this.props.isSquare ? 150 : 'auto',
                    }}
                >
                    <View>
                        <CardItem style={{
                            backgroundColor: 'transparent',
                        }}>
                            {this.getContent()}
                        </CardItem>
                        {this.getEventPreviewContainer()}
                    </View>
                </PlatformTouchable>
            </Card>
        );
    }
}
