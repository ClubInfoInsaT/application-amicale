// @flow

import * as React from 'react';
import CardList from "../../components/Lists/CardList/CardList";
import CustomTabBar from "../../components/Tabbar/CustomTabBar";
import {withCollapsible} from "../../utils/withCollapsible";
import {Collapsible} from "react-navigation-collapsible";
import {CommonActions} from "@react-navigation/native";
import type {listItem} from "./ServicesScreen";
import {StackNavigationProp} from "@react-navigation/stack";

type Props = {
    navigation: StackNavigationProp,
    route: { params: { data: listItem | null } },
    collapsibleStack: Collapsible,
}

class ServicesSectionScreen extends React.Component<Props> {

    finalDataset: listItem;

    constructor(props) {
        super(props);
        this.handleNavigationParams();
    }

    /**
     * Recover the list to display from navigation parameters
     */
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
