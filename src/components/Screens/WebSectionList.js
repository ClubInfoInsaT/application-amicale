// @flow

import * as React from 'react';
import {ERROR_TYPE, readData} from "../../utils/WebData";
import i18n from "i18n-js";
import {Snackbar} from 'react-native-paper';
import {RefreshControl, View} from "react-native";
import ErrorView from "./ErrorView";
import BasicLoadingScreen from "./BasicLoadingScreen";
import {withCollapsible} from "../../utils/withCollapsible";
import * as Animatable from 'react-native-animatable';
import CustomTabBar from "../Tabbar/CustomTabBar";
import {Collapsible} from "react-navigation-collapsible";
import {StackNavigationProp} from "@react-navigation/stack";
import CollapsibleSectionList from "../Collapsible/CollapsibleSectionList";

type Props = {
    navigation: StackNavigationProp,
    fetchUrl: string,
    autoRefreshTime: number,
    refreshOnFocus: boolean,
    renderItem: (data: { [key: string]: any }) => React.Node,
    createDataset: (data: { [key: string]: any } | null, isLoading?: boolean) => Array<Object>,
    onScroll: (event: SyntheticEvent<EventTarget>) => void,
    collapsibleStack: Collapsible,

    showError: boolean,
    itemHeight?: number,
    updateData?: number,
    renderListHeaderComponent?: (data: { [key: string]: any } | null) => React.Node,
    renderSectionHeader?: (data: { section: { [key: string]: any } }, isLoading?: boolean) => React.Node,
    stickyHeader?: boolean,
}

type State = {
    refreshing: boolean,
    firstLoading: boolean,
    fetchedData: { [key: string]: any } | null,
    snackbarVisible: boolean
};


const MIN_REFRESH_TIME = 5 * 1000;

/**
 * Component used to render a SectionList with data fetched from the web
 *
 * This is a pure component, meaning it will only update if a shallow comparison of state and props is different.
 * To force the component to update, change the value of updateData.
 */
class WebSectionList extends React.PureComponent<Props, State> {

    static defaultProps = {
        stickyHeader: false,
        updateData: 0,
        showError: true,
    };

    refreshInterval: IntervalID;
    lastRefresh: Date | null;

    state = {
        refreshing: false,
        firstLoading: true,
        fetchedData: null,
        snackbarVisible: false
    };

    /**
     * Registers react navigation events on first screen load.
     * Allows to detect when the screen is focused
     */
    componentDidMount() {
        this.props.navigation.addListener('focus', this.onScreenFocus);
        this.props.navigation.addListener('blur', this.onScreenBlur);
        this.lastRefresh = null;
        this.onRefresh();
    }

    /**
     * Refreshes data when focusing the screen and setup a refresh interval if asked to
     */
    onScreenFocus = () => {
        if (this.props.refreshOnFocus && this.lastRefresh)
            this.onRefresh();
        if (this.props.autoRefreshTime > 0)
            this.refreshInterval = setInterval(this.onRefresh, this.props.autoRefreshTime)
    }

    /**
     * Removes any interval on un-focus
     */
    onScreenBlur = () => {
        clearInterval(this.refreshInterval);
    }


    /**
     * Callback used when fetch is successful.
     * It will update the displayed data and stop the refresh animation
     *
     * @param fetchedData The newly fetched data
     */
    onFetchSuccess = (fetchedData: { [key: string]: any }) => {
        this.setState({
            fetchedData: fetchedData,
            refreshing: false,
            firstLoading: false
        });
        this.lastRefresh = new Date();
    };

    /**
     * Callback used when fetch encountered an error.
     * It will reset the displayed data and show an error.
     */
    onFetchError = () => {
        this.setState({
            fetchedData: null,
            refreshing: false,
            firstLoading: false
        });
        this.showSnackBar();
    };

    /**
     * Refreshes data and shows an animations while doing it
     */
    onRefresh = () => {
        let canRefresh;
        if (this.lastRefresh != null) {
            const last = this.lastRefresh;
            canRefresh = (new Date().getTime() - last.getTime()) > MIN_REFRESH_TIME;
        } else
            canRefresh = true;
        if (canRefresh) {
            this.setState({refreshing: true});
            readData(this.props.fetchUrl)
                .then(this.onFetchSuccess)
                .catch(this.onFetchError);
        }
    };

    /**
     * Shows the error popup
     */
    showSnackBar = () => this.setState({snackbarVisible: true});

    /**
     * Hides the error popup
     */
    hideSnackBar = () => this.setState({snackbarVisible: false});

    itemLayout = (data: { [key: string]: any }, index: number) => {
        const height = this.props.itemHeight;
        if (height == null)
            return undefined;
        return {
            length: height,
            offset: height * index,
            index
        }
    };

    renderSectionHeader = (data: { section: { [key: string]: any } }) => {
        if (this.props.renderSectionHeader != null) {
            return (
                <Animatable.View
                    animation={"fadeInUp"}
                    duration={500}
                    useNativeDriver
                >
                    {this.props.renderSectionHeader(data, this.state.refreshing)}
                </Animatable.View>
            );
        } else
            return null;
    }

    renderItem = (data: {
        item: { [key: string]: any },
        index: number,
        section: { [key: string]: any },
        separators: { [key: string]: any },
    }) => {
        return (
            <Animatable.View
                animation={"fadeInUp"}
                duration={500}
                useNativeDriver
            >
                {this.props.renderItem(data)}
            </Animatable.View>
        );
    }

    onScroll = (event: SyntheticEvent<EventTarget>) => {
        if (this.props.onScroll)
            this.props.onScroll(event);
    }

    render() {
        let dataset = [];
        if (this.state.fetchedData != null || (this.state.fetchedData == null && !this.props.showError)) {
            dataset = this.props.createDataset(this.state.fetchedData, this.state.refreshing);
        }
        const {containerPaddingTop} = this.props.collapsibleStack;
        return (
            <View>
                <CollapsibleSectionList
                    sections={dataset}
                    extraData={this.props.updateData}
                    refreshControl={
                        <RefreshControl
                            progressViewOffset={containerPaddingTop}
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                    renderSectionHeader={this.renderSectionHeader}
                    renderItem={this.renderItem}
                    stickySectionHeadersEnabled={this.props.stickyHeader}
                    style={{minHeight: '100%'}}
                    ListHeaderComponent={this.props.renderListHeaderComponent != null
                        ? this.props.renderListHeaderComponent(this.state.fetchedData)
                        : null}
                    ListEmptyComponent={this.state.refreshing
                        ? <BasicLoadingScreen/>
                        : <ErrorView
                            {...this.props}
                            errorCode={ERROR_TYPE.CONNECTION_ERROR}
                            onRefresh={this.onRefresh}/>
                    }
                    getItemLayout={this.props.itemHeight != null ? this.itemLayout : undefined}
                    onScroll={this.onScroll}
                    hasTab={true}
                />
                <Snackbar
                    visible={this.state.snackbarVisible}
                    onDismiss={this.hideSnackBar}
                    action={{
                        label: 'OK',
                        onPress: () => {
                        },
                    }}
                    duration={4000}
                    style={{
                        bottom: CustomTabBar.TAB_BAR_HEIGHT
                    }}
                >
                    {i18n.t("general.listUpdateFail")}
                </Snackbar>
            </View>
        );
    }
}

export default withCollapsible(WebSectionList);
