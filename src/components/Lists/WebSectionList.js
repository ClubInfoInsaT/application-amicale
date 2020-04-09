// @flow

import * as React from 'react';
import {ERROR_TYPE, readData} from "../../utils/WebData";
import i18n from "i18n-js";
import {Snackbar} from 'react-native-paper';
import {RefreshControl, SectionList, View} from "react-native";
import ErrorView from "../Custom/ErrorView";
import BasicLoadingScreen from "../Custom/BasicLoadingScreen";

type Props = {
    navigation: Object,
    fetchUrl: string,
    autoRefreshTime: number,
    refreshOnFocus: boolean,
    renderItem: React.Node,
    renderSectionHeader: React.Node,
    stickyHeader: boolean,
    createDataset: Function,
    updateData: number,
    itemHeight: number | null,
}

type State = {
    refreshing: boolean,
    firstLoading: boolean,
    fetchedData: ?Object,
    snackbarVisible: boolean
};


const MIN_REFRESH_TIME = 5 * 1000;
/**
 * Component used to render a SectionList with data fetched from the web
 *
 * This is a pure component, meaning it will only update if a shallow comparison of state and props is different.
 * To force the component to update, change the value of updateData.
 */
export default class WebSectionList extends React.PureComponent<Props, State> {

    static defaultProps = {
        renderSectionHeader: null,
        stickyHeader: false,
        updateData: 0,
        itemHeight: null,
    };

    refreshInterval: IntervalID;
    lastRefresh: Date;

    state = {
        refreshing: false,
        firstLoading: true,
        fetchedData: undefined,
        snackbarVisible: false
    };

    onRefresh: Function;
    onFetchSuccess: Function;
    onFetchError: Function;
    getEmptySectionHeader: Function;

    constructor() {
        super();
        // creating references to functions used in render()
        this.onRefresh = this.onRefresh.bind(this);
        this.onFetchSuccess = this.onFetchSuccess.bind(this);
        this.onFetchError = this.onFetchError.bind(this);
        this.getEmptySectionHeader = this.getEmptySectionHeader.bind(this);
    }

    /**
     * Registers react navigation events on first screen load.
     * Allows to detect when the screen is focused
     */
    componentDidMount() {
        const onScreenFocus = this.onScreenFocus.bind(this);
        const onScreenBlur = this.onScreenBlur.bind(this);
        this.props.navigation.addListener('focus', onScreenFocus);
        this.props.navigation.addListener('blur', onScreenBlur);
        this.onRefresh();
    }

    /**
     * Refreshes data when focusing the screen and setup a refresh interval if asked to
     */
    onScreenFocus() {
        if (this.props.refreshOnFocus && this.lastRefresh !== undefined)
            this.onRefresh();
        if (this.props.autoRefreshTime > 0)
            this.refreshInterval = setInterval(this.onRefresh, this.props.autoRefreshTime)
    }

    /**
     * Removes any interval on un-focus
     */
    onScreenBlur() {
        clearInterval(this.refreshInterval);
    }


    /**
     * Callback used when fetch is successful.
     * It will update the displayed data and stop the refresh animation
     *
     * @param fetchedData The newly fetched data
     */
    onFetchSuccess(fetchedData: Object) {
        this.setState({
            fetchedData: fetchedData,
            refreshing: false,
            firstLoading: false
        });
        this.lastRefresh = new Date();
    }

    /**
     * Callback used when fetch encountered an error.
     * It will reset the displayed data and show an error.
     */
    onFetchError() {
        this.setState({
            fetchedData: undefined,
            refreshing: false,
            firstLoading: false
        });
        this.showSnackBar();
    }

    /**
     * Refreshes data and shows an animations while doing it
     */
    onRefresh() {
        let canRefresh;
        if (this.lastRefresh !== undefined)
            canRefresh = (new Date().getTime() - this.lastRefresh.getTime()) > MIN_REFRESH_TIME;
        else
            canRefresh = true;
        if (canRefresh) {
            this.setState({refreshing: true});
            readData(this.props.fetchUrl)
                .then(this.onFetchSuccess)
                .catch(this.onFetchError);
        }
    }

    /**
     * Gets an empty section header
     *
     * @param section The current section
     * @return {*}
     */
    getEmptySectionHeader({section}: Object) {
        return <View/>;
    }

    /**
     * Shows the error popup
     */
    showSnackBar = () => this.setState({snackbarVisible: true});

    /**
     * Hides the error popup
     */
    hideSnackBar = () => this.setState({snackbarVisible: false});

    itemLayout = (data, index) => ({length: this.props.itemHeight, offset: this.props.itemHeight * index, index});

    render() {
        let dataset = [];
        if (this.state.fetchedData !== undefined)
            dataset = this.props.createDataset(this.state.fetchedData);
        const shouldRenderHeader = this.props.renderSectionHeader !== null;
        return (
            <View>
                {/*$FlowFixMe*/}
                <SectionList
                    sections={dataset}
                    extraData={this.props.updateData}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                    //$FlowFixMe
                    renderSectionHeader={shouldRenderHeader ? this.props.renderSectionHeader : this.getEmptySectionHeader}
                    //$FlowFixMe
                    renderItem={this.props.renderItem}
                    stickySectionHeadersEnabled={this.props.stickyHeader}
                    contentContainerStyle={{minHeight: '100%'}}
                    style={{minHeight: '100%'}}
                    ListEmptyComponent={this.state.refreshing
                        ? <BasicLoadingScreen/>
                        : <ErrorView
                            {...this.props}
                            errorCode={ERROR_TYPE.CONNECTION_ERROR}
                            onRefresh={this.onRefresh}/>
                    }
                    getItemLayout={this.props.itemHeight !== null ? this.itemLayout : undefined}
                />
                <Snackbar
                    visible={this.state.snackbarVisible}
                    onDismiss={this.hideSnackBar}
                    action={{
                        label: 'OK',
                        onPress: () => {},
                    }}
                    duration={4000}
                >
                    {i18n.t("homeScreen.listUpdateFail")}
                </Snackbar>
            </View>
        );
    }
}
