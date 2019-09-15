// @flow

import * as React from 'react';
import {Content, H1, H2, H3, Text} from 'native-base';
import i18n from "i18n-js";
import {View, Image} from "react-native";
import ThemeManager from "../utils/ThemeManager";
import {Linking} from "expo";
import BaseContainer from "../components/BaseContainer";
import {Agenda} from 'react-native-calendars';
import HTML from 'react-native-render-html';
import Touchable from 'react-native-platform-touchable';
import Modalize from 'react-native-modalize';
import WebDataManager from "../utils/WebDataManager";


type Props = {
    navigation: Object,
}

type State = {
    modalCurrentDisplayItem: Object,
    refreshing: boolean,
    agendaItems: Object,
};

const FETCH_URL = "https://amicale-insat.fr/event/json/list";

const AGENDA_MONTH_SPAN = 6;

/**
 * Opens a link in the device's browser
 * @param link The link to open
 */
function openWebLink(link) {
    Linking.openURL(link).catch((err) => console.error('Error opening link', err));
}

/**
 * Class defining the app's planning screen
 */
export default class PlanningScreen extends React.Component<Props, State> {

    modalRef: { current: null | Modalize };
    webDataManager: WebDataManager;

    constructor(props: any) {
        super(props);
        this.modalRef = React.createRef();
        this.webDataManager = new WebDataManager(FETCH_URL);
    }

    componentDidMount() {
        this._onRefresh();
    }

    state = {
        modalCurrentDisplayItem: {},
        refreshing: false,
        agendaItems: {}
    };

    getCurrentDate() {
        let today = new Date();
        return this.getFormattedDate(today);
    }

    getFormattedDate(date: Date) {
        let dd = String(date.getDate()).padStart(2, '0');
        let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = date.getFullYear();
        return yyyy + '-' + mm + '-' + dd;
    }

    generateEmptyCalendar() {
        let end = new Date(new Date().setMonth(new Date().getMonth() + AGENDA_MONTH_SPAN + 1));
        let daysOfYear = {};
        for (let d = new Date(2019, 8, 1); d <= end; d.setDate(d.getDate() + 1)) {
            daysOfYear[this.getFormattedDate(new Date(d))] = []
        }
        return daysOfYear;
    }

    getModalContent() {
        return (
            <View style={{
                flex: 1,
                padding: 20
            }}>
                <H1 style={{
                    marginTop: 20,
                }}>
                    {this.state.modalCurrentDisplayItem.title}
                </H1>
                <H3 style={{
                    marginTop: 10,
                    color: ThemeManager.getCurrentThemeVariables().listNoteColor
                }}>
                    {this.getFormattedTime(this.state.modalCurrentDisplayItem)}
                </H3>
                <Content>
                    {this.state.modalCurrentDisplayItem.logo !== null ?
                        <View style={{width: '100%', height: 200, marginTop: 20, marginBottom: 20}}>
                            <Image style={{flex: 1, resizeMode: "contain"}}
                                   source={{uri: this.state.modalCurrentDisplayItem.logo}}/>
                        </View>
                        : <View/>}

                    {this.state.modalCurrentDisplayItem.description !== null ?
                        // Surround description with div to allow text styling if the description is not html
                        <HTML html={"<div>" + this.state.modalCurrentDisplayItem.description + "</div>"}
                              tagsStyles={{
                                  p: {color: ThemeManager.getCurrentThemeVariables().textColor},
                                  div: {color: ThemeManager.getCurrentThemeVariables().textColor}
                              }}/>
                        : <View/>}
                </Content>
            </View>
        );
    }

    showItemDetails(item: Object) {
        this.setState({
            modalCurrentDisplayItem: item
        });
        if (this.modalRef.current) {
            this.modalRef.current.open();
        }
    }

    getRenderItem(item: Object) {
        return (
            <Touchable
                style={{
                    backgroundColor: ThemeManager.getCurrentThemeVariables().containerBgColor,
                    borderRadius: 10,
                    marginRight: 10,
                    marginTop: 17,
                }}
                onPress={() => this.showItemDetails(item)}>
                <View style={{
                    padding: 10,
                    flex: 1,
                    flexDirection: 'row'
                }}>
                    <View style={{width: '70%'}}>
                        <Text style={{
                            color: ThemeManager.getCurrentThemeVariables().listNoteColor,
                            marginTop: 5,
                            marginBottom: 10
                        }}>
                            {this.getFormattedTime(item)}
                        </Text>
                        <H3 style={{marginBottom: 10}}>{item.title}</H3>
                    </View>
                    <View style={{
                        width: '30%',
                        height: 80
                    }}>
                        {item.logo !== null ?
                            <Image source={{uri: item.logo}}
                                   style={{
                                       flex: 1,
                                       resizeMode: "contain"
                                   }}/>
                            : <View/>}
                    </View>
                </View>
            </Touchable>
        );
    }

    getRenderEmptyDate() {
        return (
            <View style={{
                padding: 10,
                flex: 1,
            }}>
                <View style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: ThemeManager.getCurrentThemeVariables().agendaEmptyLine,
                    marginTop: 'auto',
                    marginBottom: 'auto',
                }}/>
            </View>
        );
    }

    rowHasChanged(r1: Object, r2: Object) {
        if (r1 !== undefined && r2 !== undefined)
            return r1.title !== r2.title;
        else return !(r1 === undefined && r2 === undefined);
    }

    /**
     * Refresh data and show a toast if any error occurred
     * @private
     */
    _onRefresh = () => {
        this.setState({refreshing: true});
        this.webDataManager.readData()
            .then((fetchedData) => {
                this.setState({
                    refreshing: false,
                });
                this.generateEventAgenda(fetchedData);
            })
            .catch((err) => {
                this.setState({
                    refreshing: false,
                });
                console.log(err);
            });
    };

    generateEventAgenda(eventList: Array<Object>) {
        let agendaItems = this.generateEmptyCalendar();
        for (let i = 0; i < eventList.length; i++) {
            if (agendaItems[this.getEventStartDate(eventList[i])] !== undefined)
                agendaItems[this.getEventStartDate(eventList[i])].push(eventList[i]);
        }
        this.setState({agendaItems: agendaItems})
    }

    getEventStartDate(event: Object) {
        return event.date_begin.split(" ")[0];
    }

    getEventStartTime(event: Object) {
        if (event !== undefined && Object.keys(event).length > 0 && event.date_begin !== null)
            return this.formatTime(event.date_begin.split(" ")[1]);
        else
            return "";
    }

    getEventEndTime(event: Object) {
        if (event !== undefined && Object.keys(event).length > 0 && event.date_end !== null)
            return this.formatTime(event.date_end.split(" ")[1]);
        else
            return "";
    }

    getFormattedTime(event: Object) {
        if (this.getEventEndTime(event) !== "")
            return this.getEventStartTime(event) + " - " + this.getEventEndTime(event)
        else
            return this.getEventStartTime(event);
    }

    formatTime(time: string) {
        let array = time.split(':');
        return array[0] + ':' + array[1];
    }

    render() {
        const nav = this.props.navigation;
        return (
            <BaseContainer navigation={nav} headerTitle={i18n.t('screens.planning')}>
                <Modalize ref={this.modalRef}
                          modalStyle={{
                              backgroundColor: ThemeManager.getCurrentThemeVariables().containerBgColor,
                          }}>
                    {this.getModalContent()}
                </Modalize>
                <Agenda
                    // the list of items that have to be displayed in agenda. If you want to render item as empty date
                    // the value of date key kas to be an empty array []. If there exists no value for date key it is
                    // considered that the date in question is not yet loaded
                    items={this.state.agendaItems}
                    // initially selected day
                    selected={this.getCurrentDate()}
                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    minDate={"2019-09-01"}
                    // Max amount of months allowed to scroll to the past. Default = 50
                    pastScrollRange={1}
                    // Max amount of months allowed to scroll to the future. Default = 50
                    futureScrollRange={AGENDA_MONTH_SPAN}
                    // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
                    onRefresh={() => this._onRefresh()}
                    // Set this true while waiting for new data from a refresh
                    refreshing={this.state.refreshing}
                    renderItem={(item) => this.getRenderItem(item)}
                    renderEmptyDate={() => this.getRenderEmptyDate()}
                    rowHasChanged={() => this.rowHasChanged()}
                    // agenda theme
                    theme={{
                        backgroundColor: ThemeManager.getCurrentThemeVariables().agendaBackgroundColor,
                        calendarBackground: ThemeManager.getCurrentThemeVariables().containerBgColor,
                        textSectionTitleColor: ThemeManager.getCurrentThemeVariables().listNoteColor,
                        selectedDayBackgroundColor: ThemeManager.getCurrentThemeVariables().brandPrimary,
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: ThemeManager.getCurrentThemeVariables().brandPrimary,
                        dayTextColor: ThemeManager.getCurrentThemeVariables().textColor,
                        textDisabledColor: ThemeManager.getCurrentThemeVariables().textDisabledColor,
                        dotColor: ThemeManager.getCurrentThemeVariables().brandPrimary,
                        selectedDotColor: '#ffffff',
                        arrowColor: 'orange',
                        monthTextColor: ThemeManager.getCurrentThemeVariables().brandPrimary,
                        indicatorColor: ThemeManager.getCurrentThemeVariables().brandPrimary,
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 16,
                        agendaDayTextColor: ThemeManager.getCurrentThemeVariables().listNoteColor,
                        agendaDayNumColor: ThemeManager.getCurrentThemeVariables().listNoteColor,
                        agendaTodayColor: ThemeManager.getCurrentThemeVariables().brandPrimary,
                        agendaKnobColor: ThemeManager.getCurrentThemeVariables().brandPrimary,
                        // Fix for days hiding behind knob
                        'stylesheet.calendar.header': {
                            week: {
                                marginTop: 0,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }
                        }
                    }}
                />
            </BaseContainer>
        );
    }
}
