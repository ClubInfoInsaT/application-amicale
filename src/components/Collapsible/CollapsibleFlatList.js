// @flow

import * as React from 'react';
import {Animated} from "react-native";
import type {CollapsibleComponentProps} from "./CollapsibleComponent";
import CollapsibleComponent from "./CollapsibleComponent";

type Props = {
    ...CollapsibleComponentProps
}

class CollapsibleFlatList extends React.Component<Props> {

    render() {
        return (
            <CollapsibleComponent
                {...this.props}
                component={Animated.FlatList}
            >
                {this.props.children}
            </CollapsibleComponent>
        );
    }
}

export default CollapsibleFlatList;
