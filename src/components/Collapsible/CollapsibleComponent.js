// @flow

import * as React from 'react';
import {withCollapsible} from "../../utils/withCollapsible";
import {Collapsible} from "react-navigation-collapsible";
import CustomTabBar from "../Tabbar/CustomTabBar";

export type CollapsibleComponentProps = {
    children?: React.Node,
    hasTab?: boolean,
    onScroll?: (event: SyntheticEvent<EventTarget>) => void,
};

type Props = {
    ...CollapsibleComponentProps,
    collapsibleStack: Collapsible,
    component: any,
}

class CollapsibleComponent extends React.Component<Props> {

    static defaultProps = {
        hasTab: false,
    }

    onScroll = (event: SyntheticEvent<EventTarget>) => {
        if (this.props.onScroll)
            this.props.onScroll(event);
    }

    render() {
        const Comp = this.props.component;
        const {containerPaddingTop, scrollIndicatorInsetTop, onScrollWithListener} = this.props.collapsibleStack;
        return (
            <Comp
                {...this.props}
                onScroll={onScrollWithListener(this.onScroll)}
                contentContainerStyle={{
                    paddingTop: containerPaddingTop,
                    paddingBottom: this.props.hasTab ? CustomTabBar.TAB_BAR_HEIGHT : 0,
                    minHeight: '100%'
                }}
                scrollIndicatorInsets={{top: scrollIndicatorInsetTop}}
            >
                {this.props.children}
            </Comp>
        );
    }
}

export default withCollapsible(CollapsibleComponent);
