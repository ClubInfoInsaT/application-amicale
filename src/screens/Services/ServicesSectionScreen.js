// @flow

import * as React from 'react';
import CardList from "../../components/Lists/CardList/CardList";
import CustomTabBar from "../../components/Tabbar/CustomTabBar";
import {withCollapsible} from "../../utils/withCollapsible";
import {Collapsible} from "react-navigation-collapsible";
import {CommonActions} from "@react-navigation/native";
import ConnectionManager from "../../managers/ConnectionManager";
import type {listItem} from "./ServicesScreen";
import ErrorView from "../../components/Screens/ErrorView";
import {ERROR_TYPE} from "../../utils/WebData";

type Props = {
    navigation: Object,
    route: Object,
    collapsibleStack: Collapsible,
}

type State = {
    isLoggedIn: boolean,
}

class ServicesSectionScreen extends React.Component<Props, State> {

    finalDataset: listItem;

    constructor(props) {
        super(props);
        this.handleNavigationParams();
        this.state = {
            isLoggedIn: ConnectionManager.getInstance().isLoggedIn(),
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', this.onFocus);

    }

    onFocus = () => {
        this.setState({isLoggedIn: ConnectionManager.getInstance().isLoggedIn()})
    }

    handleNavigationParams() {
        if (this.props.route.params != null) {
            if (this.props.route.params.data != null) {
                this.finalDataset = this.props.route.params.data;
                // reset params to prevent infinite loop
                this.props.navigation.dispatch(CommonActions.setParams({data: null}));
                this.props.navigation.setOptions({
                    headerTitle: this.finalDataset.title,
                });
            }
        }
    }

    render() {
        const {containerPaddingTop, scrollIndicatorInsetTop, onScroll} = this.props.collapsibleStack;
        if (!this.state.isLoggedIn && this.finalDataset.shouldLogin)
            return <ErrorView {...this.props} errorCode={ERROR_TYPE.BAD_TOKEN}/>;
        else
            return <CardList
                dataset={this.finalDataset.content}
                isHorizontal={false}
                onScroll={onScroll}
                contentContainerStyle={{
                    paddingTop: containerPaddingTop,
                    paddingBottom: CustomTabBar.TAB_BAR_HEIGHT + 20
                }}
                scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}
            />
    }
}

export default withCollapsible(ServicesSectionScreen);
