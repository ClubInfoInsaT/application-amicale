// @flow

import * as React from 'react';
import {View} from 'react-native';
import {Text, H2, H3, Card, CardItem} from 'native-base';
import ThemeManager from "../utils/ThemeManager";
import i18n from "i18n-js";
import FetchedDataSectionList from "../components/FetchedDataSectionList";
import LocaleManager from "../utils/LocaleManager";

const DATA_URL = "https://srv-falcon.etud.insa-toulouse.fr/~amicale_app/menu/menu_data.json";

/**
 * Class defining the app's menu screen.
 * This screen fetches data from etud to render the RU menu
 */
export default class SelfMenuScreen extends FetchedDataSectionList {

    // Hard code strings as toLocaleDateString does not work on current android JS engine
    daysOfWeek = [];
    monthsOfYear = [];

    constructor() {
        super(DATA_URL, 0);
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.monday"));
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.tuesday"));
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.wednesday"));
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.thursday"));
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.friday"));
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.saturday"));
        this.daysOfWeek.push(i18n.t("date.daysOfWeek.sunday"));

        this.monthsOfYear.push(i18n.t("date.monthsOfYear.january"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.february"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.march"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.april"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.may"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.june"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.july"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.august"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.september"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.october"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.november"));
        this.monthsOfYear.push(i18n.t("date.monthsOfYear.december"));
    }

    getHeaderTranslation() {
        return i18n.t("screens.menuSelf");
    }

    getUpdateToastTranslations() {
        return [i18n.t("homeScreen.listUpdated"), i18n.t("homeScreen.listUpdateFail")];
    }

    getKeyExtractor(item: Object) {
        return item !== undefined ? item['name'] : undefined;
    }

    hasBackButton() {
        return true;
    }

    hasStickyHeader(): boolean {
        return true;
    }

    hasSideMenu() : boolean {
        return false;
    }

    createDataset(fetchedData: Object) {
        let result = [];
        // Prevent crash by giving a default value when fetchedData is empty (not yet available)
        if (Object.keys(fetchedData).length === 0) {
            result = [
                {
                    title: '',
                    data: [],
                    extraData: super.state,
                    keyExtractor: this.getKeyExtractor
                }
            ];
        }
        // fetched data is an array here
        for (let i = 0; i < fetchedData.length; i++) {
            result.push(
                {
                    title: this.getFormattedDate(fetchedData[i].date),
                    data: fetchedData[i].meal[0].foodcategory,
                    extraData: super.state,
                    keyExtractor: this.getKeyExtractor,
                }
            );
        }
        return result
    }

    getFormattedDate(dateString: string) {
        let dateArray = dateString.split('-');
        let date = new Date();
        date.setFullYear(parseInt(dateArray[0]), parseInt(dateArray[1]) - 1, parseInt(dateArray[2]));
        return this.daysOfWeek[date.getDay() - 1] + " " + date.getDate() + " " + this.monthsOfYear[date.getMonth()] + " " + date.getFullYear();
    }

    getRenderSectionHeader(title: string) {
        return (
            <Card style={{
                marginLeft: 10,
                marginRight: 10,
                marginTop: 10,
                marginBottom: 10,
                borderRadius: 50
            }}>
                <H2 style={{
                    textAlign: 'center',
                    marginTop: 10,
                    marginBottom: 10
                }}>{title}</H2>
            </Card>
        );
    }

    getRenderItem(item: Object, section: Object, data: Object) {
        return (
            <Card style={{
                flex: 0,
                marginLeft: 20,
                marginRight: 20
            }}>
                <CardItem style={{
                    paddingBottom: 0,
                    flexDirection: 'column'
                }}>
                    <H3 style={{
                        marginTop: 10,
                        marginBottom: 0,
                        color: ThemeManager.getCurrentThemeVariables().listNoteColor
                    }}>{item.name}</H3>
                    <View style={{
                        width: '80%',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        borderBottomWidth: 1,
                        borderBottomColor: ThemeManager.getCurrentThemeVariables().listBorderColor,
                        marginTop: 10,
                        marginBottom: 5,
                    }}/>
                </CardItem>
                <CardItem style={{
                    flexDirection: 'column',
                    paddingTop: 0,
                }}>
                    {item.dishes.map((object, i) =>
                        <View>
                            {object.name !== "" ?
                                <Text style={{
                                    marginTop: 5,
                                    marginBottom: 5
                                }}>{object.name.toLowerCase()}</Text>
                                : <View/>}
                        </View>)}
                </CardItem>
            </Card>
        );
    }

}

