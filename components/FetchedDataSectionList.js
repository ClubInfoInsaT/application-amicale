// @flow

import * as React from 'react';
import WebDataManager from "../utils/WebDataManager";
import {H3, Spinner, Tab, TabHeading, Tabs, Text} from "native-base";
import {RefreshControl, SectionList, View} from "react-native";
import CustomMaterialIcon from "./CustomMaterialIcon";
import i18n from 'i18n-js';
import ThemeManager from "../utils/ThemeManager";
import BaseContainer from "./BaseContainer";

type Props = {
    navigation: Object,
}

type State = {
    refreshing: boolean,
    firstLoading: boolean,
    fetchedData: Object,
    machinesWatched: Array<string>,
};

/**
 * Class used to create a basic list view using online json data.
 * Used by inheriting from it and redefining getters.
 */
export default class FetchedDataSectionList extends React.Component<Props, State> {

    webDataManager: WebDataManager;

    willFocusSubscription: function;
    willBlurSubscription: function;
    refreshInterval: IntervalID;
    refreshTime: number;
    lastRefresh: Date;

    minTimeBetweenRefresh = 60;

    constructor(fetchUrl: string, refreshTime: number) {
        super();
        this.webDataManager = new WebDataManager(fetchUrl);
        this.refreshTime = refreshTime;
    }

    state = {
        refreshing: false,
        firstLoading: true,
        fetchedData: {},
        machinesWatched: [],
    };

    /**
     * Get the translation for the header in the current language
     * @return {string}
     */
    getHeaderTranslation(): string {
        return "Header";
    }

    /**
     * Get the translation for the toasts in the current language
     * @return {string}
     */
    getUpdateToastTranslations(): Array<string> {
        return ["whoa", "nah"];
    }

    setMinTimeRefresh(value: number) {
        this.minTimeBetweenRefresh = value;
    }

    /**
     * Register react navigation events on first screen load.
     * Allows to detect when the screen is focused
     */
    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                this.onScreenFocus();
            }
        );
        this.willBlurSubscription = this.props.navigation.addListener(
            'willBlur',
            payload => {
                this.onScreenBlur();
            }
        );
    }

    /**
     * Refresh data when focusing the screen and setup a refresh interval if asked to
     */
    onScreenFocus() {
        this._onRefresh();
        if (this.refreshTime > 0)
            this.refreshInterval = setInterval(() => this._onRefresh(), this.refreshTime)
    }

    /**
     * Remove any interval on un-focus
     */
    onScreenBlur() {
        clearInterval(this.refreshInterval);
    }

    /**
     * Unregister from event when un-mounting components
     */
    componentWillUnmount() {
        if (this.willBlurSubscription !== undefined)
            this.willBlurSubscription.remove();
        if (this.willFocusSubscription !== undefined)
            this.willFocusSubscription.remove();
    }

    /**
     * Refresh data and show a toast if any error occurred
     * @private
     */
    _onRefresh = () => {
        let canRefresh;
        if (this.lastRefresh !== undefined)
            canRefresh = (new Date().getTime() - this.lastRefresh.getTime()) / 1000 > this.minTimeBetweenRefresh;
        else
            canRefresh = true;

        if (canRefresh) {
            this.setState({refreshing: true});
            this.webDataManager.readData()
                .then((fetchedData) => {
                    this.setState({
                        fetchedData: fetchedData,
                        refreshing: false,
                        firstLoading: false
                    });
                    this.lastRefresh = new Date();
                })
                .catch((err) => {
                    this.setState({
                        fetchedData: {},
                        refreshing: false,
                        firstLoading: false
                    });
                    this.webDataManager.showUpdateToast(this.getUpdateToastTranslations()[0], this.getUpdateToastTranslations()[1]);
                });
        }

    };

    /**
     * Get the render item to be used for display in the list.
     * Must be overridden by inheriting class.
     *
     * @param item
     * @param section
     * @param data
     * @return {*}
     */
    getRenderItem(item: Object, section: Object, data: Object) {
        return <View/>;
    }

    /**
     * Get the render item to be used for the section title in the list.
     * Must be overridden by inheriting class.
     *
     * @param title
     * @return {*}
     */
    getRenderSectionHeader(title: string) {
        return <View/>;
    }

    /**
     * Get the render item to be used when the list is empty.
     * No need to be overridden, has good defaults.
     *
     * @param text
     * @param isSpinner
     * @param icon
     * @return {*}
     */
    getEmptyRenderItem(text: string, isSpinner: boolean, icon: string) {
        return (
            <View>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: 100,
                    marginBottom: 20
                }}>
                    {isSpinner ?
                        <Spinner/>
                        :
                        <CustomMaterialIcon
                            icon={icon}
                            fontSize={100}
                            width={100}
                            color={ThemeManager.getCurrentThemeVariables().fetchedDataSectionListErrorText}/>}
                </View>

                <H3 style={{
                    textAlign: 'center',
                    marginRight: 20,
                    marginLeft: 20,
                    color: ThemeManager.getCurrentThemeVariables().fetchedDataSectionListErrorText
                }}>
                    {text}
                </H3>
            </View>);
    }

    /**
     * Create the dataset to be used in the list from the data fetched.
     * Must be overridden.
     *
     * @param fetchedData {Object}
     * @return {Array}
     */
    createDataset(fetchedData: Object): Array<Object> {
        return [];
    }

    /**
     * Create the dataset when no fetched data is available.
     * No need to be overridden, has good defaults.
     *
     * @return
     */
    createEmptyDataset() {
        return [
            {
                title: '',
                data: [
                    {
                        text: this.state.refreshing ?
                            i18n.t('general.loading') :
                            i18n.t('general.networkError'),
                        isSpinner: this.state.refreshing,
                        icon: this.state.refreshing ?
                            'refresh' :
                            'access-point-network-off'
                    }
                ],
                keyExtractor: (item: Object) => item.text,
            }
        ];
    }

    /**
     * Should the app use a tab layout instead of a section list ?
     * If yes, each section will be rendered in a new tab.
     * Can be overridden.
     *
     * @return {boolean}
     */
    hasTabs() {
        return false;
    }

    hasBackButton() {
        return false;
    }

    getRightButton() {
        return <View/>
    }

    hasStickyHeader() {
        return false;
    }

    hasSideMenu() {
        return true;
    }

    /**
     * Get the section list render using the generated dataset
     *
     * @param dataset
     * @return
     */
    getSectionList(dataset: Array<Object>) {
        let isEmpty = dataset[0].data.length === 0;
        if (isEmpty)
            dataset = this.createEmptyDataset();
        return (
            <SectionList
                sections={dataset}
                stickySectionHeadersEnabled={this.hasStickyHeader()}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                }
                renderSectionHeader={({section: {title}}) =>
                    isEmpty ?
                        <View/> :
                        this.getRenderSectionHeader(title)
                }
                renderItem={({item, section}) =>
                    isEmpty ?
                        this.getEmptyRenderItem(item.text, item.isSpinner, item.icon) :
                        this.getRenderItem(item, section, dataset)
                }
                style={{minHeight: 300, width: '100%'}}
                contentContainerStyle={
                    isEmpty ?
                        {flexGrow: 1, justifyContent: 'center', alignItems: 'center'} : {}
                }
            />
        );
    }

    /**
     * Generate the tabs containing the lists
     *
     * @param dataset
     * @return
     */
    getTabbedView(dataset: Array<Object>) {
        let tabbedView = [];
        for (let i = 0; i < dataset.length; i++) {
            tabbedView.push(
                <Tab heading={
                    <TabHeading>
                        <CustomMaterialIcon
                            icon={dataset[i].icon}
                            color={ThemeManager.getCurrentThemeVariables().tabIconColor}
                            fontSize={20}
                        />
                        <Text>{dataset[i].title}</Text>
                    </TabHeading>}
                     key={dataset[i].title}
                     style={{backgroundColor: ThemeManager.getCurrentThemeVariables().containerBgColor}}>
                    {this.getSectionList(
                        [
                            {
                                title: dataset[i].title,
                                data: dataset[i].data,
                                extraData: dataset[i].extraData,
                                keyExtractor: dataset[i].keyExtractor
                            }
                        ]
                    )}
                </Tab>);
        }
        return tabbedView;
    }

    render() {
        const nav = this.props.navigation;
        const dataset = this.createDataset(this.state.fetchedData);
        return (
            <BaseContainer
                navigation={nav} headerTitle={this.getHeaderTranslation()}
                headerRightButton={this.getRightButton()}
                hasTabs={this.hasTabs()}
                hasBackButton={this.hasBackButton()}
                hasSideMenu={this.hasSideMenu()}
            >
                {this.hasTabs() ?
                    <Tabs
                        tabContainerStyle={{
                            elevation: 0, // Fix for android shadow
                        }}
                    >
                        {this.getTabbedView(dataset)}
                    </Tabs>
                    :
                    this.getSectionList(dataset)
                }
            </BaseContainer>
        );
    }

}
