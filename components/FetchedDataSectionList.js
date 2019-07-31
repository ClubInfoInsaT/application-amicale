// @flow

import * as React from 'react';
import WebDataManager from "../utils/WebDataManager";
import {Container, Tab, TabHeading, Tabs, Text} from "native-base";
import CustomHeader from "./CustomHeader";
import {RefreshControl, SectionList, View} from "react-native";
import CustomMaterialIcon from "./CustomMaterialIcon";

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

    constructor(fetchUrl: string) {
        super();
        this.webDataManager = new WebDataManager(fetchUrl);
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
        this._onRefresh();
    }

    _onRefresh = () => {
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

    /**
     * Create the dataset to be used in the list from the data fetched
     * @param fetchedData {Object}
     * @return {Array}
     */
    createDataset(fetchedData: Object): Array<Object> {
        return [];
    }

    hasTabs() {
        return false;
    }

    getSectionList(dataset: Array<Object>) {
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
                    this.getRenderSectionHeader(title)
                }
                renderItem={({item, section}) =>
                    this.getRenderItem(item, section, dataset)
                }
                style={{minHeight: 300, width: '100%'}}
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
                     key={dataset[i].title}>
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
