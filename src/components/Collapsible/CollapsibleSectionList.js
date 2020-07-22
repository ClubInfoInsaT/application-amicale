// @flow

import * as React from 'react';
import {Animated} from "react-native";
import type {CollapsibleComponentProps} from "./CollapsibleComponent";
import CollapsibleComponent from "./CollapsibleComponent";

type Props = {
    ...CollapsibleComponentProps
}

class CollapsibleSectionList extends React.Component<Props> {

    render() {
        return (
            <CollapsibleComponent
                {...this.props}
                component={Animated.SectionList}
            >
                {this.props.children}
            </CollapsibleComponent>
        );
    }
}

export default CollapsibleSectionList;
