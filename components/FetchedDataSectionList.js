// @flow

import * as React from 'react';
import WebDataManager from "../utils/WebDataManager";
import {Container, H3, Tab, TabHeading, Tabs, Text} from "native-base";
import CustomHeader from "./CustomHeader";
import {RefreshControl, SectionList, View} from "react-native";
import CustomMaterialIcon from "./CustomMaterialIcon";
import i18n from 'i18n-js';
import ThemeManager from "../utils/ThemeManager";

type Props = {
    navigation: Object,
}

type State = {
    refreshing: boolean,
    firstLoading: boolean,
    fetchedData: Object,
    machinesWatched: Array<Object>,
};

export default class FetchedDataSectionList extends React.Component<Props, State> {

    webDataManager: WebDataManager;

    willFocusSubscription : function;
    willBlurSubscription : function;
    refreshInterval: IntervalID;
    refreshTime: number;

    constructor(fetchUrl: string, refreshTime : number) {
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

    getHeaderTranslation() {
        return "Header";
    }

    getUpdateToastTranslations() {
        return ["whoa", "nah"];
    }

    /**
     * Refresh the FetchedData on first screen load
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

    onScreenFocus() {
        this._onRefresh();
        if (this.refreshTime > 0)
            this.refreshInterval = setInterval(() => this._onRefresh(), this.refreshTime)
    }

    onScreenBlur() {
        clearInterval(this.refreshInterval);
    }


    componentWillUnmount() {
        if (this.willBlurSubscription !== undefined)
            this.willBlurSubscription.remove();
        if (this.willFocusSubscription !== undefined)
            this.willFocusSubscription.remove();

    }


    _onRefresh = () => {
        console.log('refresh');
        this.setState({refreshing: true});
        this.webDataManager.readData().then((fetchedData) => {
            this.setState({
                fetchedData: fetchedData,
                refreshing: false,
                firstLoading: false
            });
            this.webDataManager.showUpdateToast(this.getUpdateToastTranslations()[0], this.getUpdateToastTranslations()[1]);
        });
    };

    getRenderItem(item: Object, section: Object, data: Object) {
        return <View/>;
    }

    getRenderSectionHeader(title: String) {
        return <View/>;
    }

    getEmptyRenderItem(text: string, icon: string) {
        return (
            <View>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: 100,
                    marginBottom: 20
                }}>
                    <CustomMaterialIcon
                        icon={icon}
                        fontSize={100}
                        width={100}
                        color={ThemeManager.getCurrentThemeVariables().fetchedDataSectionListErrorText}/>
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
     * Create the dataset to be used in the list from the data fetched
     * @param fetchedData {Object}
     * @return {Array}
     */
    createDataset(fetchedData: Object): Array<Object> {
        return [];
    }

    createEmptyDataset() {
        return [
            {
                title: '',
                data: [
                    {
                        text: this.state.refreshing ?
                            i18n.t('general.loading') :
                            i18n.t('general.networkError'),
                        icon: this.state.refreshing ?
                            'refresh' :
                            'access-point-network-off'
                    }
                ],
                keyExtractor: (item: Object) => item.text,
            }
        ];
    }

    hasTabs() {
        return false;
    }

    getSectionList(dataset: Array<Object>) {
        let isEmpty = dataset[0].data.length === 0;
        if (isEmpty)
            dataset = this.createEmptyDataset();
        return (
            <SectionList
                sections={dataset}
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
                        this.getEmptyRenderItem(item.text, item.icon) :
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

    getTabbedView(dataset: Array<Object>) {
        let tabbedView = [];
        for (let i = 0; i < dataset.length; i++) {
            tabbedView.push(
                <Tab heading={
                    <TabHeading>
                        <CustomMaterialIcon icon={dataset[i].icon}
                                            color={'#fff'}
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
            <Container>
                <CustomHeader navigation={nav} title={this.getHeaderTranslation()}/>
                {this.hasTabs() ?
                    <Tabs>
                        {this.getTabbedView(dataset)}
                    </Tabs>
                    :
                    this.getSectionList(dataset)
                }
            </Container>
        );
    }

}
