// @flow

import * as React from 'react';
import type {cardList} from "../../components/Lists/CardList/CardList";
import CardList from "../../components/Lists/CardList/CardList";
import CustomTabBar from "../../components/Tabbar/CustomTabBar";
import {withCollapsible} from "../../utils/withCollapsible";
import {Collapsible} from "react-navigation-collapsible";
import {CommonActions} from "@react-navigation/native";

type Props = {
    navigation: Object,
    route: Object,
    collapsibleStack: Collapsible,
}

type listItem = {
    title: string,
    description: string,
    image: string | number,
    content: cardList,
}

class ServicesSectionScreen extends React.Component<Props> {

    finalDataset: listItem;

    constructor(props) {
        super(props);
        this.handleNavigationParams();
    }

    handleNavigationParams() {
        if (this.props.route.params != null) {
            if (this.props.route.params.data != null) {
                this.finalDataset = this.props.route.params.data;
                // reset params to prevent infinite loop
                this.props.navigation.dispatch(CommonActions.setParams({data: null}));
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
