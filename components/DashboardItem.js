// @flow

import * as React from 'react';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {View} from "react-native";
import ThemeManager from "../utils/ThemeManager";
import HTML from "react-native-render-html";
import {LinearGradient} from "expo-linear-gradient";
import i18n from "i18n-js";
import {Avatar, Card, Text} from 'react-native-paper';

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

    getIcon: Function;

    constructor() {
        super();
        this.getIcon = this.getIcon.bind(this);
    }

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
            const hasImage = this.props.displayEvent['logo'] !== '' && this.props.displayEvent['logo'] !== null;
            const getImage = () => <Avatar.Image
                source={{uri: this.props.displayEvent['logo']}}
                size={60}
                style={{backgroundColor: 'transparent'}}/>;
            return (
                <Card style={{marginBottom: 10}}>
                    {hasImage ?
                        <Card.Title
                            title={this.props.displayEvent['title']}
                            subtitle={this.getFormattedEventTime(this.props.displayEvent)}
                            left={getImage}
                        /> :
                        <Card.Title
                            title={this.props.displayEvent['title']}
                            subtitle={this.getFormattedEventTime(this.props.displayEvent)}
                        />}
                    <View>
                        <Card.Content style={{
                            height: this.props.displayEvent['description'].length > 70 ? 100 : 50,
                            overflow: 'hidden',
                        }}>
                            <HTML html={"<div>" + this.props.displayEvent['description'] + "</div>"}
                                  tagsStyles={{
                                      p: {
                                          color: ThemeManager.getCurrentThemeVariables().text,
                                      },
                                      div: {color: ThemeManager.getCurrentThemeVariables().text},
                                  }}/>

                        </Card.Content>
                        <LinearGradient
                            colors={[
                                // Fix for ios gradient: transparent color must match final color
                                ThemeManager.getNightMode() ? 'rgba(42,42,42,0)' : 'rgba(255,255,255,0)',
                                ThemeManager.getCurrentThemeVariables().card
                            ]}
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
                                <MaterialCommunityIcons
                                    name={'chevron-right'}
                                    size={26}
                                    color={ThemeManager.getCurrentThemeVariables().text}/>
                            </View>
                        </LinearGradient>
                    </View>
                </Card>
            );
        } else
            return <View/>
    }

    getIcon() {
        return (
            <Avatar.Icon
                icon={this.props.icon}
                color={this.props.isAvailable ? this.props.color : ThemeManager.getCurrentThemeVariables().textDisabled}
                size={60}
                style={{backgroundColor: 'transparent'}}/>
        );
    }

    render() {
        // console.log("rendering DashboardItem " + this.props.title);
        let marginRight = 10;
        if (this.props.isSquare) {
            if (this.props.isSquareLeft)
                marginRight = '4%';
            else
                marginRight = 0
        }
        const color = this.props.isAvailable ?
            ThemeManager.getCurrentThemeVariables().text :
            ThemeManager.getCurrentThemeVariables().textDisabled;
        return (
            <Card
                style={{
                    width: this.props.isSquare ? '48%' : 'auto',
                    marginLeft: this.props.isSquare ? 0 : 10,
                    marginRight: marginRight,
                    marginTop: 10,
                    overflow: 'hidden',
                }}
                onPress={this.props.clickAction}>

                <Card.Title
                    title={this.props.title}
                    titleStyle={{color: color}}
                    subtitle={this.props.subtitle}
                    subtitleStyle={{color: color}}
                    left={this.getIcon}
                />
                <Card.Content>
                    {this.getEventPreviewContainer()}
                </Card.Content>
            </Card>
        );
    }
}
